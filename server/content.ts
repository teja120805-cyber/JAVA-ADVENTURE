import { readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assembleRegions } from '../src/content/assemble';
import type { Region } from '../src/content/types';

const REGIONS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/regions');

/** Loads every content file from disk, using the same folder convention as the browser. */
export async function loadRegions(): Promise<Region[]> {
  const modules: Record<string, { default: unknown }> = {};
  for (const folder of await readdir(REGIONS_DIR, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    for (const file of await readdir(join(REGIONS_DIR, folder.name))) {
      if (!file.endsWith('.ts')) continue;
      const full = join(REGIONS_DIR, folder.name, file);
      modules[`regions/${folder.name}/${file}`] = await import(pathToFileURL(full).href);
    }
  }
  return assembleRegions(modules);
}
