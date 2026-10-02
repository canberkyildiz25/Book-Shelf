import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Shelf } from '@/components/Shelf';
import { stay } from '@/lib/catalogue';
import { getCatalogue } from '@/lib/data';
import { number, toShelfBook } from '@/lib/shelf-book';

export const revalidate = 86400;

export default async function Home() {
  const catalogue = await getCatalogue();
  const { books, sections, longest, totalWeeks } = catalogue;
  const widest = Math.max(...sections.map((section) => section.weeks));

  return (
    <>
      <main id="main">
        <section className="hero wrap">
          <h1>Bestsellers, shelved by staying power.</h1>
          <div className="hero__row">
            <p className="hero__lede">
              Every spine below is a book from the New York Times Best Sellers lists. The thicker it is, the longer it stayed. {longest.title} had been there for{' '}
              {number(longest.weeks)} weeks when it was last recorded, about {stay(longest.weeks)}.
            </p>
            <dl className="facts">
              <div>
                <dt className="sign">Books</dt>
                <dd>{number(books.length)}</dd>
              </div>
              <div>
                <dt className="sign">Sections</dt>
                <dd>{sections.length}</dd>
              </div>
              <div>
                <dt className="sign">Weeks on the lists</dt>
                <dd>{number(totalWeeks)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="wrap">
          <Shelf books={books.map(toShelfBook)} />
        </div>

        <section className="band" id="sections" aria-labelledby="sections-h">
          <div className="wrap">
            <div className="band-head">
              <h2 id="sections-h">The sections</h2>
              <p>
                One section for each list. The bar is the weeks its books have spent on that list between them; a book counted here may also stand in another section.
              </p>
            </div>
            <table className="index">
              <thead>
                <tr className="sign">
                  <th scope="col">Mark</th>
                  <th scope="col">Section</th>
                  <th scope="col" className="c-num">
                    Books
                  </th>
                  <th scope="col" className="c-num">
                    Weeks
                  </th>
                  <th scope="col">
                    <span className="sr-only">Weeks, drawn</span>
                  </th>
                  <th scope="col" className="c-long">
                    Longest stay
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.slug} data-family={section.family}>
                    <td className="c-code typed">
                      <span>
                        <span className="swatch" aria-hidden="true" />
                        {section.code}
                      </span>
                    </td>
                    <td className="c-name">
                      <Link className="link" href={`/sections/${section.slug}`}>
                        {section.name}
                      </Link>
                    </td>
                    <td className="c-num c-books typed">{section.books.length}</td>
                    <td className="c-num c-weeks typed">{number(section.weeks)}</td>
                    <td className="c-bar">
                      <span className="bar" style={{ '--share': (section.weeks / widest).toFixed(4) } as CSSProperties} />
                    </td>
                    <td className="c-long">
                      {section.books[0].title}, {number(section.books[0].weeks)}
                    </td>
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
