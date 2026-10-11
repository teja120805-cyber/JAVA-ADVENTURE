import type { Level, Region, RegionMeta } from './types';

// Plain character order, so "13b-..." always lands between "13-..." and "14-...".
const byName = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Builds the ordered region list from a map of module paths to modules.
 * Paths look like ".../regions/01-basics/region.ts" or ".../regions/01-basics/03-syntax.ts".
 * Folders and files are sorted by name, so the number prefix decides the order.
 * Used by both the browser (import.meta.glob) and the server (fs + dynamic import).
 */
export function assembleRegions(modules: Record<string, { default: unknown }>): Region[] {
  const byFolder = new Map<string, { meta?: RegionMeta; levels: [string, Level][] }>();

  for (const [rawPath, mod] of Object.entries(modules)) {
    const path = rawPath.replace(/\\/g, '/');
    const match = path.match(/regions\/([^/]+)\/([^/]+)\.ts$/);
    if (!match) continue;
    const [, folder, file] = match;
    const entry = byFolder.get(folder) ?? { levels: [] };
    if (file === 'region') entry.meta = mod.default as RegionMeta;
    else entry.levels.push([file, mod.default as Level]);
    byFolder.set(folder, entry);
  }

  return [...byFolder.entries()]
    .sort(([a], [b]) => byName(a, b))
    .map(([folder, { meta, levels }]) => {
      if (!meta) throw new Error(`Region folder "${folder}" is missing region.ts`);
      return {
        ...meta,
        levels: levels.sort(([a], [b]) => byName(a, b)).map(([, level]) => level),
      };
    })
    .filter((region) => region.levels.length > 0);
}

export function allLevels(regions: Region[]): Level[] {
  return regions.flatMap((r) => r.levels);
}

export function findLevel(regions: Region[], id: string): { level: Level; region: Region } | undefined {
  for (const region of regions) {
    const level = region.levels.find((l) => l.id === id);
    if (level) return { level, region };
  }
  return undefined;
}
