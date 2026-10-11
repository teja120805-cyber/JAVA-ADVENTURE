import { describe, expect, it } from 'vitest';
import type { Level, Region } from '../content/types';
import {
  completeLevel,
  computeStars,
  createInitialState,
  emptyRun,
  isUnlocked,
  nextUnfinished,
  orderedLevelIds,
  playerLevel,
  recordFail,
  recordHint,
  recordPass,
  resetProgress,
  updateStreak,
  visibleStreak,
} from './progress';

const lvl = (id: string, boss = false): Level => ({
  id,
  title: id,
  blurb: '',
  boss,
  rewards: { xp: 100, coins: 10 },
  flow: [],
  challenges: [],
});

const regions: Region[] = [
  {
    id: 'r1',
    title: 'R1',
    subtitle: '',
    theme: 'meadow',
    badge: { id: 'b1', name: 'Badge One', emoji: '*' },
    levels: [lvl('a'), lvl('b'), lvl('boss1', true)],
  },
  {
    id: 'r2',
    title: 'R2',
    subtitle: '',
    theme: 'forest',
    badge: { id: 'b2', name: 'Badge Two', emoji: '*' },
    levels: [lvl('c'), lvl('boss2', true)],
  },
];
const order = orderedLevelIds(regions);
const DAY = '2026-10-11';

describe('player level', () => {
  it('starts at level 1 with 100 XP needed', () => {
    expect(playerLevel(0)).toEqual({ level: 1, into: 0, needed: 100 });
  });

  it('levels up as XP grows, with each level needing more', () => {
    expect(playerLevel(100)).toEqual({ level: 2, into: 0, needed: 150 });
    expect(playerLevel(260)).toEqual({ level: 3, into: 10, needed: 200 });
  });
});

describe('unlocking', () => {
  it('unlocks only the first level for a new player', () => {
    const s = createInitialState();
    expect(isUnlocked(s, order, 'a')).toBe(true);
    expect(isUnlocked(s, order, 'b')).toBe(false);
    expect(nextUnfinished(s, order)).toBe('a');
  });

  it('unlocks the next level (even across regions) once the previous one is completed', () => {
    let s = createInitialState();
    for (const id of ['a', 'b', 'boss1']) s = completeLevel(s, regions, id, DAY).state;
    expect(isUnlocked(s, order, 'c')).toBe(true);
    expect(isUnlocked(s, order, 'boss2')).toBe(false);
    expect(nextUnfinished(s, order)).toBe('c');
  });

  it('unlocks everything with the dev toggle', () => {
    const s = createInitialState({ unlockAll: true });
    expect(order.every((id) => isUnlocked(s, order, id))).toBe(true);
  });

  it('returns null when every level is done', () => {
    let s = createInitialState();
    for (const id of order) s = completeLevel(s, regions, id, DAY).state;
    expect(nextUnfinished(s, order)).toBeNull();
  });
});

describe('stars', () => {
  it('gives 3 stars for no hints and no fails', () => {
    expect(computeStars(emptyRun())).toBe(3);
  });

  it('takes a star for hints and a star for failed attempts', () => {
    expect(computeStars({ passed: [0], fails: {}, hints: { 0: 2 } })).toBe(2);
    expect(computeStars({ passed: [0], fails: { 0: 1 }, hints: {} })).toBe(2);
    expect(computeStars({ passed: [0], fails: { 0: 3 }, hints: { 1: 1 } })).toBe(1);
  });
});

