import { createInitialState, type GameState } from './progress';

const KEY = 'java-quest:save:v1';

/** Loads the saved game, falling back to a fresh one if storage is empty, blocked or corrupt. */
export function loadState(): GameState {
  const fresh = createInitialState({ theme: prefersDark() ? 'dark' : 'light' });
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<GameState>;
    if (saved.version !== 1) return fresh;
    return {
      ...fresh,
      ...saved,
      player: { ...fresh.player, ...saved.player },
      streak: { ...fresh.streak, ...saved.streak },
      settings: { ...fresh.settings, ...saved.settings },
      justUnlocked: null,
    };
  } catch {
    return fresh;
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked (private mode): the game still works, it just won't persist.
  }
}

function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}
