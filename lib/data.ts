import 'server-only';
import { cache } from 'react';
import snapshot from '@/data/snapshot.json';
import { buildCatalogue, type Catalogue, type RawBook, type RawLists } from './catalogue';

const API = 'https://books-backend.p.goit.global/books';
/** Pages re-read the API at most once a day. */
export const REFRESH = 60 * 60 * 24;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { next: { revalidate: REFRESH }, signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`books API ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

async function readLive(): Promise<RawLists> {
  const names = (await get<{ list_name: string }[]>('/category-list')).map((entry) => entry.list_name).filter((name) => name.trim());
  const rows = await Promise.all(names.map((name) => get<RawBook[]>(`/category?category=${encodeURIComponent(name)}`)));
  return Object.fromEntries(names.map((name, i) => [name, rows[i]]));
}

/** The catalogue for this request: live if the API answers with a plausible
    amount of data, otherwise the snapshot saved in the repository. */
export const getCatalogue = cache(async (): Promise<Catalogue> => {
  // SHELFMARK_SNAPSHOT=1 skips the API: for working offline and for testing the fallback.
  if (process.env.SHELFMARK_SNAPSHOT === '1') return buildCatalogue(snapshot.lists as RawLists, 'snapshot', snapshot.taken);
  try {
    const live = buildCatalogue(await readLive(), 'live', new Date().toISOString());
    if (live.books.length >= 40) return live;
  } catch {
    // fall through to the snapshot
  }
  return buildCatalogue(snapshot.lists as RawLists, 'snapshot', snapshot.taken);
});

export async function findBook(id: string) {
  const catalogue = await getCatalogue();
  for (const section of catalogue.sections) {
    const book = section.books.find((entry) => entry.id === id);
    if (book) return { catalogue, section, book };
  }
  return null;
}
