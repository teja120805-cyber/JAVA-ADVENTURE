import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { JavaError, RunResult } from '../src/lib/api-types';
import { friendlyHint } from './hints';
import { getJavaExecutable } from './java';

export const TIMEOUT_MS = 5000;
export const MAX_OUTPUT = 64 * 1024;
const MAX_PARALLEL = 4;

const JVM_FLAGS = [
  '-XX:TieredStopAtLevel=1', // faster start-up for tiny programs
  '-XX:+UseSerialGC',
  '-Xmx256m',
  '-Dfile.encoding=UTF-8',
  '-Dsun.stdout.encoding=UTF-8',
  '-Dsun.stderr.encoding=UTF-8',
  '-Dstdout.encoding=UTF-8',
  '-Dstderr.encoding=UTF-8',
];

interface RawRun {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  tooMuchOutput: boolean;
  noJava: boolean;
  timeMs: number;
}

// A tiny queue so we never start more than MAX_PARALLEL JVMs at once.
let active = 0;
const waiting: (() => void)[] = [];
async function withSlot<T>(task: () => Promise<T>): Promise<T> {
  if (active >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  active++;
  try {
    return await task();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

/**
 * Writes `source` to a fresh temp folder as Main.java and runs `java Main.java`
 * (single-file source launch). Kills it after TIMEOUT_MS or MAX_OUTPUT bytes.
 * NOTE: this is a simple process sandbox for local learning only. It does not stop
 * code from reading or writing files on your computer.
 */
export function runRaw(source: string, stdin = ''): Promise<RawRun> {
  return withSlot(async () => {
    const dir = await mkdtemp(join(tmpdir(), 'java-quest-'));
    try {
      await writeFile(join(dir, 'Main.java'), source, 'utf8');
      return await spawnJava(dir, stdin);
    } finally {
      await rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  });
}

/** Stops the process and anything it started (on Windows, child.kill only stops the parent). */
function killTree(child: ChildProcess): void {
  if (process.platform === 'win32' && child.pid) {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true }).on('error', () => child.kill());
  } else {
    child.kill('SIGKILL');
  }
}

function spawnJava(cwd: string, stdin: string): Promise<RawRun> {
  return new Promise((resolve) => {
    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let size = 0;
    let timedOut = false;
    let tooMuchOutput = false;
    let settled = false;

    const child = spawn(getJavaExecutable(), [...JVM_FLAGS, 'Main.java'], { cwd, windowsHide: true });

    const finish = (exitCode: number | null, noJava = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exitCode, stdout, stderr, timedOut, tooMuchOutput, noJava, timeMs: Date.now() - started });
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child);
    }, TIMEOUT_MS);

    const collect = (which: 'out' | 'err') => (chunk: Buffer) => {
      if (tooMuchOutput) return;
      size += chunk.length;
      if (size > MAX_OUTPUT) {
        tooMuchOutput = true;
        killTree(child);
        return;
      }
      if (which === 'out') stdout += chunk.toString('utf8');
      else stderr += chunk.toString('utf8');
    };
    child.stdout.on('data', collect('out'));
    child.stderr.on('data', collect('err'));

    child.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') finish(null, true);
      else {
        stderr += String(err);
        finish(null);
      }
    });
    child.on('close', (code) => finish(code));
    // If a grandchild process keeps the pipes open after a kill, don't wait forever.
    child.on('exit', (code) => setTimeout(() => finish(code), 500));

    child.stdin.on('error', () => {}); // program may exit before reading stdin
    child.stdin.end(stdin);
  });
}

/**
 * Turns a raw run into a RunResult for the player.
 * `offset` is how many lines of hidden code come before the player's code, so error
 * line numbers can point at the right line in their editor.
 */
export function classify(raw: RawRun, offset = 0, playerLines = Infinity): RunResult {
  const mapLine = (n: number): number | null => {
    const line = n - offset;
    return line >= 1 && line <= playerLines ? line : null;
  };
  // Show line numbers from the player's point of view in raw error text too, and
  // drop the source snippet javac prints for errors inside hidden test code.
  const kept: string[] = [];
  let hiding = false;
  for (const l of raw.stderr.split(/\r?\n/)) {
    if (l.startsWith('Picked up ')) continue;
    const err = l.match(/Main\.java:(\d+): error/);
    if (err) hiding = mapLine(Number(err[1])) === null;
    else if (/^\d+ errors?$|^error: |^\S/.test(l)) hiding = false;
    else if (hiding && !/^\s+(symbol|location):/.test(l)) continue;
    kept.push(l);
  }
  const stderr = kept.join('\n').replace(/Main\.java:(\d+)/g, (_, n) => {
    const line = mapLine(Number(n));
    return line === null ? 'Main.java (hidden test code)' : `Main.java:${line}`;
  });
  const base = { stdout: raw.stdout, stderr, timeMs: raw.timeMs };

  if (raw.noJava) {
    return {
      ...base,
      status: 'no_java',
      errors: [{ line: null, message: 'Java is not installed or not on your PATH.' }],
    };
  }
  if (raw.timedOut) {
    return {
      ...base,
      status: 'timeout',
      errors: [
        {
          line: null,
          message: `Your program ran for more than ${TIMEOUT_MS / 1000} seconds and was stopped.`,
          hint: 'Is there a loop that never ends? Check that its condition eventually becomes false, or that it is waiting for input.',
        },
      ],
    };
  }
  if (raw.tooMuchOutput) {
    return {
      ...base,
      status: 'output_limit',
      errors: [
        {
          line: null,
          message: `Your program printed more than ${MAX_OUTPUT / 1024} KB and was stopped.`,
          hint: 'A loop is probably printing forever. Check its condition.',
        },
      ],
    };
  }

  const launcherFailed = raw.exitCode !== 0 && /^error: /m.test(raw.stderr) && !/Exception in thread/.test(raw.stderr);
  if (/error: compilation failed/.test(raw.stderr) || launcherFailed) {
    const errors: JavaError[] = [];
    const re = /Main\.java:(\d+): error: (.*)/g;
    for (const m of raw.stderr.matchAll(re)) {
      errors.push({ line: mapLine(Number(m[1])), message: m[2].trim(), hint: friendlyHint(m[2]) });
    }
    if (errors.length === 0) {
      const launcher = raw.stderr.match(/^error: (.*)$/m)?.[1] ?? 'Your code could not be compiled.';
      errors.push({ line: null, message: launcher, hint: friendlyHint(launcher) });
    }
    const unique = errors.filter((e, i) => errors.findIndex((o) => o.line === e.line && o.message === e.message) === i);
    return { ...base, status: 'compile_error', errors: unique };
  }

  if (raw.exitCode !== 0) {
    const exception = raw.stderr.match(/Exception in thread "[^"]*" (.*)/)?.[1];
    const at = raw.stderr.match(/\(Main\.java:(\d+)\)/);
    const message = exception ?? (raw.stderr.trim() || `Your program stopped with exit code ${raw.exitCode}.`);
    return {
      ...base,
      status: 'runtime_error',
      errors: [{ line: at ? mapLine(Number(at[1])) : null, message, hint: friendlyHint(message) }],
    };
  }

  return { ...base, status: 'ok', errors: [] };
}

export function countLines(text: string): number {
  return text.split('\n').length;
}

export async function runJava(source: string, stdin = ''): Promise<RunResult> {
  return classify(await runRaw(source, stdin));
}
