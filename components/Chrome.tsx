'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHydrated, useShelf } from '@/lib/store';

/** The mark: one slab from the rack, its status bar lit and its corner cut. */
function Mark() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" aria-hidden="true">
      <path d="M0 0h11l5 5v19H0z" fill="var(--rail)" />
      <path d="M0 0h11l4 4H0z" fill="var(--accent)" />
      <rect x="3" y="17" width="10" height="4" fill="var(--accent)" />
    </svg>
  );
}

function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice lasts for this page view only */
    }
  };
  return (
    <button type="button" className="icon-btn" onClick={flip} aria-label="Switch the room lights" title="Switch the room lights">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

export function Header() {
  const path = usePathname();
  const hydrated = useHydrated();
  const count = useShelf((state) => state.saved.length);

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link className="wordmark" href="/" aria-label="Shelfmark, the main shelf">
          <Mark />
          SHELFMARK
        </Link>
        <div className="site-header__row">
          <nav className="site-nav sign" aria-label="Primary">
            <Link className="nav-wide" href="/" aria-current={path === '/' ? 'page' : undefined}>
              The shelf
            </Link>
            <Link className="nav-wide" href="/#sections">
              Sections
            </Link>
            <Link href="/my-shelf" aria-current={path === '/my-shelf' ? 'page' : undefined}>
              <span>
                <span className="nav-drop">My </span>shelf
              </span>
              <span className="count" aria-label={`${hydrated ? count : 0} saved`}>
                {hydrated ? count : 0}
              </span>
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
