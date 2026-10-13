import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadState } from './lib/storage';
import { GameProvider } from './state/game';
import './styles/global.css';

const root = createRoot(document.getElementById('root')!);

loadState().then((initialState) =>
  root.render(
    <StrictMode>
      <GameProvider initialState={initialState}>
        <App />
      </GameProvider>
    </StrictMode>,
  ),
);
