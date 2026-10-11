import type { Challenge, Level } from '../content/types';
import { Markup } from '../lib/markup';
import { Bean, BulbIcon, CheckIcon, FlagIcon, PlayIcon } from './art';
import { QuizCard } from './QuizCard';
import styles from './LevelScreen.module.css';

interface Props {
  level: Level;
  stage: number;
  setStage: (n: number) => void;
  maxStage: number;
  solvedQuizzes: Set<number>;
  onQuizSolved: (flowIndex: number) => void;
  onTryIt: (code: string, title: string) => void;
  passed: Set<number>;
  hintsShown: (challenge: number) => number;
  /** True until the first hint of this attempt; the first hint is what costs the star. */
  hintCostsStar: boolean;
  onHint: (challenge: number) => void;
}

/** Left side of the level: the story steps, quick checks and challenge briefs. */
export function LessonPane(props: Props) {
  const { level, stage, setStage, maxStage, solvedQuizzes, passed } = props;
  const flowCount = level.flow.length;
  const total = flowCount + level.challenges.length;
  const item = stage < flowCount ? level.flow[stage] : null;
  const challengeIndex = stage - flowCount;
  const quizBlocking = item !== null && item.type !== 'lesson' && !solvedQuizzes.has(stage);

  return (
    <div className={styles.lesson}>
      <nav className={styles.stepper} aria-label="Level steps">
        {Array.from({ length: total }, (_, i) => {
          const isChallenge = i >= flowCount;
          const flowItem = level.flow[i];
          const done = isChallenge ? passed.has(i - flowCount) : i < maxStage || (flowItem?.type !== 'lesson' && solvedQuizzes.has(i));
          const kind = isChallenge ? 'challenge' : flowItem.type === 'lesson' ? 'lesson' : 'quiz';
          const kindClass = { lesson: styles.dotLesson, quiz: styles.dotQuiz, challenge: styles.dotChallenge }[kind];
          const label = isChallenge
            ? `Challenge ${i - flowCount + 1}: ${level.challenges[i - flowCount].title}`
            : flowItem.type === 'lesson'
              ? `Step ${i + 1}: ${flowItem.title}`
              : `Quick check ${i + 1}`;
          return (
            <button
              key={i}
              className={[styles.dot, kindClass, i === stage ? styles.current : '', done ? styles.done : ''].join(' ')}
              onClick={() => setStage(i)}
              disabled={i > maxStage}
              aria-current={i === stage ? 'step' : undefined}
              aria-label={`${label}${done ? ' (done)' : ''}`}
              title={label}
            >
              {isChallenge ? <FlagIcon size={13} /> : kind === 'quiz' ? '?' : ''}
            </button>
          );
        })}
      </nav>

      <div className={styles.stageBody} key={stage}>
        {item?.type === 'lesson' && (
          <div className={styles.guideRow}>
            <div className={styles.guide}>
              <Bean size={64} mood={stage === 0 ? 'happy' : stage % 3 === 1 ? 'think' : 'happy'} />
            </div>
            <div className={styles.bubble}>
              <h3>{item.title}</h3>
              <Markup text={item.text} />
              {item.code && (
                <div className={styles.example}>
                  <pre>
                    <code>{item.code}</code>
                  </pre>
                  <button className="btn btn-primary btn-small" onClick={() => props.onTryIt(item.code!, item.title)}>
                    <PlayIcon size={14} /> Try it
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {item && item.type !== 'lesson' && (
          <QuizCard quiz={item} solved={solvedQuizzes.has(stage)} onCorrect={() => props.onQuizSolved(stage)} />
        )}

        {!item && (
          <ChallengeBrief
            challenge={level.challenges[challengeIndex]}
            index={challengeIndex}
            count={level.challenges.length}
            boss={Boolean(level.boss)}
            passed={passed.has(challengeIndex)}
            hintsShown={props.hintsShown(challengeIndex)}
            hintCostsStar={props.hintCostsStar}
            onHint={() => props.onHint(challengeIndex)}
          />
        )}
      </div>

      <div className={styles.stageNav}>
        <button className="btn btn-ghost" onClick={() => setStage(stage - 1)} disabled={stage === 0}>
          ← Back
        </button>
        {stage < total - 1 && (
          <button className="btn btn-primary" onClick={() => setStage(stage + 1)} disabled={quizBlocking || (stage >= flowCount && !passed.has(challengeIndex))}>
            {stage === flowCount - 1 ? 'Start challenge →' : stage >= flowCount ? 'Next trial →' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}

function ChallengeBrief(props: {
  challenge: Challenge;
  index: number;
  count: number;
  boss: boolean;
  passed: boolean;
  hintsShown: number;
  hintCostsStar: boolean;
  onHint: () => void;
}) {
  const { challenge, index, count, boss, passed, hintsShown, hintCostsStar } = props;
  const harness = challenge.check.kind === 'harness' ? challenge.check : null;

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeHead}>
        <span className={`${styles.challengeTag} ${boss ? styles.bossTag : ''}`}>
          {boss ? `Boss trial ${index + 1} of ${count}` : 'Challenge'}
        </span>
        {passed && (
          <span className={styles.passedTag}>
            <CheckIcon size={14} /> Passed
          </span>
        )}
      </div>
      <div className={styles.guideRow}>
        <div className={styles.guide}>
          <Bean size={60} mood="wow" />
        </div>
        <div className={styles.bubble}>
          <h3>{challenge.title}</h3>
          <Markup text={challenge.story} />
        </div>
      </div>

      {harness && (
        <p className={styles.harnessNote}>
          {harness.mode === 'method'
            ? 'Write just the method(s): no class or main needed. '
            : 'Write just the class(es): no Main class needed. '}
          <b>Run</b> tries your code with a small example; <b>Submit</b> runs the hidden tests.
        </p>
      )}

      <div className={styles.hints}>
        <div className={styles.hintsHead}>
          <BulbIcon /> Hints <span className={styles.hintCount}>({hintsShown}/{challenge.hints.length})</span>
        </div>
        {challenge.hints.slice(0, hintsShown).map((h, i) => (
          <div key={i} className={styles.hint}>
            <b>Hint {i + 1}:</b> <Markup text={h} inline />
          </div>
        ))}
        {hintsShown < challenge.hints.length && (
          <button className="btn btn-gold btn-small" onClick={props.onHint}>
            Reveal hint {hintsShown + 1}
            {hintCostsStar && !passed ? ' (costs a star)' : ''}
          </button>
        )}
      </div>

      <p className={styles.shortcuts}>
        Shortcuts: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> runs, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> submits. In the editor, press{' '}
        <kbd>Esc</kbd> then <kbd>Tab</kbd> to move focus out.
      </p>
    </div>
  );
}
