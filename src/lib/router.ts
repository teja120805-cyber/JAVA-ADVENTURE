import { useSyncExternalStore } from 'react';

// A tiny hash router: "#/" is the map, "#/level/<id>" is a level.
export type Route = { name: 'map' } | { name: 'level'; id: string };

function parse(hash: string): Route {
  const match = hash.match(/^#\/level\/([\w-]+)/);
  return match ? { name: 'level', id: match[1] } : { name: 'map' };
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parse(hash);
}

export function goToMap() {
  window.location.hash = '#/';
}

export function goToLevel(id: string) {
  window.location.hash = `#/level/${id}`;
}