describe('completeLevel', () => {
  it('awards XP, coins and star bonus on first completion', () => {
    const { state, reward } = completeLevel(createInitialState(), regions, 'a', DAY);
    expect(reward.stars).toBe(3);
    expect(reward.firstTime).toBe(true);
    expect(reward.xp).toBe(100);
    expect(reward.coins).toBe(10 + 3 * 5);
    expect(state.levels.a.completed).toBe(true);
    expect(state.justUnlocked).toBe('b');
    expect(reward.nextLevelId).toBe('b');
  });

  it('records hints and fails into the stars, then clears the attempt', () => {
    let s = createInitialState();
    s = recordHint(s, 'a', 0);
    s = recordFail(s, 'a', 0);
    s = recordPass(s, 'a', 0);
    const { state, reward } = completeLevel(s, regions, 'a', DAY);
    expect(reward.stars).toBe(1);
    expect(reward.noHints).toBe(false);
    expect(reward.firstTry).toBe(false);
    expect(state.levels.a.bestStars).toBe(1);
    expect(state.levels.a.run).toEqual(emptyRun());
  });

  it('gives reduced XP on replays and coins only for new stars', () => {
    let s = createInitialState();
    s = recordHint(s, 'a', 0);
    s = completeLevel(s, regions, 'a', DAY).state; // 2 stars
    const replay = completeLevel(s, regions, 'a', DAY); // 3 stars
    expect(replay.reward.firstTime).toBe(false);
    expect(replay.reward.xp).toBe(25);
    expect(replay.reward.coins).toBe(5);
    expect(replay.reward.newBest).toBe(true);
    expect(replay.state.levels.a.bestStars).toBe(3);

    const again = completeLevel(replay.state, regions, 'a', DAY);
    expect(again.reward.coins).toBe(0);
    expect(again.state.levels.a.completions).toBe(3);
  });

  it('never lowers the best star count', () => {
    let s = completeLevel(createInitialState(), regions, 'a', DAY).state;
    s = recordFail(recordHint(s, 'a', 0), 'a', 0);
    const { state } = completeLevel(s, regions, 'a', DAY);
    expect(state.levels.a.bestStars).toBe(3);
  });

  it("gives the region badge for beating the region's boss, only once", () => {
    let s = createInitialState();
    s = completeLevel(s, regions, 'a', DAY).state;
    s = completeLevel(s, regions, 'b', DAY).state;
    const boss = completeLevel(s, regions, 'boss1', DAY);
    expect(boss.reward.badge?.id).toBe('b1');
    expect(boss.state.badges).toEqual(['b1']);
    const replay = completeLevel(boss.state, regions, 'boss1', DAY);
    expect(replay.reward.badge).toBeNull();
    expect(replay.state.badges).toEqual(['b1']);
  });

  it('reports a player level-up', () => {
    const { reward } = completeLevel(createInitialState(), regions, 'a', DAY);
    expect(reward.levelUp).toBe(2);
  });
});

describe('streak', () => {
  const empty = { count: 0, best: 0, lastDay: null };

  it('starts at 1 on the first day', () => {
    expect(updateStreak(empty, '2026-10-11')).toEqual({ count: 1, best: 1, lastDay: '2026-10-11' });
  });

  it('does not double count the same day', () => {
    const s = updateStreak(empty, '2026-10-11');
    expect(updateStreak(s, '2026-10-11')).toBe(s);
  });

  it('grows on consecutive days, including across months', () => {
    let s = updateStreak(empty, '2026-09-30');
    s = updateStreak(s, '2026-10-01');
    expect(s.count).toBe(2);
  });

  it('restarts after a missed day but remembers the best', () => {
    let s = updateStreak(empty, '2026-10-01');
    s = updateStreak(s, '2026-10-02');
    s = updateStreak(s, '2026-10-05');
    expect(s).toEqual({ count: 1, best: 2, lastDay: '2026-10-05' });
  });

  it('shows 0 once a whole day has been missed', () => {
    const s = updateStreak(empty, '2026-10-01');
    expect(visibleStreak(s, '2026-10-02')).toBe(1);
    expect(visibleStreak(s, '2026-10-03')).toBe(0);
  });
});

describe('resetProgress', () => {
  it('clears progress but keeps the theme', () => {
    let s = createInitialState({ theme: 'dark', unlockAll: true });
    s = completeLevel(s, regions, 'a', DAY).state;
    const fresh = resetProgress(s);
    expect(fresh.xp).toBe(0);
    expect(fresh.levels).toEqual({});
    expect(fresh.settings).toEqual({ theme: 'dark', unlockAll: false });
  });
});
