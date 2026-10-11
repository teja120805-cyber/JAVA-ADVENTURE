import { useEffect, useRef } from 'react';
import { regions } from '../content';
import type { Region } from '../content/types';
import { getLevelProgress, isUnlocked, nextUnfinished } from '../lib/progress';
import { goToLevel } from '../lib/router';
import { useGame } from '../state/game';
import { Bean, CheckIcon, CrownIcon, LockIcon, Scenery, StarIcon } from './art';
import styles from './WorldMap.module.css';

const STEP_Y = 132;
const TOP_PAD = 100;

const SCENERY: Record<Region['theme'], string[]> = {
  meadow: ['tree', 'flower', 'rock', 'flower', 'sign', 'tree', 'chest', 'flower'],
  forest: ['pine', 'mushroom', 'pine', 'tree', 'rock', 'pine', 'mushroom'],
  castle: ['tower', 'rock', 'pine', 'chest', 'tower', 'flower', 'rock'],
};

/** Horizontal position (in %) of the n-th node: a gentle winding path. */
function nodeX(i: number): number {
  return 50 + 27 * Math.sin(i * 0.95);
}

function pathFor(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const midY = (prev.y + p.y) / 2;
      return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
    })
    .join(' ');
}

export function WorldMap() {
  const { state, order, clearJustUnlocked } = useGame();
  const nextId = nextUnfinished(state, order);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const justUnlocked = state.justUnlocked;

  // Bring the player's current level into view when the map opens.
  useEffect(() => {
    nextRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    if (!justUnlocked) return;
    const t = setTimeout(clearJustUnlocked, 2200);
    return () => clearTimeout(t);
  }, [justUnlocked, clearJustUnlocked]);

  let globalIndex = 0;

  return (
    <div className={styles.world}>
      {regions.map((region, ri) => {
        const points = region.levels.map((_, i) => ({ x: nodeX(i + ri * 3), y: TOP_PAD + i * STEP_Y }));
        const height = TOP_PAD + (region.levels.length - 1) * STEP_Y + 110;
        const done = region.levels.filter((l) => state.levels[l.id]?.completed).length;
        const lastDone = region.levels.reduce((acc, l, i) => (state.levels[l.id]?.completed ? i : acc), -1);
        const progressPoints = points.slice(0, Math.min(points.length, lastDone + 2));
        const hasBadge = state.badges.includes(region.badge.id);
        const regionUnlocked = isUnlocked(state, order, region.levels[0].id);
        const scenery = SCENERY[region.theme];

        return (
          <section key={region.id} className={`${styles.region} ${styles[region.theme]}`} aria-labelledby={`region-${region.id}`}>
            <div className={styles.regionHeader}>
              <div className={styles.regionCard + ' card'}>
                <div>
                  <div className={styles.regionKicker}>
                    Region {ri + 1} · {region.subtitle}
                  </div>
                  <h2 id={`region-${region.id}`}>{region.title}</h2>
                  <div className={styles.regionProgress}>
                    <div className={styles.regionTrack}>
                      <div style={{ width: `${(done / region.levels.length) * 100}%` }} />
                    </div>
                    <span>
                      {done}/{region.levels.length}
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.badge} ${hasBadge ? styles.badgeEarned : ''}`}
                  title={hasBadge ? `Badge earned: ${region.badge.name}` : `Beat the boss to earn: ${region.badge.name}`}
                >
                  <span aria-hidden="true">{region.badge.emoji}</span>
                  <span className="visually-hidden">
                    {hasBadge ? `Badge earned: ${region.badge.name}` : `Badge not yet earned: ${region.badge.name}`}
                  </span>
                </div>
              </div>
              {!regionUnlocked && <p className={styles.lockedNote}>Finish the previous region's boss to enter.</p>}
            </div>

            <div className={styles.trail} style={{ height }}>
              <svg className={styles.pathSvg} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
                <path d={pathFor(points)} className={styles.pathEdge} vectorEffect="non-scaling-stroke" />
                <path d={pathFor(points)} className={styles.pathBase} vectorEffect="non-scaling-stroke" />
                {progressPoints.length > 1 && (
                  <path d={pathFor(progressPoints)} className={styles.pathDone} vectorEffect="non-scaling-stroke" />
                )}
              </svg>

              {points.map((p, i) => (
                <div
                  key={`s-${i}`}
                  className={styles.scenery}
                  style={{ left: `${p.x > 50 ? 6 + (i % 3) * 5 : 80 + (i % 3) * 4}%`, top: p.y - 30 + ((i * 37) % 30) }}
                  aria-hidden="true"
                >
                  <Scenery kind={scenery[i % scenery.length]} size={44 + ((i * 13) % 16)} />
                </div>
              ))}

              {region.levels.map((level, i) => {
                globalIndex++;
                const p = points[i];
                const progress = getLevelProgress(state, level.id);
                const unlocked = isUnlocked(state, order, level.id);
                const isNext = level.id === nextId;
                const status = progress.completed ? 'completed' : unlocked ? 'unlocked' : 'locked';
                const label = `Level ${globalIndex}: ${level.title}${level.boss ? ' (boss)' : ''}. ${
                  status === 'completed' ? `Completed, ${progress.bestStars} of 3 stars.` : status === 'locked' ? 'Locked.' : 'Ready to play.'
                }`;

                return (
                  <div key={level.id} className={styles.nodeWrap} style={{ left: `${p.x}%`, top: p.y }}>
                    {isNext && (
                      <div className={styles.youAreHere} aria-hidden="true">
                        <Bean size={46} />
                      </div>
                    )}
                    <button
                      ref={isNext ? nextRef : undefined}
                      className={[
                        styles.node,
                        styles[status],
                        level.boss ? styles.boss : '',
                        isNext ? styles.next : '',
                        justUnlocked === level.id ? styles.unlocking : '',
                      ].join(' ')}
                      onClick={() => unlocked && goToLevel(level.id)}
                      aria-disabled={!unlocked}
                      aria-label={label}
                      title={unlocked ? level.blurb : 'Locked: finish the level before this one'}
                    >
                      {status === 'locked' ? (
                        <LockIcon />
                      ) : level.boss ? (
                        <CrownIcon size={level.boss ? 34 : 28} />
                      ) : status === 'completed' ? (
                        <CheckIcon size={26} />
                      ) : (
                        <span className={styles.num}>{i + 1}</span>
                      )}
                    </button>
                    <div className={styles.nodeLabel}>
                      {progress.completed && (
                        <span className={styles.stars} aria-hidden="true">
                          {[1, 2, 3].map((n) => (
                            <StarIcon key={n} filled={progress.bestStars >= n} size={15} />
                          ))}
                        </span>
                      )}
                      <span className={styles.title}>{level.boss ? `Boss: ${level.title}` : level.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      <footer className={styles.footer}>
        <Bean size={56} mood="wow" />
        <p>More regions coming soon. Keep practising!</p>
      </footer>
    </div>
  );
}
