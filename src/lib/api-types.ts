// Shapes shared by the Express server and the browser.

export interface JavaInfo {
  ok: boolean;
  version: string | null;
  major: number | null;
  message: string;
}

export interface JavaError {
  /** Line in the player's editor (1-based), or null if it isn't in their code. */
  line: number | null;
  message: string;
  /** Beginner-friendly explanation, when we recognise the error. */
  hint?: string;
}

export type RunStatus = 'ok' | 'compile_error' | 'runtime_error' | 'timeout' | 'output_limit' | 'no_java';

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  errors: JavaError[];
  timeMs: number;
}

export interface RunRequest {
  code: string;
  stdin?: string;
  /** When set, harness challenges wrap the code in their demo main(). */
  levelId?: string;
  challengeIndex?: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  /** Only filled in when the test is visible or the player has failed twice. */
  details?: { input?: string; expected: string; actual: string };
}

export interface SubmitRequest {
  levelId: string;
  challengeIndex: number;
  code: string;
  /** Failed submissions before this one (used to decide whether to reveal hidden tests). */
  priorFails: number;
}

export interface SubmitResult {
  passed: boolean;
  /** Set when the code didn't compile or crashed before tests could run. */
  run?: RunResult;
  tests: TestResult[];
  revealed: boolean;
}
