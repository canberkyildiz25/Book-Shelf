/* eslint-disable @next/next/no-img-element -- covers are hotlinked from the list's own image host */
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { SaveButton } from '@/components/SaveButton';
import { BookFace, spineName, spineStyle } from '@/components/Spine';
import { stay } from '@/lib/catalogue';
import { findBook, getCatalogue } from '@/lib/data';
import { FAMILIES, FORMATS } from '@/lib/sections';
import { longDate, number } from '@/lib/shelf-book';

export const revalidate = 86400;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { sections } = await getCatalogue();
  return sections.flatMap((section) => section.books.map((book) => ({ id: book.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await findBook(id);
  if (!found) return {};
  const { book } = found;
  return {
    title: `${book.title} by ${book.author}`,
    description: `${book.title} spent ${book.weeks} ${book.weeks === 1 ? 'week' : 'weeks'} on the ${found.section.name} list. ${book.description}`.trim(),
  };
}

const SCALE: [number, string][] = [
  [1, '1 week'],
  [52, '1 year'],
  [260, '5 years'],
];

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const found = await findBook(id);
  if (!found) notFound();
  const { catalogue, section, book } = found;

  // The same title standing in other sections, with its own figures there.
  const elsewhere = catalogue.sections.flatMap((other) =>
    other.slug === section.slug
      ? []
      : other.books.filter((entry) => entry.title === book.title && entry.author === book.author).map((entry) => ({ section: other, book: entry })),
  );
  const place = section.books.findIndex((entry) => entry.id === book.id) + 1;

  return (
    <>
      <main id="main" className="book wrap" data-family={book.family}>
        <Link className="crumb sign" href={`/sections/${section.slug}`}>
          ← {section.name}
        </Link>

        <div className="book__grid">
          {book.cover ? (
            <div className="book__cover">
              <img src={book.cover} width={book.coverWidth} height={book.coverHeight} alt={`Cover of ${book.title}`} fetchPriority="high" />
            </div>
          ) : (
            <span />
          )}

          <div>
            <article className="card on-card">
              <p className="typed card__mark">{book.shelfmark}</p>
              <h1>{book.title}</h1>
              <p className="book__author">{book.author}</p>
              {book.description ? <p className="book__desc">{book.description}</p> : null}

              <dl className="book__facts">
                <div>
                  <dt className="sign">Section</dt>
                  <dd>
                    <Link className="link" href={`/sections/${section.slug}`}>
                      {section.name}
                    </Link>
                    , {FAMILIES[section.family].label.toLowerCase()}
                    {section.format === 'series' ? '' : `, ${FORMATS[section.format].label.toLowerCase()}`}
                  </dd>
                </div>
                <div>
                  <dt className="sign">On the list</dt>
                  <dd>
                    {number(book.weeks)} {book.weeks === 1 ? 'week' : 'weeks'}
                    {book.recorded ? `, recorded ${longDate(book.recorded)}` : ''}
                  </dd>
                </div>
                {book.rank ? (
                  <div>
                    <dt className="sign">Position</dt>
                    <dd>
                      No. {book.rank} that week
                      {book.lastRank ? `, No. ${book.lastRank} the week before` : book.weeks > 1 ? ', back on the list after a gap' : ', new to the list'}
                    </dd>
                  </div>
                ) : null}
                {book.publisher ? (
                  <div>
                    <dt className="sign">Publisher</dt>
                    <dd>{book.publisher}</dd>
                  </div>
                ) : null}
                {book.isbn ? (
                  <div>
                    <dt className="sign">ISBN</dt>
                    <dd className="typed">{book.isbn}</dd>
                  </div>
                ) : null}
                {elsewhere.length ? (
                  <div>
                    <dt className="sign">Also shelved</dt>
                    <dd>
                      {elsewhere.map(({ section: other, book: entry }, i) => (
                        <span key={entry.id}>
                          {i ? ', ' : ''}
                          <Link className="link" href={`/books/${entry.id}`}>
                            {other.name}
                          </Link>{' '}
                          ({number(entry.weeks)})
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="book__actions">
                <SaveButton
                  book={{
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    weeks: book.weeks,
                    family: book.family,
                    format: book.format,
                    shelfmark: book.shelfmark,
                    cover: book.cover,
                    coverWidth: book.coverWidth,
                    coverHeight: book.coverHeight,
                  }}
                />
              </div>
              {book.links.length ? (
                <p className="book__stores">
                  {book.links.map((link) => (
                    <a key={link.name} className="link" href={link.url} target="_blank" rel="noopener noreferrer">
                      Find it at {link.name} ↗
                    </a>
                  ))}
                </p>
              ) : null}
            </article>

            <section className="power" aria-labelledby="power-h">
              <h2 id="power-h" className="sign">
                Staying power
              </h2>
              <p className="power__num">
                {number(book.weeks)} <small>{book.weeks === 1 ? 'week' : 'weeks'}</small>
              </p>
              <p>
                {book.weeks >= 9 ? `About ${stay(book.weeks)} on the list. ` : ''}
                {place === 1
                  ? `The longest stay in ${section.name}.`
                  : `Number ${place} of ${section.books.length} in ${section.name} by length of stay.`}{' '}
                Its spine, beside the scale:
              </p>
              <div className="power__row">
                <span className="vol" data-family={book.family} data-format={book.format} style={spineStyle(book)} role="img" aria-label={spineName(book)}>
                  <BookFace book={book} faceOut={false} />
                </span>
                {SCALE.map(([weeks, label]) => (
                  <div key={label} className="power__ref" aria-hidden="true">
                    <i style={{ '--s': Math.sqrt(weeks).toFixed(3) } as CSSProperties} />
                    <span className="typed">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer catalogue={catalogue} />
    </>
  );
}
