// ─────────────────────────────────────────────
// routes/playlist.js — Playlist API endpoints
// ─────────────────────────────────────────────

import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/playlist — returns all tracks ordered by id
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM playlist ORDER BY id ASC').all();
  res.json(rows);
});

export default router;
