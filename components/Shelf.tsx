'use client';
/* eslint-disable @next/next/no-img-element -- covers are hotlinked from the list's own image host at their real size */

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { stay } from '@/lib/catalogue';
import { FAMILIES, FAMILY_ORDER, type Family, type Format } from '@/lib/sections';
import { SaveButton } from './SaveButton';
import { BookFace, spineName, spineStyle } from './Spine';

export interface ShelfBook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  weeks: number;
  rank: number;
  section: string;
  sectionName: string;
  sectionCode: string;
  family: Family;
  format: Format;
  shelfmark: string;
}

type Order = 'weeks' | 'section' | 'author';
/** Bookshop words: face out shows the cover, spine out only the spine. */
type Stand = 'face' | 'spine';

const ORDERS: { value: Order; label: string }[] = [
  { value: 'weeks', label: 'Staying power' },
  { value: 'section', label: 'Section' },
  { value: 'author', label: 'Author' },
];

const surname = (author: string) => author.split(/,| and | with /i)[0].trim().split(/\s+/).pop() ?? author;

/** The bookcase. Every book is a spine you can pick up: the book in hand is
    described on the card beside the case (under it on a phone). The shelf is
    one tab stop; the arrow keys move along it. */
export function Shelf({ books, families = true }: { books: ShelfBook[]; families?: boolean }) {
  const [order, setOrder] = useState<Order>('weeks');
  const [family, setFamily] = useState<Family | 'all'>('all');
  const [stand, setStand] = useState<Stand>('face');
  const [picked, setPicked] = useState(books[0]?.id ?? '');
  const [fresh, setFresh] = useState(true);
  const caseRef = useRef<HTMLOListElement>(null);

  const shown = useMemo(() => {
    const list = family === 'all' ? books : books.filter((book) => book.family === family);
    const sorted = [...list];
    if (order === 'weeks') sorted.sort((a, b) => b.weeks - a.weeks || a.title.localeCompare(b.title));
    if (order === 'author') sorted.sort((a, b) => surname(a.author).localeCompare(surname(b.author)) || a.title.localeCompare(b.title));
    if (order === 'section') {
      const rank = (book: ShelfBook) => FAMILY_ORDER.indexOf(book.family);
      sorted.sort((a, b) => rank(a) - rank(b) || a.sectionName.localeCompare(b.sectionName) || b.weeks - a.weeks);
    }
    return sorted;
  }, [books, family, order]);

  const counts = useMemo(() => {
    const tally = new Map<Family, number>();
    for (const book of books) tally.set(book.family, (tally.get(book.family) ?? 0) + 1);
    return tally;
  }, [books]);

  // The book in hand is always one that is on the shelf as it is shown now.
  const active = shown.find((book) => book.id === picked) ?? shown[0];

  /** Re-shelve. Where the browser supports it, every spine slides to its new place. */
  const rearrange = (change: () => void) => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still && 'startViewTransition' in document) {
      document.startViewTransition(() => flushSync(() => (setFresh(false), change())));
    } else {
      setFresh(false);
      change();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    const index = shown.findIndex((book) => book.id === active?.id);
    let next = -1;
    if (move) next = Math.min(shown.length - 1, Math.max(0, index + move));
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = shown.length - 1;
    if (next < 0 || next === index) return;
    event.preventDefault();
    setPicked(shown[next].id);
    caseRef.current?.querySelector<HTMLElement>(`[data-id="${shown[next].id}"]`)?.focus();
  };

  return (
    <div className="shelf">
      <div className="toolbar">
        <fieldset>
          <legend className="sign">Arrange by</legend>
          <div className="seg sign">
            {ORDERS.filter((option) => families || option.value !== 'section').map((option) => (
              <label key={option.value}>
                <input type="radio" name="order" checked={order === option.value} onChange={() => rearrange(() => setOrder(option.value))} />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="sign">Stand them</legend>
          <div className="seg sign">
            <label>
              <input type="radio" name="stand" checked={stand === 'face'} onChange={() => rearrange(() => setStand('face'))} />
              Face out
            </label>
            <label>
              <input type="radio" name="stand" checked={stand === 'spine'} onChange={() => rearrange(() => setStand('spine'))} />
              Spine out
            </label>
          </div>
        </fieldset>
        {families ? (
          <fieldset>
            <legend className="sign">Show</legend>
            <div className="seg sign">
              <label>
                <input type="radio" name="family" checked={family === 'all'} onChange={() => rearrange(() => setFamily('all'))} />
                All {books.length}
              </label>
              {FAMILY_ORDER.filter((key) => counts.has(key)).map((key) => (
                <label key={key} data-family={key}>
                  <input type="radio" name="family" checked={family === key} onChange={() => rearrange(() => setFamily(key))} />
                  <span className="swatch" aria-hidden="true" />
                  {FAMILIES[key].label} {counts.get(key)}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>

      <div className="shelf__body">
        <div>
          <ol className="case" ref={caseRef} data-fresh={fresh} data-stand={stand} onKeyDown={onKeyDown} aria-label="Books on the shelf. Use the left and right arrow keys to move along it.">
            {shown.map((book, i) => {
              const startsSection = order === 'section' && (i === 0 || shown[i - 1].section !== book.section);
              return (
                <li key={book.id} className="slot" style={{ '--n': i, viewTransitionName: `b-${book.id}` } as CSSProperties}>
                  {startsSection ? (
                    <span className="marker" aria-hidden="true">
                      {book.sectionCode}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className="vol"
                    data-id={book.id}
                    data-family={book.family}
                    data-format={book.format}
                    style={spineStyle(book)}
                    aria-pressed={book.id === active?.id}
                    aria-label={spineName(book)}
                    tabIndex={book.id === active?.id ? 0 : -1}
                    onClick={() => setPicked(book.id)}
                  >
                    <BookFace book={book} faceOut={stand === 'face'} />
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="key">
            <div className="key__scale" aria-hidden="true">
              {[
                [1, '1 week'],
                [52, '1 year'],
                [260, '5 years'],
                [780, '15 years'],
              ].map(([weeks, label]) => (
                <div key={label}>
                  <span className="key__ref" style={{ '--s': Math.sqrt(Number(weeks)).toFixed(3) } as CSSProperties} />
                  <span className="typed">{label}</span>
                </div>
              ))}
            </div>
            <p>
              The thicker the spine, the longer the book stayed on its list; thickness grows with the square root of the weeks, so the giants still fit. Height is the
              format, hardcovers tallest and audio shortest. The lit bar is the family of lists. Stood face out, each book shows its cover beside its spine.
            </p>
          </div>
        </div>

        {active ? (
          <aside className="desk on-card" data-family={active.family} aria-live="polite" aria-label="The book in hand">
            <div className="card">
              {active.cover ? (
                <img className="desk__cover" src={active.cover} width={active.coverWidth} height={active.coverHeight} alt="" loading="lazy" decoding="async" />
              ) : (
                <span />
              )}
              <div>
                <p className="typed desk__mark">{active.shelfmark}</p>
                <h3>{active.title}</h3>
                <p className="desk__author">{active.author}</p>
                <p className="desk__stay">
                  <strong>{active.weeks}</strong> {active.weeks === 1 ? 'week' : 'weeks'} on the list
                  {active.weeks >= 9 ? `, about ${stay(active.weeks)}` : ''}
                </p>
                <div className="desk__more">
                  <p>
                    <Link className="link" href={`/sections/${active.section}`}>
                      {active.sectionName}
                    </Link>
                  </p>
                  {active.description ? <p style={{ marginTop: '0.5rem' }}>{active.description}</p> : null}
                </div>
              </div>
              <div className="desk__actions">
                <Link className="btn" href={`/books/${active.id}`}>
                  Open the card
                </Link>
                <SaveButton
                  plain
                  book={{
                    id: active.id,
                    title: active.title,
                    author: active.author,
                    weeks: active.weeks,
                    family: active.family,
                    format: active.format,
                    shelfmark: active.shelfmark,
                    cover: active.cover,
                    coverWidth: active.coverWidth,
                    coverHeight: active.coverHeight,
                  }}
                />
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
