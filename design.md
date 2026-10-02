# Design: Shelfmark

Locked design system for the site. Read it before changing a page; amend this
file when the system needs to grow. Written 2026-10-02 for the rebuild of the
Book-Shelf course project on Next.js 16.

## The idea

A shelfmark is the mark on a book's spine that says where it stands in a
library. This site shelves bestsellers by one thing: **how long each book
stayed on its list**. Every book is drawn as a slab in a storage rack, and
the slab's shape is the data.

| What you see | What it means | Where it comes from |
| --- | --- | --- |
| Thickness | Weeks on the list | `weeks_on_list`, square-root scale |
| Height | Format | The list the book is on (hardcover tallest, audio shortest) |
| Lit bar and digits | Family of lists | Fiction, nonfiction, advice, children, young adult, graphic |
| Readout at the foot | The number of weeks | Printed on every slab |
| Cover beside the spine | The book itself | The list's own cover image, at its real proportion |
| Shelfmark | Section code, first three letters of the author's surname, weeks | `NON·P KOL 349` |

Thickness uses the square root of the weeks because the range is 1 to 906.
On a linear scale one children's series would be wider than the rack. The
key under the rack draws reference widths (1 week, 1 year, 5 years,
15 years), so the scale is never hidden.

## The look: an archive that shelves itself

Canberk asked for a futuristic site, and not the eighties palette of his
portfolio. So the bookshop became an automated archive: a dark room, a
storage rack, and status lights.

- The page is a dark instrument. It has no colour of its own except one
  system accent, a lime, used for controls and counts.
- A book is a slab: a deep tint of its family's hue, a lit bar across its
  head in the family's signal colour, a cut corner like a punched card, and
  a small readout with the weeks. Its cover stands beside it. The covers
  are the one place where outside colour comes in, and they are real.
- Light is drawn flat: a bar, a digit, a line. **Nothing glows, nothing
  blurs, nothing fades from one colour to another.** That is what keeps it
  from reading as generated neon.
- The rack and the readout panels are machines, so they stay dark when the
  room lights are switched on. Only the wall changes.

## Honesty

The data is the New York Times Best Sellers lists as served by the GoIT books
API. That API is a running log, not a clean weekly chart: lists hold records
from different weeks, some books appear twice, and two list names differ only
by the kind of apostrophe. So:

- Nothing says "this week". Every figure is "when recorded", with the date.
- Repeated records of a title are merged, keeping the latest one.
- A title that sits on several lists appears once on the main rack, in the
  section where it stayed longest, and its page links to the others.
- The footer says whether the page was read from the API or from the saved
  copy in `data/snapshot.json`, and when.
- Counts on the page are counted from the data at render time.
- Shop links have their affiliate tags removed. Nothing is sold here.

## Genre

technical / futurist. An instrument panel for a library.

## Colour

| Token | Night (default) | Day | Use |
| --- | --- | --- | --- |
| `--wall` | `oklch(0.155 0.012 255)` | `oklch(0.965 0.004 250)` | page ground |
| `--wall-2` | `oklch(0.205 0.014 255)` | `oklch(0.925 0.007 250)` | controls |
| `--ink` | `oklch(0.96 0.006 250)` | `oklch(0.2 0.016 255)` | text |
| `--ink-2` | `oklch(0.75 0.014 250)` | `oklch(0.42 0.016 255)` | secondary text |
| `--line` | `oklch(0.46 0.018 255)` | `oklch(0.45 0.016 255)` | rules |
| `--accent` | `oklch(0.88 0.2 128)` | `oklch(0.86 0.21 130)` | primary button, counts, current link |

Machines, the same in both themes: `--rack` `oklch(0.115 0.01 255)`,
`--rail` `oklch(0.3 0.018 255)`, `--panel` `oklch(0.2 0.014 255)` with
`--panel-ink` and `--panel-line`.

Signals, the same in both themes. `sig` is the light, `deep` the slab it
sits on. Slab text is `--panel-ink` on `deep`; a readout is `sig` on
`--rack`, or `--on-sig` on `sig` when the slab is in hand. All pass AA.

| Family | `sig` | `deep` |
| --- | --- | --- |
| Fiction | `oklch(0.74 0.19 25)` coral | `oklch(0.34 0.11 25)` |
| Nonfiction | `oklch(0.77 0.14 240)` azure | `oklch(0.33 0.1 252)` |
| Advice and business | `oklch(0.84 0.16 80)` amber | `oklch(0.36 0.07 75)` |
| Children | `oklch(0.87 0.2 130)` lime | `oklch(0.35 0.085 138)` |
| Young adult and series | `oklch(0.75 0.17 305)` violet | `oklch(0.34 0.11 300)` |
| Graphic | `oklch(0.85 0.13 195)` cyan | `oklch(0.34 0.065 205)` |

A signal appears only on things that belong to that family: a slab's bar and
readout, the light on a filter, a section's header bar, a level meter, the
rail under a cover, the bar on the readout panel of the book in hand. Every
colour in CSS is a token; the only gradient is the hard-stop one that draws
the rails.

## Type

- **Michroma** (display): headings, big figures, the wordmark. Wide and
  square-shouldered, the lettering of instrument panels. One weight.
- **Sofia Sans**: running text. **Sofia Sans Condensed**, its narrow cut,
  sets the titles on slabs, where a title has to fit a thin face.
- **JetBrains Mono** (classes `.sign` and `.typed`): labels, controls,
  shelfmarks, dates, figures.

Headings are roman. No italics in headings, no gradient text.

## Layout

- **Home**: headline and three counted readouts, then the rack with the book
  in hand on a readout panel beside it (pinned to the bottom on a phone),
  then the sections as a table with a level meter for each section's weeks.
- **Section**: a dark header under the family's light bar, the section's own
  rack, and the register (every book in rank order with its recorded date).
- **Book**: cover on a lit rail, the record panel, and the book's slab drawn
  beside the scale.
- **My shelf**: the books you added, at the same scale. Kept in the browser.

## Interaction

- A slab is a button. Picking one up shows it on the readout; it stays
  ejected and its readout lights up.
- The rack is one tab stop. Left and right arrows move along it, Home and
  End jump to the ends. The focus ring is drawn inside the slab because the
  cut corner would clip an outside one.
- Arrange by staying power, section or author; show one family or all.
- Stand them **face out** (the default: every book shows its cover beside
  its spine, as a shop does with the books it wants seen) or **spine out**
  (spines only, the whole collection in a few rows). The spine keeps its
  thickness either way, so the data is never traded for the picture.
- Arranging by section stands an outlined divider before each run.

## Motion

| Where | What | Why |
| --- | --- | --- |
| First load | the rack fills bay by bay (14 ms apart, first 40) | once, on arrival |
| Hover | a slab lifts 0.4rem | it can be picked up |
| Picked | the slab stays ejected 0.85rem, its readout inverts | state |
| Re-arranging | every slab slides to its new place (View Transitions) | shows where each book went |
| Buttons | press scales to 0.97 | feedback |

Easing is `cubic-bezier(0.23, 1, 0.32, 1)` for arrivals and
`cubic-bezier(0.77, 0, 0.175, 1)` for re-shelving. Under reduced motion
nothing moves. Browsers without View Transitions re-arrange instantly.

## Bans

Glow, blur, neon haze, gradients between colours, glass, scanlines, grid
floors, HUD corner brackets, typing effects, drop shadows, rounded cards,
emoji, stock imagery, invented ratings or reviews, "this week" claims, fake
browser or phone frames, italic headings.
