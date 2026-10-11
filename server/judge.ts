import { randomBytes } from 'node:crypto';
import type { Challenge, HarnessCheck } from '../src/content/types';
import type { RunResult, SubmitResult, TestResult } from '../src/lib/api-types';
import { compareOutput } from '../src/lib/compare';
import { REVEAL_AFTER_FAILS } from '../src/lib/rules';
import { classify, countLines, runRaw } from './runner';


interface Wrapped {
  source: string;
  /** Lines of hidden code before the player's first line. */
  offset: number;
}

/** Puts the player's method(s) or class(es) together with a hidden Main class. */
export function wrapPlayerCode(mode: HarnessCheck['mode'], playerCode: string, mainMethod: string): Wrapped {
  if (mode === 'method') {
    const prefix = 'public class Main {\n';
    return { source: `${prefix}${playerCode}\n\n${mainMethod}\n}\n`, offset: countLines(prefix) - 1 };
  }
  // Single-file launch runs the FIRST class in the file, so Main has to come first.
  const prefix = `public class Main {\n${mainMethod}\n}\n\n`;
  return { source: `${prefix}${playerCode}\n`, offset: countLines(prefix) - 1 };
}

function indent(code: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((l) => pad + l)
    .join('\n');
}

/** The main() used by the Run button for harness challenges. */
export function demoMain(check: HarnessCheck): string {
  return `  public static void main(String[] args) {\n${indent(check.demo, 4)}\n  }`;
}

/**
 * Builds a main() that runs each test in turn, captures what it prints, catches any
 * exception, and reports each result on its own marker line.
 */
export function harnessMain(check: HarnessCheck, nonce: string): string {
  const cases = check.tests
    .map((t, i) => `        case ${i}: {\n${indent(t.code, 10)}\n          break;\n        }`)
    .join('\n');
  return `  public static void main(String[] __args) {
    java.io.PrintStream __out = System.out;
    java.util.Base64.Encoder __b64 = java.util.Base64.getEncoder();
    for (int __t = 0; __t < ${check.tests.length}; __t++) {
      java.io.ByteArrayOutputStream __buf = new java.io.ByteArrayOutputStream();
      System.setOut(new java.io.PrintStream(__buf, true, java.nio.charset.StandardCharsets.UTF_8));
      String __err = "";
      try {
        switch (__t) {
${cases}
        }
      } catch (Throwable __e) {
        __err = String.valueOf(__e);
      }
      System.out.flush();
      System.setOut(__out);
      __out.println("@@JQ@@${nonce}|" + __t + "|" + __b64.encodeToString(__buf.toByteArray()) + "|"
          + __b64.encodeToString(__err.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    }
  }`;
}

const decode = (b64: string) => Buffer.from(b64, 'base64').toString('utf8');

function describeDiff(actual: string, expected: string): string {
  const diff = compareOutput(actual, expected);
  if (diff.pass) return 'Passed!';
  if (diff.firstDiffLine === undefined) return 'The output was different.';
  return `Line ${diff.firstDiffLine}: expected "${diff.expectedLine}" but got "${diff.actualLine}".`;
}

/** A test result plus what to say if its details must stay hidden for now. */
interface Graded extends TestResult {
  secret: boolean;
  vague: string;
}

async function gradeOutput(challenge: Challenge, code: string): Promise<{ run?: RunResult; tests: Graded[] }> {
  if (challenge.check.kind !== 'output') throw new Error('not an output check');
  const tests = challenge.check.tests;
  const raws = await Promise.all(tests.map((t) => runRaw(code, t.stdin ?? '')));
  const runs = raws.map((r) => classify(r, 0, countLines(code)));

  // A compile error is the same for every test, so report it once.
  if (runs[0].status === 'compile_error' || runs[0].status === 'no_java') return { run: runs[0], tests: [] };

  const graded = tests.map((test, i): Graded => {
    const run = runs[i];
    const details = { input: test.stdin, expected: test.expected, actual: run.stdout };
    const secret = Boolean(test.hidden);
    if (run.status !== 'ok') {
      const message = run.errors[0]?.message ?? 'The program crashed.';
      return { name: test.name, passed: false, message, vague: message, details, secret };
    }
    const pass = compareOutput(run.stdout, test.expected).pass;
    return {
      name: test.name,
      passed: pass,
      message: pass ? 'Passed!' : describeDiff(run.stdout, test.expected),
      vague: 'Your output was not quite right.',
      details,
      secret,
    };
  });
  return { run: runs.find((r) => r.status !== 'ok'), tests: graded };
}

