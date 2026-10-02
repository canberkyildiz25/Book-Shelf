/* The shelving scheme. Every bestseller list the API knows is a section of
   the shop. A section belongs to a family (which gives a spine its cloth
   colour) and has a format (which gives a spine its height). */

export type Family = 'fiction' | 'nonfiction' | 'advice' | 'children' | 'young' | 'graphic';
export type Format = 'hardcover' | 'combined' | 'series' | 'paperback' | 'graphic' | 'picture' | 'audio';

export interface SectionDef {
  /** The list's name as the API spells it, with straight apostrophes. */
  name: string;
  slug: string;
  /** The class part of a shelfmark, as it would be typed on a spine label. */
  code: string;
  family: Family;
  format: Format;
}

export const FAMILIES: Record<Family, { label: string }> = {
  fiction: { label: 'Fiction' },
  nonfiction: { label: 'Nonfiction' },
  advice: { label: 'Advice and business' },
  children: { label: 'Children' },
  young: { label: 'Young adult and series' },
  graphic: { label: 'Graphic' },
};

export const FAMILY_ORDER: Family[] = ['fiction', 'nonfiction', 'advice', 'children', 'young', 'graphic'];

/** `height` is the share of the shelf's clear height a spine of this format takes. */
export const FORMATS: Record<Format, { label: string; height: number }> = {
  hardcover: { label: 'Hardcover', height: 1 },
  combined: { label: 'Print and e-book', height: 0.95 },
  series: { label: 'Series', height: 0.92 },
  paperback: { label: 'Paperback', height: 0.86 },
  graphic: { label: 'Graphic', height: 0.82 },
  picture: { label: 'Picture book', height: 0.74 },
  audio: { label: 'Audio', height: 0.66 },
};

export const SECTIONS: SectionDef[] = [
  { name: 'Hardcover Fiction', slug: 'hardcover-fiction', code: 'FIC·H', family: 'fiction', format: 'hardcover' },
  { name: 'Paperback Trade Fiction', slug: 'paperback-fiction', code: 'FIC·P', family: 'fiction', format: 'paperback' },
  { name: 'Combined Print & E-Book Fiction', slug: 'print-and-e-book-fiction', code: 'FIC·C', family: 'fiction', format: 'combined' },
  { name: 'Audio Fiction', slug: 'audio-fiction', code: 'FIC·A', family: 'fiction', format: 'audio' },
  { name: 'Hardcover Nonfiction', slug: 'hardcover-nonfiction', code: 'NON·H', family: 'nonfiction', format: 'hardcover' },
  { name: 'Paperback Nonfiction', slug: 'paperback-nonfiction', code: 'NON·P', family: 'nonfiction', format: 'paperback' },
  { name: 'Combined Print & E-Book Nonfiction', slug: 'print-and-e-book-nonfiction', code: 'NON·C', family: 'nonfiction', format: 'combined' },
  { name: 'Audio Nonfiction', slug: 'audio-nonfiction', code: 'NON·A', family: 'nonfiction', format: 'audio' },
  { name: 'Advice, How-To & Miscellaneous', slug: 'advice-and-how-to', code: 'ADV·H', family: 'advice', format: 'hardcover' },
  { name: 'Business', slug: 'business', code: 'BUS', family: 'advice', format: 'hardcover' },
  { name: 'Audio Advice, How-To & Misc', slug: 'audio-advice', code: 'ADV·A', family: 'advice', format: 'audio' },
  { name: "Children's Middle Grade Hardcover", slug: 'middle-grade-hardcover', code: 'MID·H', family: 'children', format: 'hardcover' },
  { name: 'Middle Grade Paperback', slug: 'middle-grade-paperback', code: 'MID·P', family: 'children', format: 'paperback' },
  { name: "Children's Picture Books", slug: 'picture-books', code: 'PIC', family: 'children', format: 'picture' },
  { name: "Audio Children's", slug: 'audio-children', code: 'CHI·A', family: 'children', format: 'audio' },
  { name: "Children's & Young Adult Series", slug: 'series', code: 'SER', family: 'young', format: 'series' },
  { name: 'Young Adult Hardcover', slug: 'young-adult-hardcover', code: 'YA·H', family: 'young', format: 'hardcover' },
  { name: 'Young Adult Paperback', slug: 'young-adult-paperback', code: 'YA·P', family: 'young', format: 'paperback' },
  { name: 'Graphic Books and Manga', slug: 'graphic-and-manga', code: 'GRA', family: 'graphic', format: 'graphic' },
];

/** The API spells some list names with a curly apostrophe and some with a straight one. */
export const plainName = (name: string) => name.replace(/[‘’]/g, "'").trim();

const BY_NAME = new Map(SECTIONS.map((section) => [section.name, section]));
export const sectionForList = (listName: string) => BY_NAME.get(plainName(listName));
export const sectionBySlug = (slug: string) => SECTIONS.find((section) => section.slug === slug);
