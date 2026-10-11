import { useEffect, useRef, useState } from 'react';
import { regions } from '../content';
import { playerLevel } from '../lib/progress';
import { useGame } from '../state/game';
import { Avatar, AVATAR_NAMES } from './art';
import styles from './SettingsModal.module.css';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, updatePlayer, updateSettings, reset } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>('input, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && dialog.current) {
        const items = dialog.current.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  const completed = Object.values(state.levels).filter((l) => l.completed).length;
  const stars = Object.values(state.levels).reduce((n, l) => n + l.bestStars, 0);
  const totalLevels = regions.reduce((n, r) => n + r.levels.length, 0);

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className={styles.head}>
          <h2 id="settings-title">Profile & settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <label className={styles.field}>
          <span>Adventurer name</span>
          <input
            value={state.player.name}
            maxLength={24}
            onChange={(e) => updatePlayer({ name: e.target.value })}
            placeholder="Adventurer"
          />
        </label>

        <fieldset className={styles.avatars}>
          <legend>Avatar</legend>
          {AVATAR_NAMES.map((name, i) => (
            <button
              key={name}
              className={`${styles.avatar} ${state.player.avatar === i ? styles.picked : ''}`}
              onClick={() => updatePlayer({ avatar: i })}
              aria-pressed={state.player.avatar === i}
              aria-label={name}
              title={name}
            >
              <Avatar index={i} size={48} />
            </button>
          ))}
        </fieldset>

        <div className={styles.stats}>
          <div>
            <b>{playerLevel(state.xp).level}</b>
            <span>Player level</span>
          </div>
          <div>
            <b>
              {completed}/{totalLevels}
            </b>
            <span>Levels</span>
          </div>
          <div>
            <b>{stars}</b>
            <span>Stars</span>
          </div>
          <div>
            <b>{state.streak.best}</b>
            <span>Best streak</span>
          </div>
        </div>

        <div className={styles.badges}>
          {regions.map((r) => {
            const has = state.badges.includes(r.badge.id);
            return (
              <div key={r.id} className={`${styles.badge} ${has ? styles.earned : ''}`} title={has ? r.badge.name : `Locked: beat the ${r.title} boss`}>
                <span aria-hidden="true">{r.badge.emoji}</span>
                <small>{has ? r.badge.name : '???'}</small>
              </div>
            );
          })}
        </div>

        <div className={styles.toggles}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={state.settings.theme === 'dark'}
              onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
            />
            <span>Dark mode</span>
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={state.settings.unlockAll}
              onChange={(e) => updateSettings({ unlockAll: e.target.checked })}
            />
            <span>
              Unlock all levels <small>(for testing; doesn't change your progress)</small>
            </span>
          </label>
        </div>

        <div className={styles.danger}>
          {!confirmReset ? (
            <button className="btn btn-ghost" onClick={() => setConfirmReset(true)}>
              Reset progress…
            </button>
          ) : (
            <div className={styles.confirm}>
              <p>Erase all XP, coins, stars, badges and saved code? This can't be undone.</p>
              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    reset();
                    setConfirmReset(false);
                    onClose();
                    window.location.hash = '#/';
                  }}
                >
                  Yes, reset everything
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
