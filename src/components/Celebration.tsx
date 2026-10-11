import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';
import { findLevel, regions } from '../content';
import type { Reward } from '../lib/progress';
import { Bean, CoinIcon, StarIcon } from './art';
import styles from './Celebration.module.css';

const STAR_LINES = ['', 'You did it!', 'Great job!', 'Perfect run!'];

export function Celebration({ reward, onNext, onMap }: { reward: Reward; onNext: (() => void) | null; onMap: () => void }) {
  const firstButton = useRef<HTMLButtonElement>(null);
  const level = findLevel(regions, reward.levelId)?.level;

  useEffect(() => {
    firstButton.current?.focus();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const colors = ['#04AA6D', '#FFC531', '#7C5CD6', '#FF8FB1', '#2F80ED'];
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors });
    const t1 = setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors }), 300);
    const t2 = setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors }), 500);
    const big = reward.badge
      ? setTimeout(() => confetti({ particleCount: 200, spread: 140, startVelocity: 45, origin: { y: 0.4 }, colors }), 900)
      : undefined;
    return () => [t1, t2, big].forEach((t) => t && clearTimeout(t));
  }, [reward.badge]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onMap();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onMap]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="celebrate-title">
        <div className={styles.bean}>
          <Bean size={96} mood="wow" />
        </div>
        <h2 id="celebrate-title">{level?.boss ? 'Boss defeated!' : 'Level complete!'}</h2>
        <p className={styles.sub}>
          {level?.title} · {STAR_LINES[reward.stars]}
        </p>

        <div className={styles.stars} aria-label={`${reward.stars} of 3 stars`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={styles.star} style={{ animationDelay: `${0.25 + n * 0.25}s` }}>
              <StarIcon filled={reward.stars >= n} size={56} />
            </span>
          ))}
        </div>
        <ul className={styles.why}>
          <li>✔ Solved the challenge</li>
          <li className={reward.noHints ? '' : styles.missed}>{reward.noHints ? '✔' : '✘'} No hints used</li>
          <li className={reward.firstTry ? '' : styles.missed}>{reward.firstTry ? '✔' : '✘'} Passed on the first try</li>
        </ul>

        <div className={styles.loot}>
          <div className={styles.lootItem}>
            <span className={styles.xp}>+{reward.xp}</span> XP
          </div>
          <div className={styles.lootItem}>
            <CoinIcon size={24} /> +{reward.coins}
          </div>
        </div>
        {!reward.firstTime && reward.newBest && <p className={styles.note}>New best score!</p>}
        {!reward.firstTime && !reward.newBest && <p className={styles.note}>Replay bonus. Earn more stars for extra coins.</p>}

        {reward.levelUp && (
          <div className={styles.levelUp}>
            ⬆ You reached <strong>player level {reward.levelUp}</strong>!
          </div>
        )}
        {reward.badge && (
          <div className={styles.badge}>
            <span className={styles.badgeEmoji} aria-hidden="true">
              {reward.badge.emoji}
            </span>
            <div>
              <div className={styles.badgeKicker}>New badge</div>
              <strong>{reward.badge.name}</strong>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {onNext && (
            <button ref={firstButton} className="btn btn-primary" onClick={onNext}>
              Next level →
            </button>
          )}
          <button ref={onNext ? undefined : firstButton} className="btn btn-ghost" onClick={onMap}>
            Back to map
          </button>
        </div>
      </div>
    </div>
  );
}
