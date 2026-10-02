/* eslint-disable @next/next/no-img-element -- covers are hotlinked from the list's own image host */
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Shelf } from '@/components/Shelf';
import { stay } from '@/lib/catalogue';
import { getCatalogue } from '@/lib/data';
import { FAMILIES, FORMATS } from '@/lib/sections';
import { longDate, number, toShelfBook } from '@/lib/shelf-book';

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { sections } = await getCatalogue();
  return sections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = (await getCatalogue()).sections.find((entry) => entry.slug === slug);
  if (!section) return {};
  return {
    title: section.name,
    description: `${section.books.length} books from the ${section.name} list, shelved by the weeks each one stayed on it.`,
  };
}

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;
  const catalogue = await getCatalogue();
  const section = catalogue.sections.find((entry) => entry.slug === slug);
  if (!section) notFound();

  const longest = section.books[0];
  const most = longest.weeks;
  const byRank = [...section.books].sort((a, b) => a.rank - b.rank || b.weeks - a.weeks);

  return (
    <>
      <main id="main">
        <header className="section-head" data-family={section.family}>
          <div className="wrap section-head__in">
            <Link className="crumb sign" href="/#sections">
              ← All sections
            </Link>
            <p className="section-head__code">{section.code}</p>
            <h1>{section.name}</h1>
            <p>
              {section.books.length} books, {number(section.weeks)} weeks on this list between them. {FAMILIES[section.family].label}{section.format === 'series' ? '' : `, ${FORMATS[section.format].label.toLowerCase()}`}.
              The longest stay is {longest.title} at {number(longest.weeks)} weeks{longest.weeks >= 9 ? `, about ${stay(longest.weeks)}` : ''}.
            </p>
          </div>
        </header>

        <div className="wrap" style={{ paddingTop: '1.5rem' }}>
          <Shelf books={section.books.map(toShelfBook)} families={false} />
        </div>

        <section className="band" aria-labelledby="register-h">
          <div className="wrap">
            <div className="band-head">
              <h2 id="register-h">The register</h2>
              <p>Every book in this section in the order the list ranked it. Each row gives the position and the weeks as they stood on the day it was recorded.</p>
            </div>
            <table className="register">
              <thead>
                <tr className="sign">
                  <th scope="col">
                    <span className="sr-only">Cover</span>
                  </th>
                  <th scope="col">Book</th>
                  <th scope="col">Weeks on the list</th>
                  <th scope="col" className="c-mark">
                    Shelfmark
                  </th>
                  <th scope="col" className="c-date">
                    Recorded
                  </th>
                </tr>
              </thead>
              <tbody>
                {byRank.map((book) => (
                  <tr key={book.id} data-family={book.family}>
                    <td className="c-cover">{book.cover ? <img src={book.cover} width={book.coverWidth} height={book.coverHeight} alt="" loading="lazy" decoding="async" /> : null}</td>
                    <td className="c-title">
                      <Link className="link" href={`/books/${book.id}`}>
                        {book.title}
                      </Link>
                      <span>
                        {book.author}
                        {book.rank ? ` · No. ${book.rank} when recorded` : ''}
                      </span>
                    </td>
                    <td className="c-weeks">
                      <span className="typed">{number(book.weeks)}</span>
                      <span className="bar" style={{ '--share': (book.weeks / most).toFixed(4) } as CSSProperties} />
                    </td>
                    <td className="c-mark typed">{book.shelfmark}</td>
                    <td className="c-date typed">{book.recorded ? longDate(book.recorded) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer catalogue={catalogue} />
    </>
  );
}
