// ─────────────────────────────────────────────
// routes/playlist.js — Playlist API endpoints
// ─────────────────────────────────────────────

import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/playlist?name=Cyberpunk+2077 — filter by playlist_name, or return all
router.get('/', (req, res) => {
  const { name } = req.query;
  const rows = name
    ? db.prepare('SELECT * FROM playlist WHERE playlist_name = ? ORDER BY id ASC').all(name)
    : db.prepare('SELECT * FROM playlist ORDER BY id ASC').all();
  res.json(rows);
});

// GET /api/playlist/names — list of distinct playlist names for the UI cards
router.get('/names', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT playlist_name FROM playlist ORDER BY id ASC').all();
  res.json(rows.map(r => r.playlist_name));
});

export default router;
