import { FORMATS, SECTIONS, sectionForList, type Family, type Format, type SectionDef } from './sections';

/* Turns the API's raw records into the catalogue the site shelves.

   The API is a running log, not a clean weekly chart: a list holds records
   captured in different weeks, the same book can appear twice, and two lists
   differ only by the kind of apostrophe in their name. So nothing here claims
   "this week". Every figure is "when last recorded", and the date is kept. */

export interface RawBook {
  _id: string;
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  book_image?: string;
  book_image_width?: number | string;
  book_image_height?: number | string;
  primary_isbn13?: string;
  rank?: number | string;
  rank_last_week?: number | string;
  weeks_on_list?: number | string;
  updated_date?: string;
  buy_links?: { name: string; url: string }[];
}

export type RawLists = Record<string, RawBook[]>;

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  isbn: string;
  /** Position on the list when the record was captured. */
  rank: number;
  /** Position the week before that, or 0 if it was not on the list. */
  lastRank: number;
  /** Weeks on the list when the record was captured. This is the spine's thickness. */
  weeks: number;
  /** ISO date the record was captured. */
  recorded: string;
  section: string;
  family: Family;
  format: Format;
  shelfmark: string;
  links: { name: string; url: string }[];
}

export interface Section extends SectionDef {
  books: Book[];
  weeks: number;
}

export interface Catalogue {
  source: 'live' | 'snapshot';
  /** When the data was read from the API (live) or saved (snapshot). */
  read: string;
  sections: Section[];
  /** Every title once, in the section where it stayed longest. */
  books: Book[];
  totalWeeks: number;
  longest: Book;
  recordedFrom: string;
  recordedTo: string;
}

const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'vs', 'with']);

const ROMAN = /^(ii|iii|iv|vi|vii|viii|ix|xi|xii)$/;

