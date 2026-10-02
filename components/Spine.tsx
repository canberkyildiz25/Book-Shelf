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
}

/** The two things a spine's shape says: how long the book stayed (thickness)
    and what format it is (height). Colour comes from `data-family`. */
export const spineStyle = (book: Pick<SpineBook, 'weeks' | 'format'>) =>
  ({ '--s': spineUnits(book.weeks).toFixed(3), '--h': spineHeight(book.format) }) as CSSProperties;

export const spineName = (book: SpineBook) => `${book.title} by ${book.author}, ${book.weeks} ${book.weeks === 1 ? 'week' : 'weeks'} on the list`;

/** What is printed on a spine: the title down its length, the author if the
    book is thick enough, and the label with the number of weeks. */
export function SpineFace({ book }: { book: SpineBook }) {
  return (
    <>
      <span className="spine__title">{book.title}</span>
      <span className="spine__author">{book.author}</span>
      <span className="spine__label">{book.weeks}</span>
    </>
  );
}
