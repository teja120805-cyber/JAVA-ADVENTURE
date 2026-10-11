import { useState } from 'react';
import type { Quiz } from '../content/types';
import { Markup } from '../lib/markup';
import styles from './QuizCard.module.css';

/** A quick check. Calls onCorrect once the player gets it right (retries are free). */
export function QuizCard({ quiz, solved, onCorrect }: { quiz: Quiz; solved: boolean; onCorrect: () => void }) {
  const [picked, setPicked] = useState<number | null>(solved && quiz.type === 'choice' ? quiz.answer : null);
  const [typed, setTyped] = useState(solved && quiz.type === 'blank' ? quiz.answers[0] : '');
  const [result, setResult] = useState<'right' | 'wrong' | null>(solved ? 'right' : null);

  const check = (correct: boolean) => {
    setResult(correct ? 'right' : 'wrong');
    if (correct) onCorrect();
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.kicker}>Quick check</div>
      <h3 className={styles.question}>
        <Markup text={quiz.question} inline />
      </h3>

      {quiz.type === 'choice' ? (
        <>
          {quiz.code && <pre className={styles.code}>{quiz.code}</pre>}
          <div className={styles.options} role="radiogroup" aria-label="Answers">
            {quiz.options.map((opt, i) => {
              const state =
                result === 'right' && i === quiz.answer ? styles.right : picked === i && result === 'wrong' ? styles.wrong : '';
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={picked === i}
                  className={`${styles.option} ${state}`}
                  disabled={result === 'right'}
                  onClick={() => {
                    setPicked(i);
                    check(i === quiz.answer);
                  }}
                >
                  <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
                  <span>
                    <Markup text={opt} inline />
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <form
          className={styles.blankForm}
          onSubmit={(e) => {
            e.preventDefault();
            check(quiz.answers.includes(typed.trim()));
          }}
        >
          <pre className={styles.code}>
            {quiz.code.split('___')[0]}
            <input
              className={`${styles.blank} ${result === 'right' ? styles.right : result === 'wrong' ? styles.wrong : ''}`}
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                if (result === 'wrong') setResult(null);
              }}
              disabled={result === 'right'}
              aria-label="Fill in the blank"
              size={Math.max(4, typed.length + 1)}
              autoComplete="off"
              spellCheck={false}
            />
            {quiz.code.split('___').slice(1).join('___')}
          </pre>
          {result !== 'right' && (
            <button className="btn btn-primary btn-small" type="submit" disabled={!typed.trim()}>
              Check
            </button>
          )}
        </form>
      )}

      {result === 'right' && (
        <div className={`${styles.feedback} ${styles.feedbackRight}`} role="status">
          <strong>Correct!</strong> <Markup text={quiz.explain} inline />
        </div>
      )}
      {result === 'wrong' && (
        <div className={`${styles.feedback} ${styles.feedbackWrong}`} role="status">
          <strong>Not quite.</strong> Have another go!
        </div>
      )}
    </div>
  );
}
