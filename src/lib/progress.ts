// Pure game-progress logic. No React, no localStorage: easy to unit test.
import type { Region } from '../content/types';

export interface LevelRun {
  /** Challenge indexes passed during the current attempt at the level. */
  passed: number[];
  /** Failed submissions per challenge index. */
  fails: Record<number, number>;
  /** Hints revealed per challenge index. */
  hints: Record<number, number>;
}

export interface LevelProgress {
  completed: boolean;
  bestStars: number;
  completions: number;
  run: LevelRun;
}

export interface Settings {
  theme: 'light' | 'dark';
  unlockAll: boolean;
}

export interface GameState {
  version: 1;
  /** When the state last changed (ms since epoch); decides which of two saves is newer. */
  updatedAt: number;
  player: { name: string; avatar: number };
  xp: number;
  coins: number;
  streak: { count: number; best: number; lastDay: string | null };
  levels: Record<string, LevelProgress>;
  /** Code drafts, keyed by `${levelId}#${challengeIndex}`. */
  drafts: Record<string, string>;
  badges: string[];
  settings: Settings;
  /** Set when a level unlocks so the map can animate it once. */
  justUnlocked: string | null;
}

export function createInitialState(settings?: Partial<Settings>): GameState {
  return {
    version: 1,
    updatedAt: 0,
    player: { name: 'Adventurer', avatar: 0 },
    xp: 0,
    coins: 0,
    streak: { count: 0, best: 0, lastDay: null },
    levels: {},
    drafts: {},
    badges: [],
    settings: { theme: 'light', unlockAll: false, ...settings },
    justUnlocked: null,
  };
}

export function emptyRun(): LevelRun {
  return { passed: [], fails: {}, hints: {} };
}

export function getLevelProgress(state: GameState, levelId: string): LevelProgress {
  return state.levels[levelId] ?? { completed: false, bestStars: 0, completions: 0, run: emptyRun() };
}

export function draftKey(levelId: string, challengeIndex: number): string {
  return `${levelId}#${challengeIndex}`;
}

// ---------- Player level from XP ----------

/** XP needed to go from player level `level` to `level + 1`. */
export function xpForNextLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export function playerLevel(xp: number): { level: number; into: number; needed: number } {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= xpForNextLevel(level)) {
    remaining -= xpForNextLevel(level);
    level++;
  }
  return { level, into: remaining, needed: xpForNextLevel(level) };
}

// ---------- Unlocking ----------

export function orderedLevelIds(regions: Region[]): string[] {
  return regions.flatMap((r) => r.levels.map((l) => l.id));
}

export function isUnlocked(state: GameState, order: string[], levelId: string): boolean {
  if (state.settings.unlockAll) return true;
  const index = order.indexOf(levelId);
  if (index < 0) return false;
  if (index === 0) return true;
  if (state.levels[levelId]?.completed) return true;
  return Boolean(state.levels[order[index - 1]]?.completed);
}

/** The first unlocked level that isn't finished, or null when everything is done. */
export function nextUnfinished(state: GameState, order: string[]): string | null {
  return order.find((id) => !state.levels[id]?.completed && isUnlocked(state, order, id)) ?? null;
}

// ---------- Stars ----------

const total = (counts: Record<number, number>) => Object.values(counts).reduce((a, b) => a + b, 0);

/** 1 star for finishing, +1 for using no hints, +1 for passing every challenge first try. */
export function computeStars(run: LevelRun): number {
  return 1 + (total(run.hints) === 0 ? 1 : 0) + (total(run.fails) === 0 ? 1 : 0);
}

// ---------- Streak ----------