/** The API shouts every title in capitals. Set it the way a title page would. */
export function titleCase(shout: string): string {
  const words = shout.trim().toLowerCase().split(/\s+/);
  return words
    .map((word, i) => {
      const afterBreak = i > 0 && /[:.!?]$/.test(words[i - 1]);
      if (i > 0 && i < words.length - 1 && !afterBreak && SMALL.has(word)) return word;
      // initials and numerals keep their capitals: "J.F.K.", "Volume II"
      if (/^([a-z]\.){2,}$/.test(word) || ROMAN.test(word.replace(/[:.,]$/, ''))) return word.toUpperCase();
      // the first letter (past any opening quote), and the letter after a hyphen
      return word
        .replace(/^(["'(‘“]*)([a-z])/, (_, lead: string, letter: string) => lead + letter.toUpperCase())
        .replace(/-([a-z])/g, (_, letter: string) => '-' + letter.toUpperCase());
    })
    .join(' ');
}

/** The first three letters of the first author's surname, as on a spine label. */
function cutter(author: string): string {
  const first = author.split(/,| and | with /i)[0].trim();
  const surname = first.split(/\s+/).filter((part) => !/^(jr|sr|ii|iii|iv)\.?$/i.test(part)).pop() ?? first;
  const letters = surname.normalize('NFD').replace(/[^A-Za-z]/g, '');
  return (letters || 'XXX').slice(0, 3).toUpperCase();
}

const STORES = ['Amazon', 'Apple Books', 'Bookshop.org', 'Barnes and Noble', 'Barnes & Noble'];

/** Keep the bookshops, drop the affiliate tags the links arrive with. */
function storeLinks(links: RawBook['buy_links']): Book['links'] {
  const out: Book['links'] = [];
  for (const link of links ?? []) {
    if (!STORES.includes(link.name) || !link.url) continue;
    const name = link.name === 'Barnes and Noble' ? 'Barnes & Noble' : link.name;
    if (out.some((kept) => kept.name === name)) continue;
    let url = link.url;
    try {
      const parsed = new URL(link.url);
      for (const key of ['tag', 'at', 'aid', 'ct']) parsed.searchParams.delete(key);
      url = parsed.toString();
    } catch {
      continue;
    }
    out.push({ name, url });
  }
  return out;
}

const num = (value: unknown) => Math.max(0, Math.round(Number(value) || 0));
const stamp = (value?: string) => (value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString().slice(0, 10) : '');

function toBook(raw: RawBook, section: SectionDef): Book {
  const weeks = Math.max(1, num(raw.weeks_on_list));
  return {
    id: raw._id,
    title: titleCase(raw.title),
    author: raw.author.trim(),
    publisher: (raw.publisher ?? '').trim(),
    description: (raw.description ?? '').trim(),
    cover: raw.book_image ?? '',
    coverWidth: num(raw.book_image_width) || 330,
    coverHeight: num(raw.book_image_height) || 500,
    isbn: (raw.primary_isbn13 ?? '').trim(),
    rank: num(raw.rank),
    lastRank: num(raw.rank_last_week),
    weeks,
    recorded: stamp(raw.updated_date),
    section: section.slug,
    family: section.family,
    format: section.format,
    shelfmark: `${section.code} ${cutter(raw.author)} ${String(weeks).padStart(3, '0')}`,
    links: storeLinks(raw.buy_links),
  };
}

const sameTitle = (book: Book) => `${book.title}|${book.author}`.toLowerCase();

export function buildCatalogue(lists: RawLists, source: Catalogue['source'], read: string): Catalogue {
  const bySection = new Map<string, Map<string, Book>>();

  for (const [listName, rows] of Object.entries(lists)) {
    const section = sectionForList(listName);
    if (!section || !Array.isArray(rows)) continue;
    const shelf = bySection.get(section.slug) ?? new Map<string, Book>();
    for (const raw of rows) {
      if (!raw?._id || !raw.title || !raw.author) continue;
      const book = toBook(raw, section);
      // The same title recorded in several weeks: keep the latest record.
      // (Not keyed by ISBN: a series is listed under its newest volume, so
      // its ISBN changes from one record to the next.)
      const key = sameTitle(book);
      const kept = shelf.get(key);
      if (!kept || book.recorded > kept.recorded || (book.recorded === kept.recorded && book.weeks > kept.weeks)) {
        shelf.set(key, book);
      }
    }
    bySection.set(section.slug, shelf);
  }

  const sections: Section[] = SECTIONS.flatMap((def) => {
    const books = [...(bySection.get(def.slug)?.values() ?? [])].sort((a, b) => b.weeks - a.weeks || a.title.localeCompare(b.title));
    return books.length ? [{ ...def, books, weeks: books.reduce((sum, book) => sum + book.weeks, 0) }] : [];
  });

  // A title that sits on several lists appears once on the main shelf,
  // in the section where it stayed longest.
  const once = new Map<string, Book>();
  for (const section of sections) {
    for (const book of section.books) {
      const kept = once.get(sameTitle(book));
      if (!kept || book.weeks > kept.weeks) once.set(sameTitle(book), book);
    }
  }
  const books = [...once.values()].sort((a, b) => b.weeks - a.weeks || a.title.localeCompare(b.title));
  const dates = books.map((book) => book.recorded).filter(Boolean).sort();

  return {
    source,
    read,
    sections,
    books,
    totalWeeks: books.reduce((sum, book) => sum + book.weeks, 0),
    longest: books[0],
    recordedFrom: dates[0] ?? '',
    recordedTo: dates[dates.length - 1] ?? '',
  };
}

/* ---------- The spine scale ---------- */

/** Thickness grows with the square root of the weeks, so a book that stayed
    seventeen years is about thirty times as thick as one that stayed a week,
    not nine hundred times. The legend on the page shows the scale. */
export const spineUnits = (weeks: number) => Math.sqrt(Math.max(1, weeks));

export const spineHeight = (format: Format) => FORMATS[format].height;

/** "3 years" for 157 weeks, "5 months" for 22, "1 week" for 1. */
export function stay(weeks: number): string {
  if (weeks >= 52) {
    const years = weeks / 52;
    const rounded = years >= 10 ? Math.round(years) : Math.round(years * 2) / 2;
    return `${rounded} ${rounded === 1 ? 'year' : 'years'}`;
  }
  if (weeks >= 9) {
    const months = Math.round(weeks / 4.345);
    return `${months} months`;
  }
  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
}