async function gradeHarness(check: HarnessCheck, code: string): Promise<{ run?: RunResult; tests: Graded[] }> {
  const nonce = randomBytes(6).toString('hex');
  const { source, offset } = wrapPlayerCode(check.mode, code, harnessMain(check, nonce));
  const raw = await runRaw(source);
  const run = classify(raw, offset, countLines(code));

  if (run.status === 'compile_error' || run.status === 'no_java') {
    // Errors on hidden lines mean the tests couldn't call the player's code.
    for (const e of run.errors) {
      if (e.line === null && run.status === 'compile_error') {
        const generic =
          "The hidden tests couldn't use your code. Check that the class, method and parameter names and types match the challenge exactly.";
        e.hint = e.hint ? `${e.hint} ${generic}` : generic;
      }
    }
    return { run, tests: [] };
  }

  const reported = new Map<number, { out: string; err: string }>();
  const prefix = `@@JQ@@${nonce}|`;
  for (const line of raw.stdout.split(/\r?\n/)) {
    if (!line.startsWith(prefix)) continue;
    const [index, out, err] = line.slice(prefix.length).split('|');
    reported.set(Number(index), { out: decode(out ?? ''), err: decode(err ?? '') });
  }

  const graded = check.tests.map((test, i): Graded => {
    const got = reported.get(i);
    const details = { input: test.code, expected: test.expected, actual: got?.out ?? '' };
    const base = { name: test.name, details, secret: true };
    if (!got) {
      const why = run.status === 'ok' ? 'This test never finished.' : run.errors[0]?.message ?? 'The program stopped early.';
      return { ...base, passed: false, message: why, vague: why };
    }
    if (got.err) {
      const msg = `Your code threw ${got.err}`;
      return { ...base, passed: false, message: msg, vague: msg };
    }
    const pass = compareOutput(got.out, test.expected).pass;
    return {
      ...base,
      passed: pass,
      message: pass ? 'Passed!' : describeDiff(got.out, test.expected),
      vague: 'Not quite: this test got a different answer.',
    };
  });
  return { run: run.status === 'ok' ? undefined : run, tests: graded };
}

/**
 * Grades a submission. Hidden test details (inputs, expected output) are only sent
 * back once the player has failed REVEAL_AFTER_FAILS times, counting this attempt.
 */
export async function judge(challenge: Challenge, code: string, priorFails: number): Promise<SubmitResult> {
  const { run, tests } =
    challenge.check.kind === 'output' ? await gradeOutput(challenge, code) : await gradeHarness(challenge.check, code);
  const passed = tests.length > 0 && tests.every((t) => t.passed);
  const revealed = priorFails + (passed ? 0 : 1) >= REVEAL_AFTER_FAILS;

  const visible: TestResult[] = tests.map(({ secret, vague, ...t }) => {
    if (!secret || revealed) return t;
    return { ...t, message: t.passed ? t.message : vague, details: undefined };
  });
  return { passed, run, tests: visible, revealed };
}

/** Runs the player's code for the Run button (wrapping harness challenges in their demo main). */
export async function runForPlayer(code: string, stdin: string, challenge?: Challenge): Promise<RunResult> {
  if (!challenge || challenge.check.kind !== 'harness') {
    return classify(await runRaw(code, stdin), 0, countLines(code));
  }
  const { source, offset } = wrapPlayerCode(challenge.check.mode, code, demoMain(challenge.check));
  const result = classify(await runRaw(source, stdin), offset, countLines(code));
  for (const e of result.errors) {
    if (e.line === null && result.status === 'compile_error') {
      const generic =
        "The Run button's example code couldn't use your code. Have you written every method or class the challenge asks for, with exactly the right names and parameters?";
      e.hint = e.hint ? `${e.hint} ${generic}` : generic;
    }
  }
  return result;
}
