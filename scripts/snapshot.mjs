/* Saves the books API's current answer to data/snapshot.json.

   The site reads the API live and refreshes once a day. This file is what it
   falls back to when the API does not answer, and what a build uses if the
   API is down at that moment. Run `npm run snapshot` to refresh it. */
import fs from 'node:fs';

const API = 'https://books-backend.p.goit.global/books';

// Only the fields the site reads; the API returns about forty per record.
const KEEP = [
  '_id',
  'title',
  'author',
  'publisher',
  'description',
  'book_image',
  'book_image_width',
  'book_image_height',
  'primary_isbn13',
  'rank',
  'rank_last_week',
  'weeks_on_list',
  'updated_date',
  'buy_links',
];

const get = async (path) => {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
};

const names = (await get('/category-list')).map((entry) => entry.list_name).filter((name) => name.trim());

const lists = {};
for (const name of names) {
  const rows = await get(`/category?category=${encodeURIComponent(name)}`);
  lists[name] = rows.map((row) => Object.fromEntries(KEEP.map((key) => [key, row[key]])));
  console.log(String(rows.length).padStart(3), name);
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/snapshot.json', JSON.stringify({ taken: new Date().toISOString(), lists }, null, 1) + '\n');
console.log(`\nwrote data/snapshot.json (${Object.keys(lists).length} lists)`);
