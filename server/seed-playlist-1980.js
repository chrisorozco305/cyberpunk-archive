// seed-playlist-1980.js — Seeds the "Cyberpunk 1980" playlist
// Run with: npm run seed:1980

import db from './db.js';

const TRACKS = [
  { title: 'Electric Dreams',                     artist: 'Perturbator',      genre: 'Synthwave',  youtube_id: 'l_6xGKxjZCk' },
  { title: 'Escape From New York Theme',           artist: 'John Carpenter',   genre: 'Soundtrack', youtube_id: 'zTxBc_-XxmI' },
  { title: 'Futurisma',                            artist: 'Flashworx',        genre: 'Synthwave',  youtube_id: 'qcOiJnWniWg' },
  { title: 'Deus Ex: Unatco Theme',               artist: 'Alexander Brandon', genre: 'Soundtrack', youtube_id: 'iCGBzrpxpsU' },
  { title: 'La Morte della Speranza',             artist: 'Mitch Murder',     genre: 'Synthwave',  youtube_id: 'aSJ-_AxDXw0' },
  { title: 'Wayfinder',                            artist: 'Infinity Shred',   genre: 'Electronic', youtube_id: 'HUlf1zLrimA' },
  { title: 'Nightforce',                           artist: 'Power Glove',      genre: 'Synthwave',  youtube_id: 'aLgOzNbNVc4' },
  { title: 'The Black Mill Video Tape',           artist: 'The Black Mill',   genre: 'Darksynth',  youtube_id: 'WRX6TWnLjCE' },
  { title: 'Anthonio (Berlin Breakdown Version)', artist: 'Annie',            genre: 'Electronic', youtube_id: 'FvVPbGAKNJM' },
  { title: '1986',                                 artist: 'Kavinsky',         genre: 'Synthwave',  youtube_id: 'wKES3IIbTl4' },
  { title: 'End of The Dark',                     artist: 'Kukeiha Club',     genre: 'Soundtrack', youtube_id: 'dlNOZ1D6zgY' },
  { title: 'Deus Ex — NYC Streets',               artist: 'Alexander Brandon', genre: 'Soundtrack', youtube_id: 'RgIE6Pb_MFE' },
  { title: '80s Synth Improvisation',             artist: 'Unknown',          genre: 'Synthwave',  youtube_id: 'IkeLkzHAjCg' },
  { title: 'Tears in The Rain',                   artist: 'MK Ultra',         genre: 'Darksynth',  youtube_id: 'ASEL-TwukKg' },
];

const insert = db.prepare(`
  INSERT INTO playlist (title, artist, duration, genre, youtube_id, playlist_name)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Remove any existing 1980 tracks to keep re-runs idempotent
db.exec("DELETE FROM playlist WHERE playlist_name = 'Cyberpunk 1980'");

db.exec('BEGIN');
for (const t of TRACKS) {
  insert.run(t.title, t.artist, '', t.genre, t.youtube_id, 'Cyberpunk 1980');
}
db.exec('COMMIT');

const count = db.prepare("SELECT COUNT(*) as c FROM playlist WHERE playlist_name = 'Cyberpunk 1980'").get({});
console.log(`✅  Cyberpunk 1980 seeded. ${count.c} tracks.`);
