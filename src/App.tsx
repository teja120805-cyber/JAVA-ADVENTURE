import { lazy, Suspense, useEffect, useState } from 'react';
import { JavaBanner } from './components/JavaBanner';
import { SettingsModal } from './components/SettingsModal';
import { TopBar } from './components/TopBar';
import { WorldMap } from './components/WorldMap';
import { findLevel, regions } from './content';
import { getHealth } from './lib/api';
import type { JavaInfo } from './lib/api-types';
import { isUnlocked } from './lib/progress';
import { goToMap, useRoute } from './lib/router';
import { useGame } from './state/game';

// The level screen carries the code editor, so it loads only when a level is opened.
const LevelScreen = lazy(() => import('./components/LevelScreen').then((m) => ({ default: m.LevelScreen })));

export default function App() {
  const route = useRoute();
  const { state, order } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [java, setJava] = useState<JavaInfo | null | 'server-down'>(null);

  const checkJava = async () => {
    const health = await getHealth();
    setJava(health ? health.java : 'server-down');
  };
  useEffect(() => {
    void checkJava();
  }, []);

  // Locked or unknown levels send the player back to the map.
  const found = route.name === 'level' ? findLevel(regions, route.id) : undefined;
  const allowed = found && isUnlocked(state, order, found.level.id);
  useEffect(() => {
    if (route.name === 'level' && !allowed) goToMap();
  }, [route, allowed]);

  useEffect(() => {
    document.title = found ? `${found.level.title} · Java Quest` : 'Java Quest';
  }, [found]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />
      {java !== null && <JavaBanner status={java} onRecheck={checkJava} />}
      <main id="main">
        {found && allowed ? (
          <Suspense fallback={<p className="loading">Loading level…</p>}>
            <LevelScreen key={found.level.id} level={found.level} region={found.region} />
          </Suspense>
        ) : (
          <WorldMap />
        )}
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
