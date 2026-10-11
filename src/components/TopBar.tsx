import { findLevel, regions } from '../content';
import { nextUnfinished, playerLevel, todayString, visibleStreak } from '../lib/progress';
import { goToLevel, goToMap } from '../lib/router';
import { useGame } from '../state/game';
import { Avatar, CoinIcon, FlameIcon, GearIcon, Logo, PlayIcon, SunMoonIcon } from './art';
import styles from './TopBar.module.css';

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { state, order, updateSettings } = useGame();
  const { level, into, needed } = playerLevel(state.xp);
  const streak = visibleStreak(state.streak, todayString());
  const nextId = nextUnfinished(state, order);
  const nextTitle = nextId ? findLevel(regions, nextId)?.level.title : null;
  const dark = state.settings.theme === 'dark';

  return (
    <header className={styles.bar}>
      <button className={styles.logo} onClick={goToMap} aria-label="Java Quest: back to the map">
        <Logo />
        <span className={styles.logoText}>
          Java <b>Quest</b>
        </span>
      </button>

      <button
        className={`btn btn-primary ${styles.continue}`}
        onClick={() => nextId && goToLevel(nextId)}
        disabled={!nextId}
        title={nextTitle ? `Continue: ${nextTitle}` : 'All levels complete!'}
        aria-label={nextTitle ? `Continue: ${nextTitle}` : 'All levels complete'}
      >
        <PlayIcon />
        <span className={styles.hideSmall}>{nextId ? 'Continue' : 'All done!'}</span>
      </button>

      <div className={styles.stats}>
        <div className={styles.xp} title={`${into} / ${needed} XP to level ${level + 1}`}>
          <span className={styles.lvl} aria-label={`Player level ${level}`}>
            {level}
          </span>
          <div className={styles.xpTrack} role="progressbar" aria-label="XP" aria-valuemin={0} aria-valuemax={needed} aria-valuenow={into}>
            <div className={styles.xpFill} style={{ width: `${(into / needed) * 100}%` }} />
          </div>
          <span className={`${styles.xpText} ${styles.hideSmall}`}>{state.xp} XP</span>
        </div>

        <div className={styles.pill} title="Coins">
          <CoinIcon />
          <span>{state.coins}</span>
          <span className="visually-hidden">coins</span>
        </div>

        <div className={styles.pill} title={`Day streak (best ${state.streak.best})`}>
          <FlameIcon lit={streak > 0} />
          <span>{streak}</span>
          <span className="visually-hidden">day streak</span>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={`icon-btn ${styles.themeToggle}`}
          onClick={() => updateSettings({ theme: dark ? 'light' : 'dark' })}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          <SunMoonIcon dark={dark} />
        </button>
        <button className={styles.player} onClick={onOpenSettings} aria-label="Player profile and settings">
          <Avatar index={state.player.avatar} size={38} />
          <span className={`${styles.name} ${styles.hideSmall}`}>{state.player.name.trim() || 'Adventurer'}</span>
          <span className={styles.gear}>
            <GearIcon size={16} />
          </span>
        </button>
      </div>
    </header>
  );
}
