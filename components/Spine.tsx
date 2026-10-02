/* eslint-disable @next/next/no-img-element -- covers are hotlinked from the list's own image host */
import type { CSSProperties } from 'react';
import { spineHeight, spineUnits } from '@/lib/catalogue';
import type { Family, Format } from '@/lib/sections';

export interface SpineBook {
  id: string;
  title: string;
  author: string;
  weeks: number;
  family: Family;
  format: Format;
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
}

/** Width over height of the cover as it is shown: the real proportion, kept
    between a tall paperback and a nearly square audio cover. */
const coverRatio = (book: Pick<SpineBook, 'coverWidth' | 'coverHeight'>) =>
  Math.min(1.05, Math.max(0.6, (book.coverWidth || 2) / (book.coverHeight || 3)));

/** The things a book's shape says: how long it stayed (thickness), what
    format it is (height) and the proportion of its cover. Colour comes from
    `data-family`. */
export const spineStyle = (book: Pick<SpineBook, 'weeks' | 'format' | 'coverWidth' | 'coverHeight'>) =>
  ({ '--s': spineUnits(book.weeks).toFixed(3), '--h': spineHeight(book.format), '--ar': coverRatio(book).toFixed(3) }) as CSSProperties;

export const spineName = (book: SpineBook) => `${book.title} by ${book.author}, ${book.weeks} ${book.weeks === 1 ? 'week' : 'weeks'} on the list`;

/** What is printed on a spine: the title down its length, the author if the
    book is thick enough, and the readout with the number of weeks. */
export function SpineFace({ book }: { book: SpineBook }) {
  return (
    <>
      <span className="spine__title">{book.title}</span>
      <span className="spine__author">{book.author}</span>
      <span className="spine__label">{book.weeks}</span>
    </>
  );
}

/** A book as it stands in the rack: its spine, and beside it the cover when
    it is stood face out. The wrapper (a button, a link) carries the label, so
    the cover is decorative here. */
export function BookFace({ book, faceOut }: { book: SpineBook; faceOut: boolean }) {
  return (
    <>
      <span className="spine">
        <SpineFace book={book} />
      </span>
      {faceOut && book.cover ? <img className="cover" src={book.cover} alt="" loading="lazy" decoding="async" /> : null}
    </>
  );
}
