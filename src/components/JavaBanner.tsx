import { useState } from 'react';
import type { JavaInfo } from '../lib/api-types';
import styles from './JavaBanner.module.css';

/** Shown only when the code runner can't be reached or Java isn't installed. */
export function JavaBanner({ status, onRecheck }: { status: JavaInfo | 'server-down'; onRecheck: () => Promise<void> }) {
  const [checking, setChecking] = useState(false);
  if (status !== 'server-down' && status.ok) return null;

  const recheck = async () => {
    setChecking(true);
    await onRecheck();
    setChecking(false);
  };

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.icon} aria-hidden="true">
        ☕
      </div>
      <div className={styles.body}>
        {status === 'server-down' ? (
          <>
            <strong>The code runner isn't running.</strong>
            <p>
              Start everything with <code>npm run dev</code> (it starts the website and the Java runner together). You can
              still read lessons, but Run and Submit won't work until it's up.
            </p>
          </>
        ) : (
          <>
            <strong>Java needs to be installed to run code.</strong>
            <p>{status.message}</p>
            <ol>
              <li>
                Download <b>Temurin 21 (LTS)</b> from{' '}
                <a href="https://adoptium.net" target="_blank" rel="noreferrer">
                  adoptium.net
                </a>{' '}
                and run the installer. Tick "Add to PATH" and "Set JAVA_HOME" if asked.
              </li>
              <li>
                Close and reopen your terminal, then check with <code>java -version</code>.
              </li>
              <li>Press "Check again" below.</li>
            </ol>
          </>
        )}
      </div>
      <button className="btn btn-small" onClick={recheck} disabled={checking}>
        {checking ? 'Checking…' : 'Check again'}
      </button>
    </div>
  );
}
