import type { JavaError, RunResult, SubmitResult } from '../lib/api-types';
import { REVEAL_AFTER_FAILS } from '../lib/rules';
import styles from './Console.module.css';

export type ConsoleState =
  | { kind: 'idle' }
  | { kind: 'busy'; what: 'run' | 'submit' }
  | { kind: 'run'; result: RunResult }
  | { kind: 'submit'; result: SubmitResult }
  | { kind: 'error'; message: string };

const STATUS_TITLE: Record<RunResult['status'], string> = {
  ok: 'Program finished',
  compile_error: 'Compile error',
  runtime_error: 'Runtime error',
  timeout: 'Time limit reached',
  output_limit: 'Too much output',
  no_java: 'Java not found',
};

function ErrorList({ errors, onJump }: { errors: JavaError[]; onJump: (line: number) => void }) {
  return (
    <ul className={styles.errors}>
      {errors.map((e, i) => (
        <li key={i}>
          {e.line !== null ? (
            <button className={styles.lineLink} onClick={() => onJump(e.line!)}>
              Line {e.line}
            </button>
          ) : null}
          <span className={styles.errMsg}>{e.message}</span>
          {e.hint && <div className={styles.hint}>💡 {e.hint}</div>}
        </li>
      ))}
    </ul>
  );
}

function RunView({ result, onJump, showStdout = true }: { result: RunResult; onJump: (line: number) => void; showStdout?: boolean }) {
  const ok = result.status === 'ok';
  return (
    <div>
      <div className={`${styles.status} ${ok ? styles.good : styles.bad}`}>
        {ok ? '✔' : '✘'} {STATUS_TITLE[result.status]}
        <span className={styles.time}>{(result.timeMs / 1000).toFixed(1)}s</span>
      </div>
      {result.errors.length > 0 && <ErrorList errors={result.errors} onJump={onJump} />}
      {showStdout && (result.stdout || ok) && (
        <pre className={styles.stdout}>{result.stdout || <span className={styles.dim}>(no output)</span>}</pre>
      )}
      {result.stderr && (
        <details className={styles.raw} open={ok}>
          <summary>{ok ? 'Error stream (System.err)' : 'Full error text from Java'}</summary>
          <pre>{result.stderr}</pre>
        </details>
      )}
    </div>
  );
}

function SubmitView({ result, onJump }: { result: SubmitResult; onJump: (line: number) => void }) {
  const passedCount = result.tests.filter((t) => t.passed).length;
  return (
    <div>
      {result.tests.length > 0 && (
        <div className={`${styles.status} ${result.passed ? styles.good : styles.bad}`}>
          {result.passed ? '🎉 All tests passed!' : `${passedCount} of ${result.tests.length} tests passed`}
        </div>
      )}
      {result.run && <RunView result={result.run} onJump={onJump} showStdout={false} />}
      <ul className={styles.tests}>
        {result.tests.map((t, i) => (
          <li key={i} className={t.passed ? styles.testPass : styles.testFail}>
            <div className={styles.testHead}>
              <span aria-hidden="true">{t.passed ? '✔' : '✘'}</span>
              <strong>{t.name}</strong>
              <span className="visually-hidden">{t.passed ? 'passed' : 'failed'}</span>
            </div>
            {!t.passed && <div className={styles.testMsg}>{t.message}</div>}
            {!t.passed && t.details && (
              <div className={styles.details}>
                {t.details.input !== undefined && t.details.input !== '' && (
                  <div>
                    <div className={styles.detailLabel}>Test</div>
                    <pre>{t.details.input}</pre>
                  </div>
                )}
                <div>
                  <div className={styles.detailLabel}>Expected</div>
                  <pre>{t.details.expected}</pre>
                </div>
                <div>
                  <div className={styles.detailLabel}>Your output</div>
                  <pre>{t.details.actual || '(nothing)'}</pre>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!result.passed && !result.revealed && result.tests.some((t) => !t.passed && !t.details) && (
        <p className={styles.note}>Hidden test details unlock after {REVEAL_AFTER_FAILS} failed attempts.</p>
      )}
    </div>
  );
}

export function Console({ state, onJump }: { state: ConsoleState; onJump: (line: number) => void }) {
  return (
    <div className={styles.console} aria-live="polite" aria-label="Output console">
      {state.kind === 'idle' && (
        <p className={styles.dim}>
          Press <kbd>Run</kbd> (Ctrl+Enter) to see your program's output here.
        </p>
      )}
      {state.kind === 'busy' && (
        <p className={styles.busy}>
          <span className={styles.spinner} aria-hidden="true" />
          {state.what === 'run' ? 'Running your code…' : 'Checking your solution…'}
        </p>
      )}
      {state.kind === 'error' && <p className={styles.bad}>{state.message}</p>}
      {state.kind === 'run' && <RunView result={state.result} onJump={onJump} />}
      {state.kind === 'submit' && <SubmitView result={state.result} onJump={onJump} />}
    </div>
  );
}
