// Keeps the player's save in a file on disk, so progress survives closing the browser,
// clearing site data, switching browsers, or Vite picking a different port.
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DIR = process.env.JAVA_QUEST_SAVE_DIR ?? join(homedir(), '.java-quest');
export const SAVE_FILE = join(DIR, 'save.json');

interface Save {
  version: 1;
  updatedAt: number;
}

export function isSave(value: unknown): value is Save {
  const v = value as Save | null;
  return typeof v === 'object' && v !== null && v.version === 1 && typeof v.updatedAt === 'number';
}

export async function readSave(): Promise<Save | null> {
  try {
    const parsed: unknown = JSON.parse(await readFile(SAVE_FILE, 'utf8'));
    return isSave(parsed) ? parsed : null;
  } catch {
    return null; // No save yet, or the file is unreadable.
  }
}

// Writes run one at a time so an older save can never land after a newer one.
let queue: Promise<unknown> = Promise.resolve();

/** Stores the save unless the file already holds a newer one. Returns whether it was written. */
export function writeSave(save: Save): Promise<boolean> {
  const job = queue.then(async () => {
    const current = await readSave();
    if (current && current.updatedAt > save.updatedAt) return false;
    await mkdir(DIR, { recursive: true });
    const text = JSON.stringify(save);
    const tmp = `${SAVE_FILE}.tmp`;
    await writeFile(tmp, text, 'utf8');
    try {
      await rename(tmp, SAVE_FILE); // Atomic, so a crash mid-write can't corrupt the save.
    } catch {
      await writeFile(SAVE_FILE, text, 'utf8'); // Windows can refuse the rename if the file is busy.
    }
    return true;
  });
  queue = job.catch(() => undefined);
  return job;
}
