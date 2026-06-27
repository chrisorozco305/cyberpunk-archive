// ─────────────────────────────────────────────
// db.js — SQLite database connection and schema
// ─────────────────────────────────────────────
// Uses Node.js 22's built-in node:sqlite module — no extra packages needed!
// Requires Node.js 22.5.0+ (we use --experimental-sqlite flag in package.json scripts)
// Database file is created automatically if it doesn't exist.

import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../database/archive.db');

// Open (or create) the SQLite database file
const db = new DatabaseSync(DB_PATH);

// ── Create tables if they don't exist ──────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    unsplash_id  TEXT UNIQUE,           -- Unsplash photo ID (prevents duplicates)
    title        TEXT NOT NULL,
    category     TEXT DEFAULT 'wallpaper',  -- wallpaper | concept | screenshot | fanart
    url_full     TEXT NOT NULL,         -- Full resolution URL
    url_regular  TEXT NOT NULL,         -- ~1080px URL (used for lightbox)
    url_small    TEXT NOT NULL,         -- ~400px URL (used for grid thumbnails)
    author       TEXT,                  -- Photographer name from Unsplash
    author_url   TEXT,                  -- Link to photographer profile
    description  TEXT,
    width        INTEGER,
    height       INTEGER,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS playlist (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    artist      TEXT NOT NULL,
    duration    TEXT NOT NULL,          -- Format: "4:23"
    genre       TEXT,
    cover_url   TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
