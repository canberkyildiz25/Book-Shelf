'use client';

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Family, Format } from './sections';

/** What a saved book needs to stand on your shelf without asking the API again. */
export interface SavedBook {
  id: string;
  title: string;
  author: string;
  weeks: number;
  family: Family;
  format: Format;
  shelfmark: string;
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
}

interface ShelfState {
  saved: SavedBook[];
  toggle: (book: SavedBook) => void;
  remove: (id: string) => void;
}

export const useShelf = create<ShelfState>()(
  persist(
    (set) => ({
      saved: [],
      toggle: (book) =>
        set((state) => ({
          saved: state.saved.some((entry) => entry.id === book.id)
            ? state.saved.filter((entry) => entry.id !== book.id)
            : [...state.saved, book],
        })),
      remove: (id) => set((state) => ({ saved: state.saved.filter((entry) => entry.id !== id) })),
    }),
    { name: 'shelfmark-my-shelf', version: 1 },
  ),
);

const noop = () => () => {};

/** False on the server and during hydration, true afterwards. The saved list
    lives in the browser, so anything that shows it waits for this. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
