import { assembleRegions } from './assemble';

// Vite finds every content file at build time. Drop a new level file into a region
// folder and it appears on the map automatically.
const modules = import.meta.glob<{ default: unknown }>('./regions/*/*.ts', { eager: true });

export const regions = assembleRegions(modules);
export { allLevels, findLevel } from './assemble';
