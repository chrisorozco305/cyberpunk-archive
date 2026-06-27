// ─────────────────────────────────────────────
// seed-playlist.js — Seed Cyberpunk 2077 soundtrack into playlist table
// ─────────────────────────────────────────────
// Run with: npm run seed:playlist
// Clears old video-table entries and inserts all tracks into playlist.

import db from './db.js';

const TRACKS = [
  { title: 'Let You Down',                          artist: 'Dawid Podsiadło',                       genre: 'Soundtrack', youtube_id: 'BnnbP7pCIvQ' },
  { title: 'This Fffire',                           artist: 'Franz Ferdinand',                       genre: 'Soundtrack', youtube_id: '43d0Jq1XKXI' },
  { title: 'I Really Want to Stay at Your House',   artist: 'Rosa Walton & Hallie Coggins',          genre: 'Soundtrack', youtube_id: 'gzbLODUb1sA' },
  { title: "Who's Ready for Tomorrow",              artist: 'Rat Boy & IBDY',                        genre: 'Soundtrack', youtube_id: 'jLXTBbMRxK8' },
  { title: 'Night City',                            artist: 'R E L & Artemis Delta',                 genre: 'Soundtrack', youtube_id: 'Ld37nwZz1RQ' },
  { title: "Chippin' In 2022",                      artist: 'Kerry Eurodyne',                        genre: 'Soundtrack', youtube_id: 'vMIf7DKzWEM' },
  { title: 'Pain',                                  artist: 'Le Destroy & The Red Glare',            genre: 'Darksynth',  youtube_id: 'SfDxpP2iGvU' },
  { title: 'Suffer Me',                             artist: 'The Cold Stares & Brutus Backlash',     genre: 'Soundtrack', youtube_id: 'mwIHSMMhGYk' },
  { title: 'So It Goes',                            artist: 'Fingers and the Outlaws',               genre: 'Soundtrack', youtube_id: 'x16o7d6vjXI' },
  { title: 'Delicate Weapon',                       artist: 'Cyberpunk 2077',                        genre: 'Soundtrack', youtube_id: 'KTJQiGRQS8Q' },
  { title: 'The Ballad of Buck Ravers',             artist: 'Cyberpunk 2077',                        genre: 'Soundtrack', youtube_id: 'eLg01e2Je_0' },
  { title: 'Johnny Silverhand Theme',               artist: 'Cyberpunk 2077',                        genre: 'Ambient',    youtube_id: 'xuxWlWkxLDQ' },
  { title: '4ÆM',                                   artist: 'Grimes',                                genre: 'Electronic', youtube_id: 'mrZC1Jcw0dw' },
  { title: 'Heave Ho',                              artist: 'Konrad OldMoney feat. Frawst & XerzeX', genre: 'Soundtrack', youtube_id: 'FpgKU6yijak' },
  { title: 'Friday Night Fire Fight',               artist: 'Aligns & Rubicones',                    genre: 'Soundtrack', youtube_id: 'FV3_G3NDCPg' },
];

const insert = db.prepare(`
  INSERT INTO playlist (title, artist, duration, genre, youtube_id)
  VALUES (?, ?, ?, ?, ?)
`);

// Clear both tables and re-seed from scratch
db.exec('DELETE FROM videos');
db.exec('DELETE FROM playlist');

db.exec('BEGIN');
for (const t of TRACKS) {
  insert.run(t.title, t.artist, '', t.genre, t.youtube_id);
}
db.exec('COMMIT');

const count = db.prepare('SELECT COUNT(*) as count FROM playlist').get({});
console.log(`✅  Playlist seeded. ${count.count} tracks in database.`);
