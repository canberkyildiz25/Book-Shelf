import type { Catalogue } from '@/lib/catalogue';

const longDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';

/** Says where the numbers come from and how fresh they are. */
export function Footer({ catalogue }: { catalogue: Catalogue }) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <div>
          <p>
            The books and their figures come from the New York Times Best Sellers lists, as served by the GoIT books API. Each figure is the one recorded on the date
            shown with the book, between {longDate(catalogue.recordedFrom)} and {longDate(catalogue.recordedTo)}; this is not a live weekly chart.
          </p>
          <p className="typed" style={{ marginTop: '0.6rem' }}>
            {catalogue.source === 'live' ? 'Read from the API' : 'Shown from the saved copy'} on {longDate(catalogue.read)}.
          </p>
        </div>
        <div>
          <p>A concept project by Canberk Yıldız. Nothing is sold here.</p>
          <a className="link" href="https://github.com/canberkyildiz25/Book-Shelf" target="_blank" rel="noopener noreferrer">
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
