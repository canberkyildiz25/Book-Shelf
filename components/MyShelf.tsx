'use client';

import Link from 'next/link';
import { stay } from '@/lib/catalogue';
import { useHydrated, useShelf } from '@/lib/store';
import { BookFace, spineName, spineStyle } from './Spine';

/** Your own shelf: the books you added, standing at the same scale as the
    shop's. It is kept in this browser only. */
export function MyShelf() {
  const hydrated = useHydrated();
  const saved = useShelf((state) => state.saved);
  const remove = useShelf((state) => state.remove);
  const books = hydrated ? saved : [];
  const weeks = books.reduce((sum, book) => sum + book.weeks, 0);

  return (
    <>
      <dl className="facts">
        <div>
          <dt className="sign">Books</dt>
          <dd>{books.length}</dd>
        </div>
        <div>
          <dt className="sign">Weeks on the lists</dt>
          <dd>{weeks.toLocaleString('en-US')}</dd>
        </div>
      </dl>

      <ol className="case" data-stand="face" aria-label="Books on your shelf">
        {books.length ? (
          books.map((book) => (
            <li key={book.id} className="slot">
              <Link className="vol" href={`/books/${book.id}`} data-family={book.family} data-format={book.format} style={spineStyle(book)} aria-label={spineName(book)}>
                <BookFace book={book} faceOut />
              </Link>
            </li>
          ))
        ) : (
          <li className="case__empty">
            <p>{hydrated ? 'Nothing here yet. Pick a book up from the main shelf and add it.' : 'Looking for your shelf.'}</p>
          </li>
        )}
      </ol>

      {books.length ? (
        <ul className="mine__list">
          {books.map((book) => (
            <li key={book.id}>
              <div>
                <Link className="link" href={`/books/${book.id}`}>
                  {book.title}
                </Link>
                <span>
                  {book.author} · {book.weeks} {book.weeks === 1 ? 'week' : 'weeks'}
                  {book.weeks >= 9 ? `, about ${stay(book.weeks)}` : ''}
                </span>
              </div>
              <button type="button" className="btn btn--plain" onClick={() => remove(book.id)} aria-label={`Take ${book.title} off my shelf`}>
                Take off
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="btn" href="/">
            Go to the main shelf
          </Link>
        </p>
      )}
    </>
  );
}
