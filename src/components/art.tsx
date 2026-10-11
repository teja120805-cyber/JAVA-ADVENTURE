// All artwork is original inline SVG so it scales, themes and loads instantly.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

/** Bean, the coffee-bean guide. `mood` changes the face. */
export function Bean({ size = 72, mood = 'happy', ...rest }: P & { mood?: 'happy' | 'wow' | 'think' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" {...rest}>
      <ellipse cx="50" cy="92" rx="26" ry="5" fill="var(--shadow-ink)" />
      <g transform="rotate(-12 50 52)">
        <ellipse cx="50" cy="52" rx="30" ry="38" fill="#7a4a2b" />
        <ellipse cx="44" cy="44" rx="20" ry="26" fill="#94603b" />
        <path d="M52 16 C 40 36, 62 64, 48 88" stroke="#5a341c" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      {/* face */}
      <ellipse cx="38" cy="50" rx="5.5" ry={mood === 'wow' ? 7 : 6} fill="#fff" />
      <ellipse cx="62" cy="48" rx="5.5" ry={mood === 'wow' ? 7 : 6} fill="#fff" />
      <circle cx={mood === 'think' ? 40 : 39} cy={mood === 'think' ? 47 : 51} r="3" fill="#1d1d1d" />
      <circle cx={mood === 'think' ? 64 : 63} cy={mood === 'think' ? 45 : 49} r="3" fill="#1d1d1d" />
      <circle cx="30" cy="62" r="4" fill="#f08a8a" opacity=".6" />
      <circle cx="70" cy="60" r="4" fill="#f08a8a" opacity=".6" />
      {mood === 'wow' ? (
        <ellipse cx="51" cy="65" rx="5" ry="6" fill="#3a1d0c" />
      ) : mood === 'think' ? (
        <path d="M44 66 Q 52 62 58 65" stroke="#3a1d0c" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M42 62 Q 51 72 60 61" stroke="#3a1d0c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {/* little green explorer hat */}
      <path d="M28 22 Q 50 4 72 18 L 68 26 Q 50 18 32 30 Z" fill="var(--green)" />
      <rect x="44" y="9" width="12" height="5" rx="2" transform="rotate(-10 50 12)" fill="#ffd34d" />
    </svg>
  );
}

export function Logo({ size = 36 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M17 6 q-3 4 0 8 q3 4 0 8" stroke="var(--green)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M25 4 q-3 4 0 8 q3 4 0 8" stroke="var(--green)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M7 24 h30 v8 a12 12 0 0 1 -12 12 h-6 a12 12 0 0 1 -12 -12 z" fill="var(--green)" />
      <path d="M37 27 h3 a5 5 0 0 1 0 10 h-4" stroke="var(--green)" strokeWidth="3" fill="none" />
      <path d="M14 31 l4 4 l-4 4 M22 39 h7" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Player avatars ----------

const AVATARS = [
  { name: 'Knight', skin: '#f2c9a0', body: '#5b7bd5', hat: 'helmet' },
  { name: 'Wizard', skin: '#f6d2b0', body: '#8a5cd6', hat: 'wizard' },
  { name: 'Ranger', skin: '#c98d5e', body: '#2f9e5f', hat: 'hood' },
  { name: 'Robot', skin: '#b7c4cf', body: '#e0703a', hat: 'antenna' },
  { name: 'Pirate', skin: '#e8b48a', body: '#c43d4b', hat: 'bandana' },
  { name: 'Bard', skin: '#8d5a3b', body: '#e2a91c', hat: 'feather' },
] as const;

export const AVATAR_NAMES = AVATARS.map((a) => a.name);

export function Avatar({ index, size = 36 }: { index: number; size?: number }) {
  const a = AVATARS[index % AVATARS.length];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${a.name} avatar`}>
      <circle cx="32" cy="32" r="31" fill="var(--avatar-bg)" />
      <path d="M12 60 q20 -22 40 0" fill={a.body} />
      <circle cx="32" cy="30" r="14" fill={a.skin} />
      <circle cx="27" cy="30" r="2" fill="#222" />
      <circle cx="37" cy="30" r="2" fill="#222" />
      <path d="M27 36 q5 4 10 0" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
      {a.hat === 'helmet' && (
        <>
          <path d="M17 28 a15 15 0 0 1 30 0 z" fill="#9aa6b2" />
          <rect x="30" y="10" width="4" height="8" fill="#d33" />
        </>
      )}
      {a.hat === 'wizard' && <path d="M16 22 L32 0 L48 22 Z" fill={a.body} stroke="#ffd34d" strokeWidth="2" />}
      {a.hat === 'hood' && <path d="M16 32 a16 18 0 0 1 32 0 l-4 -2 a12 12 0 0 0 -24 0 z" fill="#2a7a49" />}
      {a.hat === 'antenna' && (
        <>
          <line x1="32" y1="16" x2="32" y2="6" stroke="#666" strokeWidth="2" />
          <circle cx="32" cy="5" r="3" fill="#e0703a" />
          <rect x="22" y="27" width="20" height="6" rx="3" fill="none" stroke="#555" strokeWidth="1.5" />
        </>
      )}
      {a.hat === 'bandana' && (
        <>
          <path d="M18 24 a14 12 0 0 1 28 0 z" fill="#c43d4b" />
          <rect x="34" y="27" width="7" height="6" rx="2" fill="#222" />
        </>
      )}
      {a.hat === 'feather' && (
        <>
          <path d="M18 22 h28 l-4 -6 h-20 z" fill="#5a3a8a" />
          <path d="M42 16 q8 -10 4 -14 q-6 6 -6 14" fill="#e94f6b" />
        </>
      )}
    </svg>
  );
}

// ---------- Small icons ----------

export function StarIcon({ filled = true, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
        fill={filled ? 'var(--gold)' : 'var(--star-empty)'}
        stroke={filled ? 'var(--gold-dark)' : 'var(--star-empty-edge)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--gold)" stroke="var(--gold-dark)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="var(--gold-dark)" strokeWidth="1.2" opacity=".7" />
      <path d="M12 8.5v7" stroke="var(--gold-dark)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FlameIcon({ size = 20, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z"
        fill={lit ? '#ff8a1f' : 'var(--star-empty)'}
      />
      <path d="M12 12c.5 2 3 3 3 5.5a3 3 0 0 1-6 0c0-1.5 1-2.5 1.5-3 0 1 .5 1.5 1 1.5 0-2-.2-3 .5-4z" fill={lit ? '#ffd34d' : 'transparent'} />
    </svg>
  );
}

export function LockIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" fill="none" />
    </svg>
  );
}

export function CheckIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrownIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="var(--gold)" stroke="var(--gold-dark)" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="1.6" fill="#e94f6b" />
    </svg>
  );
}

export function GearIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.4 2.3l-2-.4a6.6 6.6 0 0 0-.8-1.9l1.2-1.7-1.6-1.6-1.7 1.2a6.6 6.6 0 0 0-1.9-.8l-.4-2h-2.4l-.4 2a6.6 6.6 0 0 0-1.9.8L6.8 5.2 5.2 6.8l1.2 1.7a6.6 6.6 0 0 0-.8 1.9l-2 .4v2.4l2 .4c.2.7.4 1.3.8 1.9l-1.2 1.7 1.6 1.6 1.7-1.2c.6.4 1.2.6 1.9.8l.4 2h2.4l.4-2c.7-.2 1.3-.4 1.9-.8l1.7 1.2 1.6-1.6-1.2-1.7c.4-.6.6-1.2.8-1.9l2-.4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SunMoonIcon({ dark, size = 20 }: { dark: boolean; size?: number }) {
  return dark ? (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 12 12)`} />
      ))}
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
    </svg>
  );
}

