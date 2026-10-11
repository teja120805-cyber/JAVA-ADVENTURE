import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { JavaInfo } from '../src/lib/api-types';

export const MIN_JAVA = 17;

const INSTALL_HELP =
  'Install a JDK (Temurin 21 is a good choice) from https://adoptium.net, or on Windows run ' +
  '"winget install EclipseAdoptium.Temurin.21.JDK". Then close and reopen your terminal and run npm run dev again.';

/**
 * The java executable to launch. Some installers put a small "java.exe" shim on the
 * PATH that starts the real JVM as a child process; we resolve the real one from
 * java.home so timeouts can stop it cleanly.
 */
let javaExecutable = 'java';
export const getJavaExecutable = () => javaExecutable;

const notFound = (): JavaInfo => ({
  ok: false,
  version: null,
  major: null,
  message: `Java was not found on your PATH. ${INSTALL_HELP}`,
});

/** Runs `java -version` and reports whether a usable JDK is on the PATH. */
export function detectJava(): Promise<JavaInfo> {
  return new Promise((resolve) => {
    let output = '';
    let child;
    try {
      child = spawn('java', ['-XshowSettings:properties', '-version'], { windowsHide: true });
    } catch {
      resolve(notFound());
      return;
    }
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    child.on('error', () => resolve(notFound()));
    child.on('close', () => {
      const match = output.match(/version "([^"]+)"/);
      if (!match) {
        resolve({ ok: false, version: null, major: null, message: `Couldn't read the Java version. ${INSTALL_HELP}` });
        return;
      }
      const home = output.match(/java\.home = (.+)/)?.[1]?.trim();
      if (home) {
        const exe = join(home, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
        if (existsSync(exe)) javaExecutable = exe;
      }
      const version = match[1];
      // "1.8.0_392" is Java 8; "17.0.12" is Java 17.
      const parts = version.split(/[._-]/).map(Number);
      const major = parts[0] === 1 ? parts[1] : parts[0];
      if (major < MIN_JAVA) {
        resolve({
          ok: false,
          version,
          major,
          message: `Found Java ${version}, but Java Quest needs JDK ${MIN_JAVA} or newer. ${INSTALL_HELP}`,
        });
        return;
      }
      resolve({ ok: true, version, major, message: `Java ${version} is ready.` });
    });
  });
}
