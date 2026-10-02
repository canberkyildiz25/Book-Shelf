import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="lost wrap">
      <p className="typed" style={{ color: 'var(--ink-2)' }}>
        404
      </p>
      <h1>That shelfmark leads nowhere.</h1>
      <p>The book may have left the lists since the link was made, or the address was mistyped.</p>
      <Link className="btn" href="/">
        Back to the main shelf
      </Link>
    </main>
  );
}
