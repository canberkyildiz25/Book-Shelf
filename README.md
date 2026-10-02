# Shelfmark

An automated archive of New York Times bestsellers where **the thickness of
each slab is the number of weeks the book stayed on its list**. Height is the
format, the lit bar is the family of lists.

Live: https://book-shelf-brown.vercel.app

This is a rebuild of Book-Shelf, a course project that listed bestsellers by
category. The first version is in the repository's history.

## What it does

- Draws every book as a slab in a storage rack. Arrange by staying power, section
  or author; show one family of lists or all of them.
- One page per section, with its own shelf and a register in rank order.
- One page per book: a catalogue card, the figures as recorded, and the
  book's spine drawn beside the scale.
- "My shelf": add books and see them stand at the same scale. Saved in the
  browser, no account.
- Dark by default with a light switch, keyboard control of the rack (arrow
  keys), reduced motion respected.

## Data

Books come from the GoIT books API, which serves the New York Times Best
Sellers lists. The API is a running log rather than a weekly chart, so
`lib/catalogue.ts` merges duplicate records, joins lists whose names differ
only by an apostrophe, and keeps the date each figure was recorded.

Pages are static and re-read the API at most once a day. If the API does not
answer, the site falls back to `data/snapshot.json` and says so in the footer.

```bash
npm run snapshot              # refresh data/snapshot.json from the API
SHELFMARK_SNAPSHOT=1 npm run dev   # work from the snapshot, without the API
```

## Stack

Next.js 16 (App Router, static generation with daily revalidation), React 19,
TypeScript, Tailwind CSS 4, Zustand for the saved shelf. No UI library. The
re-shelving animation uses the browser's View Transitions.

| Path | What it is |
| --- | --- |
| `lib/sections.ts` | The shelving scheme: sections, families, formats |
| `lib/catalogue.ts` | Raw API records to a clean catalogue; the spine scale |
| `lib/data.ts` | Live read with the snapshot as fallback |
| `components/Shelf.tsx` | The bookcase: selection, arranging, filtering |
| `design.md` | The design system and its rules |

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

A concept project by Canberk Yıldız. Nothing is sold here.
