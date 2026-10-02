import type { ShelfBook } from '@/components/Shelf';
import type { Book } from './catalogue';
import { sectionBySlug } from './sections';

/** The slice of a book the bookcase needs in the browser. */
export function toShelfBook(book: Book): ShelfBook {
  const section = sectionBySlug(book.section)!;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    cover: book.cover,
    coverWidth: book.coverWidth,
    coverHeight: book.coverHeight,
    weeks: book.weeks,
    rank: book.rank,
    section: book.section,
    sectionName: section.name,
    sectionCode: section.code,
    family: book.family,
    format: book.format,
    shelfmark: book.shelfmark,
  };
}

export const number = (value: number) => value.toLocaleString('en-US');

export const longDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
