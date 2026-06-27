// ─────────────────────────────────────────────
// seed.js — Fetch cyberpunk images from Unsplash
//           and populate the SQLite database
// ─────────────────────────────────────────────
// Run once (or anytime you want fresh data):
//   npm run seed
//
// Requires UNSPLASH_ACCESS_KEY in your .env file.
// Free tier: 50 requests/hour, 50 photos per request.

import 'dotenv/config';
import db from './db.js';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY || ACCESS_KEY === 'your_unsplash_access_key_here') {
  console.error('❌  Missing UNSPLASH_ACCESS_KEY in .env');
  console.error('    1. Go to https://unsplash.com/developers');
  console.error('    2. Create a new application');
  console.error('    3. Copy your Access Key into .env');
  process.exit(1);
}

// Search terms → gallery categories
// Each entry fetches one page of results from Unsplash
const SEARCHES = [
  { query: 'cyberpunk city neon',   category: 'wallpaper',  pages: 2 },
  { query: 'neon lights dystopia',  category: 'wallpaper',  pages: 1 },
  { query: 'cyberpunk concept art', category: 'concept',    pages: 2 },
  { query: 'sci-fi futuristic city',category: 'concept',    pages: 1 },
  { query: 'cyberpunk portrait',    category: 'fanart',     pages: 1 },
  { query: 'neon rain street',      category: 'screenshot', pages: 1 },
];

// Prepared INSERT statement — positional ? params (node:sqlite style)
// OR IGNORE skips photos we already have (prevents duplicates on re-seed)
const insert = db.prepare(`
  INSERT OR IGNORE INTO gallery
    (unsplash_id, title, category, url_full, url_regular, url_small, author, author_url, description, width, height)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

async function fetchPage(query, category, page = 1) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '30');
  url.searchParams.set('page', String(page));
  url.searchParams.set('orientation', 'landscape');

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
  });

  if (!res.ok) {
    console.error(`  ❌  Unsplash error ${res.status}: ${await res.text()}`);
    return [];
  }

  const data = await res.json();
  return data.results || [];
}

async function seed() {
  console.log('🌱  Seeding database from Unsplash...\n');
  let total = 0;

  for (const { query, category, pages } of SEARCHES) {
    console.log(`  🔍  Searching: "${query}" → category: ${category}`);

    for (let page = 1; page <= pages; page++) {
      const photos = await fetchPage(query, category, page);

          // Insert all photos in a transaction (faster than one-by-one)
      db.exec('BEGIN');
      try {
        for (const photo of photos) {
          insert.run(
            photo.id,
            photo.alt_description || photo.description || query,
            category,
            photo.urls.full,
            photo.urls.regular,
            photo.urls.small,
            photo.user.name,
            photo.user.links.html,
            photo.description || '',
            photo.width,
            photo.height,
          );
        }
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
      total += photos.length;
      console.log(`     Page ${page}: ${photos.length} photos fetched`);

      // Respect Unsplash rate limits — wait 500ms between requests
      if (page < pages) await new Promise(r => setTimeout(r, 500));
    }
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM gallery').get({});
  console.log(`\n✅  Done! ${total} photos processed, ${count.count} total in database.\n`);
}

seed().catch(console.error);
