'use client';

import { useHydrated, useShelf, type SavedBook } from '@/lib/store';

/** Puts a book on your shelf, or takes it off. */
export function SaveButton({ book, plain = false }: { book: SavedBook; plain?: boolean }) {
  const hydrated = useHydrated();
  const saved = useShelf((state) => state.saved.some((entry) => entry.id === book.id));
  const toggle = useShelf((state) => state.toggle);
  const on = hydrated && saved;

  return (
    <button type="button" className={plain || on ? 'btn btn--plain' : 'btn'} aria-pressed={on} onClick={() => toggle(book)}>
      {on ? 'On my shelf' : 'Add to my shelf'}
    </button>
  );
}
