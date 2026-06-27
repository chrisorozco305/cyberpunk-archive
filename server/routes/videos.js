// ─────────────────────────────────────────────
// routes/videos.js — Video API endpoints
// ─────────────────────────────────────────────
// All routes prefixed with /api/videos (mounted in server.js)

import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/videos
// Returns all videos, optionally filtered by ?category=
router.get('/', (req, res) => {
  const { category } = req.query;

  if (category && category !== 'all') {
    const rows = db.prepare(
      'SELECT * FROM videos WHERE category = ? ORDER BY created_at ASC'
    ).all(category);
    return res.json(rows);
  }

  const rows = db.prepare(
    'SELECT * FROM videos ORDER BY created_at ASC'
  ).all();
  res.json(rows);
});

export default router;