function dayNumber(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function todayString(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Counts consecutive days with at least one level completed. */
export function updateStreak(streak: GameState['streak'], today: string): GameState['streak'] {
  if (streak.lastDay === today) return streak;
  const continues = streak.lastDay !== null && dayNumber(today) - dayNumber(streak.lastDay) === 1;
  const count = continues ? streak.count + 1 : 1;
  return { count, best: Math.max(streak.best, count), lastDay: today };
}

/** The streak shown in the top bar: 0 if the player missed a whole day. */
export function visibleStreak(streak: GameState['streak'], today: string): number {
  if (!streak.lastDay) return 0;
  return dayNumber(today) - dayNumber(streak.lastDay) <= 1 ? streak.count : 0;
}

// ---------- Recording attempts ----------

function withLevel(state: GameState, levelId: string, update: (p: LevelProgress) => LevelProgress): GameState {
  return { ...state, levels: { ...state.levels, [levelId]: update(getLevelProgress(state, levelId)) } };
}

export function recordFail(state: GameState, levelId: string, challenge: number): GameState {
  return withLevel(state, levelId, (p) => ({
    ...p,
    run: { ...p.run, fails: { ...p.run.fails, [challenge]: (p.run.fails[challenge] ?? 0) + 1 } },
  }));
}

export function recordHint(state: GameState, levelId: string, challenge: number): GameState {
  return withLevel(state, levelId, (p) => ({
    ...p,
    run: { ...p.run, hints: { ...p.run.hints, [challenge]: (p.run.hints[challenge] ?? 0) + 1 } },
  }));
}

export function recordPass(state: GameState, levelId: string, challenge: number): GameState {
  return withLevel(state, levelId, (p) =>
    p.run.passed.includes(challenge) ? p : { ...p, run: { ...p.run, passed: [...p.run.passed, challenge] } },
  );
}

// ---------- Completing a level ----------

export interface Reward {
  levelId: string;
  stars: number;
  noHints: boolean;
  firstTry: boolean;
  newBest: boolean;
  firstTime: boolean;
  xp: number;
  coins: number;
  badge: Region['badge'] | null;
  levelUp: number | null;
  nextLevelId: string | null;
}

export const COINS_PER_NEW_STAR = 5;
export const REPLAY_XP_SHARE = 0.25;

/**
 * Finishes a level once all its challenges are passed. First completion gives the
 * full XP and coins; replays give a quarter of the XP. Any star above the previous
 * best is worth bonus coins. Finishing a region's last level (the boss) gives its badge.
 */
export function completeLevel(
  state: GameState,
  regions: Region[],
  levelId: string,
  today: string,
): { state: GameState; reward: Reward } {
  const region = regions.find((r) => r.levels.some((l) => l.id === levelId));
  const level = region?.levels.find((l) => l.id === levelId);
  if (!region || !level) throw new Error(`Unknown level ${levelId}`);

  const before = getLevelProgress(state, levelId);
  const stars = computeStars(before.run);
  const firstTime = !before.completed;
  const newStars = Math.max(0, stars - before.bestStars);
  const xp = firstTime ? level.rewards.xp : Math.round(level.rewards.xp * REPLAY_XP_SHARE);
  const coins = (firstTime ? level.rewards.coins : 0) + newStars * COINS_PER_NEW_STAR;

  const isRegionFinale = region.levels[region.levels.length - 1].id === levelId;
  const badge = isRegionFinale && !state.badges.includes(region.badge.id) ? region.badge : null;

  const order = orderedLevelIds(regions);
  const nextId = order[order.indexOf(levelId) + 1] ?? null;
  const unlocksNext = firstTime && nextId !== null && !state.levels[nextId]?.completed;

  const oldPlayerLevel = playerLevel(state.xp).level;
  const newPlayerLevel = playerLevel(state.xp + xp).level;

  const next: GameState = {
    ...state,
    xp: state.xp + xp,
    coins: state.coins + coins,
    streak: updateStreak(state.streak, today),
    badges: badge ? [...state.badges, badge.id] : state.badges,
    justUnlocked: unlocksNext ? nextId : state.justUnlocked,
    levels: {
      ...state.levels,
      [levelId]: {
        completed: true,
        bestStars: Math.max(before.bestStars, stars),
        completions: before.completions + 1,
        run: emptyRun(),
      },
    },
  };

  return {
    state: next,
    reward: {
      levelId,
      stars,
      noHints: total(before.run.hints) === 0,
      firstTry: total(before.run.fails) === 0,
      newBest: stars > before.bestStars,
      firstTime,
      xp,
      coins,
      badge,
      levelUp: newPlayerLevel > oldPlayerLevel ? newPlayerLevel : null,
      nextLevelId: nextId,
    },
  };
}

/** Wipes progress but keeps the player's settings (theme etc.). */
export function resetProgress(state: GameState): GameState {
  return createInitialState({ theme: state.settings.theme });
}
