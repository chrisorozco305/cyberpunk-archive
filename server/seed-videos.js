// ─────────────────────────────────────────────
// seed-videos.js — Seed the videos table
// ─────────────────────────────────────────────
// Run with: npm run seed:videos
// Inserts all Cyberpunk 2077 playlist videos into SQLite.
// Safe to re-run — OR IGNORE skips duplicates.

import db from './db.js';

const VIDEOS = [
  { youtube_id: 'BnnbP7pCIvQ', title: 'Cyberpunk: Edgerunners — Ending Theme | Let You Down by Dawid Podsiadło', category: 'Soundtrack' },
  { youtube_id: '43d0Jq1XKXI', title: 'Cyberpunk: Edgerunners | Opening Credits: "This Fffire" — Franz Ferdinand',  category: 'Soundtrack' },
  { youtube_id: 'gzbLODUb1sA', title: 'I Really Want to Stay at Your House — Rosa Walton & Hallie Coggins',         category: 'Soundtrack' },
  { youtube_id: 'jLXTBbMRxK8', title: "Who's Ready for Tomorrow — Rat Boy & IBDY",                                  category: 'Soundtrack' },
  { youtube_id: 'Ld37nwZz1RQ', title: 'Night City — R E L & Artemis Delta',                                         category: 'Soundtrack' },
  { youtube_id: 'vMIf7DKzWEM', title: "Kerry Eurodyne — Chippin' In 2022",                                          category: 'Soundtrack' },
  { youtube_id: 'SfDxpP2iGvU', title: 'Pain — Le Destroy & The Red Glare',                                          category: 'Soundtrack' },
  { youtube_id: 'mwIHSMMhGYk', title: 'Suffer Me — The Cold Stares & Brutus Backlash',                              category: 'Soundtrack' },
  { youtube_id: 'x16o7d6vjXI', title: 'So It Goes — Fingers and the Outlaws (Radio Morro)',                         category: 'Soundtrack' },
  { youtube_id: 'KTJQiGRQS8Q', title: 'Delicate Weapon',                                                            category: 'Soundtrack' },
  { youtube_id: 'eLg01e2Je_0', title: 'The Ballad of Buck Ravers',                                                  category: 'Soundtrack' },
  { youtube_id: 'xuxWlWkxLDQ', title: 'Johnny Silverhand Theme — Cello/Violin Version',                             category: 'Soundtrack' },
  { youtube_id: 'mrZC1Jcw0dw', title: 'Grimes — 4ÆM',                                                              category: 'Soundtrack' },
  { youtube_id: 'FpgKU6yijak', title: 'Heave Ho — Konrad OldMoney feat. Frawst & XerzeX',                          category: 'Soundtrack' },
  { youtube_id: 'FV3_G3NDCPg', title: 'Friday Night Fire Fight — Aligns & Rubicones',                               category: 'Soundtrack' },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO videos (youtube_id, title, category)
  VALUES (?, ?, ?)
`);

db.exec('BEGIN');
for (const v of VIDEOS) {
  insert.run(v.youtube_id, v.title, v.category);
}
db.exec('COMMIT');

const count = db.prepare('SELECT COUNT(*) as count FROM videos').get({});
console.log(`✅  Videos seeded. ${count.count} total in database.`);
