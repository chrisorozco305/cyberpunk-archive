// ─────────────────────────────────────────────
// routes/gallery.js — Gallery API endpoints
// ─────────────────────────────────────────────
// All routes are prefixed with /api/gallery
// (mounted in server.js)

import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/gallery
// Returns all images. Supports optional ?category= filter and ?limit= param.
// Examples:
//   /api/gallery               → all images
//   /api/gallery?category=wallpaper
//   /api/gallery?limit=12
//   /api/gallery?category=concept&limit=8
router.get('/', (req, res) => {
  const { category, limit = 100 } = req.query;

  let query = 'SELECT * FROM gallery';

  if (category && category !== 'all') {
    query += ` WHERE category = ? ORDER BY created_at DESC LIMIT ?`;
    const rows = db.prepare(query).all(category, Number(limit));
    return res.json(rows);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  const rows = db.prepare(query).all(Number(limit));
  res.json(rows);
});

// GET /api/gallery/categories
// Returns a count of images per category (useful for filter buttons)
// Example response: [{ category: 'wallpaper', count: 42 }, ...]
router.get('/categories', (req, res) => {
  const rows = db.prepare(`
    SELECT category, COUNT(*) as count
    FROM gallery
    GROUP BY category
    ORDER BY count DESC
  `).all();
  res.json(rows);
});

// GET /api/gallery/:id
// Returns a single image by database ID
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id, {});
  if (!row) return res.status(404).json({ error: 'Image not found' });
  res.json(row);
});

export default router;