export function BulbIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" fill="#ffd34d" stroke="#c99a00" strokeWidth="1.2" />
      <rect x="8.5" y="18" width="7" height="3" rx="1" fill="#9aa6b2" />
    </svg>
  );
}

export function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </svg>
  );
}

export function FlagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Map scenery ----------

export function Scenery({ kind, size = 48 }: { kind: string; size?: number }) {
  switch (kind) {
    case 'tree':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
          <rect x="21" y="30" width="6" height="14" rx="2" fill="#8a5a36" />
          <circle cx="24" cy="20" r="14" fill="var(--scenery-leaf)" />
          <circle cx="17" cy="16" r="6" fill="var(--scenery-leaf-light)" />
        </svg>
      );
    case 'pine':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
          <rect x="21" y="36" width="6" height="10" fill="#6d4429" />
          <path d="M24 2 L40 24 H32 L42 38 H6 L16 24 H8 Z" fill="var(--scenery-pine)" />
        </svg>
      );
    case 'flower':
      return (
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" aria-hidden="true">
          <line x1="12" y1="12" x2="12" y2="23" stroke="#3c9a4b" strokeWidth="2" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="12" cy="6" rx="3" ry="4.5" fill="var(--scenery-petal)" transform={`rotate(${a} 12 11)`} />
          ))}
          <circle cx="12" cy="11" r="2.8" fill="#ffd34d" />
        </svg>
      );
    case 'rock':
      return (
        <svg width={size * 0.7} height={size * 0.5} viewBox="0 0 36 24" aria-hidden="true">
          <path d="M2 22 Q4 8 14 6 Q22 2 30 10 Q36 16 34 22 Z" fill="var(--scenery-rock)" />
          <path d="M10 10 Q16 7 20 9" stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'mushroom':
      return (
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="10" y="12" width="4" height="10" rx="2" fill="#f1e3cf" />
          <path d="M2 13 a10 9 0 0 1 20 0 z" fill="#d9483b" />
          <circle cx="8" cy="9" r="1.6" fill="#fff" />
          <circle cx="14" cy="7" r="1.8" fill="#fff" />
        </svg>
      );
    case 'tower':
      return (
        <svg width={size} height={size * 1.6} viewBox="0 -8 40 64" aria-hidden="true">
          <rect x="8" y="16" width="24" height="40" fill="var(--scenery-stone)" />
          <path d="M6 18 L20 2 L34 18 Z" fill="var(--scenery-roof)" />
          <rect x="17" y="26" width="6" height="9" rx="3" fill="#2b2140" />
          <path d="M20 2 V-6 M20 -6 h8 l-2 3 2 3 h-8" stroke="#6d4429" fill="#e94f6b" />
        </svg>
      );
    case 'chest':
      return (
        <svg width={size * 0.8} height={size * 0.7} viewBox="0 0 32 26" aria-hidden="true">
          <rect x="2" y="10" width="28" height="14" rx="2" fill="#a0612f" />
          <path d="M2 10 a14 8 0 0 1 28 0 z" fill="#c07a3d" />
          <rect x="2" y="9" width="28" height="3" fill="var(--gold)" />
          <rect x="14" y="12" width="4" height="6" rx="1" fill="var(--gold)" />
        </svg>
      );
    case 'sign':
      return (
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 32 32" aria-hidden="true">
          <rect x="14" y="10" width="4" height="22" fill="#8a5a36" />
          <path d="M4 6 h22 l4 4 l-4 4 h-22 z" fill="#c9965b" />
          <path d="M8 10 h14" stroke="#7a4a2b" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
