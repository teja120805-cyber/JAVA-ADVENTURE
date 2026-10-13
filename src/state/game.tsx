import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { regions } from '../content';
import {
  completeLevel,
  draftKey,
  orderedLevelIds,
  recordFail,
  recordHint,
  recordPass,
  resetProgress,
  todayString,
  type GameState,
  type Reward,
  type Settings,
} from '../lib/progress';
import { saveState } from '../lib/storage';

interface GameApi {
  state: GameState;
  order: string[];
  saveDraft(levelId: string, challenge: number, code: string): void;
  fail(levelId: string, challenge: number): void;
  takeHint(levelId: string, challenge: number): void;
  /** Marks a challenge passed; when every challenge is done, completes the level and returns the reward. */
  pass(levelId: string, challenge: number): Reward | null;
  updateSettings(patch: Partial<Settings>): void;
  updatePlayer(patch: Partial<GameState['player']>): void;
  clearJustUnlocked(): void;
  reset(): void;
}

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ initialState, children }: { initialState: GameState; children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const order = useMemo(() => orderedLevelIds(regions), []);

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  // Every change goes through commit(), which works from the latest state right away,
  // so actions like pass() can return their result to the caller.
  const latest = useRef(state);
  const commit = useCallback((change: (s: GameState) => GameState) => {
    const next = change(latest.current);
    if (next === latest.current) return;
    latest.current = { ...next, updatedAt: Date.now() };
    setState(latest.current);
  }, []);

  const api: GameApi = {
    state,
    order,
    saveDraft: (levelId, challenge, code) =>
      commit((s) => ({ ...s, drafts: { ...s.drafts, [draftKey(levelId, challenge)]: code } })),
    fail: (levelId, challenge) => commit((s) => recordFail(s, levelId, challenge)),
    takeHint: (levelId, challenge) => commit((s) => recordHint(s, levelId, challenge)),
    pass: (levelId, challenge) => {
      let reward: Reward | null = null;
      commit((s) => {
        const next = recordPass(s, levelId, challenge);
        const level = regions.flatMap((r) => r.levels).find((l) => l.id === levelId);
        if (!level || next.levels[levelId].run.passed.length < level.challenges.length) return next;
        const done = completeLevel(next, regions, levelId, todayString());
        reward = done.reward;
        return done.state;
      });
      return reward;
    },
    updateSettings: (patch) => commit((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    updatePlayer: (patch) => commit((s) => ({ ...s, player: { ...s.player, ...patch } })),
    clearJustUnlocked: () => commit((s) => (s.justUnlocked ? { ...s, justUnlocked: null } : s)),
    reset: () => commit((s) => resetProgress(s)),
  };

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
