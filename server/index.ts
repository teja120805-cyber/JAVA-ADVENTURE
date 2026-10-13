import express from 'express';
import { findLevel } from '../src/content/assemble';
import type { RunRequest, SubmitRequest } from '../src/lib/api-types';
import { loadRegions } from './content';
import { detectJava } from './java';
import { judge, runForPlayer } from './judge';
import { isSave, readSave, SAVE_FILE, writeSave } from './saves';

const PORT = Number(process.env.PORT ?? 3001);

const regions = await loadRegions();
let java = await detectJava();

const levelCount = regions.reduce((n, r) => n + r.levels.length, 0);
console.log(`Loaded ${regions.length} regions, ${levelCount} levels.`);
console.log(java.ok ? `✔ ${java.message}` : `✘ ${java.message}`);

console.log(`Progress is saved to ${SAVE_FILE}`);

const app = express();

// The save holds every code draft, so it gets a bigger body limit than the other routes.
// sendBeacon (used when the tab closes) can only POST, and sends text/plain, hence the type option.
const saveBody = express.json({ limit: '5mb', type: () => true });
const storeSave: express.RequestHandler = async (req, res) => {
  if (!isSave(req.body)) {
    res.status(400).json({ error: 'Not a Java Quest save' });
    return;
  }
  try {
    res.json({ saved: await writeSave(req.body) });
  } catch (err) {
    console.error('Could not write the save file:', err);
    res.status(500).json({ error: 'Could not write the save file' });
  }
};

app.get('/api/save', async (_req, res) => {
  res.json({ save: await readSave() });
});
app.put('/api/save', saveBody, storeSave);
app.post('/api/save', saveBody, storeSave);

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  // Re-check if Java was missing, so installing it doesn't need a server restart.
  if (!java.ok) java = await detectJava();
  res.json({ java });
});

function lookupChallenge(levelId: unknown, index: unknown) {
  if (typeof levelId !== 'string' || typeof index !== 'number') return undefined;
  return findLevel(regions, levelId)?.level.challenges[index];
}

app.post('/api/run', async (req, res) => {
  const body = req.body as RunRequest;
  if (typeof body?.code !== 'string') {
    res.status(400).json({ error: 'code must be a string' });
    return;
  }
  const challenge = lookupChallenge(body.levelId, body.challengeIndex);
  res.json(await runForPlayer(body.code, typeof body.stdin === 'string' ? body.stdin : '', challenge));
});

app.post('/api/submit', async (req, res) => {
  const body = req.body as SubmitRequest;
  const challenge = lookupChallenge(body?.levelId, body?.challengeIndex);
  if (!challenge || typeof body.code !== 'string') {
    res.status(400).json({ error: 'Unknown level/challenge or missing code' });
    return;
  }
  res.json(await judge(challenge, body.code, Math.max(0, Number(body.priorFails) || 0)));
});

// Local use only: listen on the loopback interface so other machines can't reach it.
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Java Quest runner listening on http://localhost:${PORT}`);
});
