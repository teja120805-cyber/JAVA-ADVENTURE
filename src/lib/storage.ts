import { createInitialState, type GameState } from './progress';

// The save lives in two places: a file on disk kept by the local server (the real save, which
// survives closing or switching browsers) and localStorage (a backup for when the server is down).
const KEY = 'java-quest:save:v1';
const SERVER_URL = '/api/save';

/** Fills in anything missing from an older or partial save; null if it isn't a save. */
function normalize(saved: Partial<GameState> | null | undefined): GameState | null {
  if (!saved || saved.version !== 1) return null;
  const fresh = createInitialState({ theme: prefersDark() ? 'dark' : 'light' });
  return {
    ...fresh,
    ...saved,
    player: { ...fresh.player, ...saved.player },
    streak: { ...fresh.streak, ...saved.streak },
    settings: { ...fresh.settings, ...saved.settings },
    justUnlocked: null,
  };
}

function loadLocal(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw) as Partial<GameState>) : null;
  } catch {
    return null;
  }
}

/** The server's save, null if it has none, or undefined if the server couldn't be reached. */
async function loadServer(): Promise<GameState | null | undefined> {
  // `npm run dev` starts the website and the server together, and the server can take a few
  // seconds to come up, so keep trying for a while before giving up.
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const res = await fetch(SERVER_URL);
      if (res.ok) return normalize(((await res.json()) as { save: Partial<GameState> | null }).save);
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return undefined;
}

let serverSync = false;

/** Loads the newest save from the server or the browser, falling back to a fresh game. */
export async function loadState(): Promise<GameState> {
  const local = loadLocal();
  const server = await loadServer();
  // Only write to the server once we know what it holds, so a fresh game can't overwrite real progress.
  serverSync = server !== undefined;
  const newest = [local, server].reduce<GameState | null>(
    (best, s) => (s && (!best || s.updatedAt > best.updatedAt) ? s : best),
    null,
  );
  return newest ?? createInitialState({ theme: prefersDark() ? 'dark' : 'light' });
}

let pending: GameState | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked (private mode): the server copy still works.
  }
  if (!serverSync) return;
  // Code drafts save on every keystroke, so batch the writes to disk.
  pending = state;
  clearTimeout(timer);
  timer = setTimeout(flushToServer, 500);
}

function flushToServer(): void {
  if (!pending) return;
  const body = JSON.stringify(pending);
  pending = null;
  clearTimeout(timer);
  fetch(SERVER_URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {
    // Server stopped: localStorage still has it, and the next change retries.
  });
}

// When the tab closes, send anything still waiting. sendBeacon outlives the page.
window.addEventListener('pagehide', () => {
  if (!pending) return;
  const body = JSON.stringify(pending);
  pending = null;
  clearTimeout(timer);
  navigator.sendBeacon(SERVER_URL, body);
});

function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}
