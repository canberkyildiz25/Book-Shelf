import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { MyShelf } from '@/components/MyShelf';
import { getCatalogue } from '@/lib/data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'My shelf',
  description: 'The books you picked, standing at the same scale as the main shelf. Kept in this browser.',
};

export default async function MyShelfPage() {
  const catalogue = await getCatalogue();
  return (
    <>
      <main id="main" className="mine wrap">
        <h1>My shelf</h1>
        <p className="mine__lede">The books you added, at the same scale as the main shelf. They are kept in this browser and nowhere else; there is no account.</p>
        <MyShelf />
      </main>
      <Footer catalogue={catalogue} />
    </>
  );
}
