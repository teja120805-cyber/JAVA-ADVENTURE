import { useEffect, useState } from 'react';
import type { Level, Region } from '../content/types';
import { runCode, submitCode } from '../lib/api';
import type { JavaError } from '../lib/api-types';
import { computeStars, draftKey, getLevelProgress, isUnlocked, type Reward } from '../lib/progress';
import { goToLevel, goToMap } from '../lib/router';
import { useGame } from '../state/game';
import { PlayIcon, StarIcon } from './art';
import { Celebration } from './Celebration';
import { CodeEditor } from './CodeEditor';
import { Console, type ConsoleState } from './Console';
import { LessonPane } from './LessonPane';
import styles from './LevelScreen.module.css';

export function LevelScreen({ level, region }: { level: Level; region: Region }) {
  const game = useGame();
  const { state } = game;
  const progress = getLevelProgress(state, level.id);
  const flowCount = level.flow.length;
  const lastStage = flowCount + level.challenges.length - 1;
  const passed = new Set(progress.run.passed);

  // Resume a half-finished boss at its first unsolved trial; otherwise start at the story.
  const firstUnpassed = level.challenges.findIndex((_, i) => !passed.has(i));
  const resumeAt = progress.run.passed.length > 0 && firstUnpassed >= 0 ? flowCount + firstUnpassed : 0;
  const [stage, setStageState] = useState(resumeAt);
  const [maxStage, setMaxStage] = useState(progress.completed ? lastStage : resumeAt);
  const [solvedQuizzes, setSolvedQuizzes] = useState<Set<number>>(new Set());
  const [challenge, setChallenge] = useState(Math.max(0, resumeAt - flowCount));
  const [example, setExample] = useState<{ code: string; title: string } | null>(null);
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [output, setOutput] = useState<ConsoleState>({ kind: 'idle' });
  const [errors, setErrors] = useState<JavaError[]>([]);
  const [focusLine, setFocusLine] = useState<{ line: number; nonce: number }>();
  const [reward, setReward] = useState<Reward | null>(null);

  const current = level.challenges[challenge];

  // Challenges that read keyboard input open the Input box with a sample to try.
  useEffect(() => {
    const check = level.challenges[challenge].check;
    const sample = check.kind === 'output' ? check.tests.find((t) => t.stdin !== undefined && !t.hidden)?.stdin : undefined;
    if (sample !== undefined) {
      setStdin(sample);
      setShowStdin(true);
    }
  }, [level, challenge]);
  const draft = state.drafts[draftKey(level.id, challenge)] ?? current.starterCode;
  const code = example ? example.code : draft;
  const busy = output.kind === 'busy';
  const hintsTotal = Object.values(progress.run.hints).reduce((a, b) => a + b, 0);

  const setStage = (n: number) => {
    const next = Math.max(0, Math.min(lastStage, n));
    setStageState(next);
    setMaxStage((m) => Math.max(m, next));
    if (next >= flowCount) {
      setChallenge(next - flowCount);
      setExample(null);
      setErrors([]);
    }
  };

  const onChange = (text: string) => {
    if (example) setExample({ ...example, code: text });
    else game.saveDraft(level.id, challenge, text);
  };

  const run = async () => {
    if (busy) return;
    setOutput({ kind: 'busy', what: 'run' });
    try {
      const result = await runCode(
        example ? { code, stdin } : { code, stdin, levelId: level.id, challengeIndex: challenge },
      );
      setOutput({ kind: 'run', result });
      setErrors(result.errors);
    } catch {
      setOutput({ kind: 'error', message: "Couldn't reach the code runner. Is npm run dev still running?" });
    }
  };

  const submit = async () => {
    if (busy || example) return;
    setOutput({ kind: 'busy', what: 'submit' });
    try {
      const result = await submitCode({
        levelId: level.id,
        challengeIndex: challenge,
        code,
        priorFails: progress.run.fails[challenge] ?? 0,
      });
      setOutput({ kind: 'submit', result });
      setErrors(result.run?.errors ?? []);
      if (result.passed) {
        const r = game.pass(level.id, challenge);
        if (r) setReward(r);
      } else {
        game.fail(level.id, challenge);
      }
    } catch {
      setOutput({ kind: 'error', message: "Couldn't reach the code runner. Is npm run dev still running?" });
    }
  };

  const resetCode = () => {
    if (window.confirm('Reset this challenge to the starter code? Your changes will be lost.')) {
      game.saveDraft(level.id, challenge, current.starterCode);
      setErrors([]);
    }
  };

  const nextLevelId = reward?.nextLevelId;
  const canGoNext = nextLevelId && isUnlocked(state, game.order, nextLevelId);
  const starsNow = computeStars(progress.run);

  return (
    <div className={styles.screen}>
      <section className={styles.left} aria-label="Lesson">
        <header className={styles.levelHeader}>
          <button className="btn btn-ghost btn-small" onClick={goToMap}>
            ← Map
          </button>
          <div className={styles.titleBlock}>
            <div className={styles.kicker}>{region.title}</div>
            <h1>
              {level.boss && <span className={styles.bossChip}>BOSS</span>} {level.title}
            </h1>
          </div>
          <div className={styles.starsNow} title="Stars you can still earn in this attempt">
            {[1, 2, 3].map((n) => (
              <StarIcon key={n} filled={starsNow >= n} size={20} />
            ))}
            <span className="visually-hidden">{starsNow} stars still possible</span>
          </div>
        </header>

        <LessonPane
          level={level}
          stage={stage}
          setStage={setStage}
          maxStage={maxStage}
          solvedQuizzes={solvedQuizzes}
          onQuizSolved={(i) => setSolvedQuizzes((s) => new Set(s).add(i))}
          onTryIt={(c, title) => {
            setExample({ code: c, title });
            setErrors([]);
            setOutput({ kind: 'idle' });
          }}
          passed={passed}
          hintsShown={(ci) => progress.run.hints[ci] ?? 0}
          hintCostsStar={hintsTotal === 0}
          onHint={(ci) => game.takeHint(level.id, ci)}
        />
      </section>

      <section className={styles.right} aria-label="Code editor">
        <div className={styles.toolbar}>
          <div className={styles.fileTab}>
            <span className={styles.fileDot} />
            {example ? `Example: ${example.title}` : level.challenges.length > 1 ? `Trial ${challenge + 1}: ${current.title}` : current.title}
          </div>
          <div className={styles.toolbarActions}>
            {!example && (
              <button className="btn btn-ghost btn-small" onClick={resetCode} title="Reset to starter code">
                Reset
              </button>
            )}
            <button
              className={`btn btn-ghost btn-small ${showStdin ? styles.on : ''}`}
              onClick={() => setShowStdin((v) => !v)}
              aria-pressed={showStdin}
              title="Give your program keyboard input (for Scanner)"
            >
              Input
            </button>
            <button className="btn btn-small" onClick={run} disabled={busy}>
              <PlayIcon size={14} /> Run
            </button>
            <button className="btn btn-primary btn-small" onClick={submit} disabled={busy || Boolean(example)}>
              Submit
            </button>
          </div>
        </div>

        {example && (
          <div className={styles.exampleBar}>
            <span>You're playing with an example. Changes here aren't saved.</span>
            <button className="btn btn-small btn-ghost" onClick={() => setExample(null)}>
              Back to my challenge code
            </button>
          </div>
        )}

        <div className={styles.editorWrap}>
          <CodeEditor
            value={code}
            onChange={onChange}
            errors={errors}
            dark={state.settings.theme === 'dark'}
            onRun={run}
            onSubmit={submit}
            label={example ? `Example code: ${example.title}` : `Your code for ${current.title}`}
            focusLine={focusLine}
          />
        </div>

        {showStdin && (
          <div className={styles.stdin}>
            <label htmlFor="stdin">Program input (what the user types, one value per line)</label>
            <textarea id="stdin" value={stdin} onChange={(e) => setStdin(e.target.value)} rows={3} spellCheck={false} />
          </div>
        )}

        <div className={styles.consoleWrap}>
          <Console state={output} onJump={(line) => setFocusLine({ line, nonce: Date.now() })} />
        </div>
      </section>

      {reward && (
        <Celebration
          reward={reward}
          onNext={canGoNext ? () => goToLevel(nextLevelId!) : null}
          onMap={goToMap}
        />
      )}
    </div>
  );
}
