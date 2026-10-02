import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Michroma, Sofia_Sans, Sofia_Sans_Condensed } from 'next/font/google';
import type { ReactNode } from 'react';
import { Header } from '@/components/Chrome';
import './globals.css';

// Michroma is the display face: wide, square-shouldered, the lettering of
// instrument panels. Sofia Sans sets the text, and its condensed cut the
// slabs, where a title has to fit a narrow face. JetBrains Mono is the readout.
const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma', display: 'swap' });
const sofia = Sofia_Sans({ subsets: ['latin'], variable: '--font-sofia', display: 'swap' });
const sofiaNarrow = Sofia_Sans_Condensed({ subsets: ['latin'], variable: '--font-sofia-narrow', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const SITE = 'https://book-shelf-brown.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1017',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Shelfmark · Bestsellers, shelved by staying power', template: '%s · Shelfmark' },
  description:
    'A bookshelf of New York Times bestsellers where the thickness of each spine is the number of weeks the book stayed on its list.',
  authors: [{ name: 'Canberk Yıldız', url: 'https://canberkyildiz.netlify.app' }],
  openGraph: {
    type: 'website',
    siteName: 'Shelfmark',
    title: 'Shelfmark · Bestsellers, shelved by staying power',
    description: 'The thicker the spine, the longer the book stayed on the bestseller list.',
    url: SITE,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'A shelf of book spines of different thickness' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
};

/* Runs before first paint. The archive is dark unless the visitor has
   switched the lights on before. */
const BOOT = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}document.documentElement.dataset.theme=t==='light'?'light':'dark'})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${sofia.variable} ${sofiaNarrow.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <a className="skip-link sign" href="#main">
          Skip to the shelf
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
