// ─────────────────────────────────────────────
// server.js — Express server
// ─────────────────────────────────────────────
// Serves the static frontend AND the JSON API.
//
// Start with:
//   npm run dev    (auto-restarts on file change)
//   npm start      (production)
//
// Then open: http://localhost:3000

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import galleryRoutes  from './routes/gallery.js';
import videoRoutes    from './routes/videos.js';
import playlistRoutes from './routes/playlist.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

// ── Middleware ──────────────────────────────────────────────────────

// Allow requests from any origin (useful when running frontend separately)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve the frontend files (index.html, css/, js/) from project root
app.use(express.static(join(__dirname, '..')));

// ── API Routes ──────────────────────────────────────────────────────

app.use('/api/gallery',  galleryRoutes);
app.use('/api/videos',   videoRoutes);
app.use('/api/playlist', playlistRoutes);

// Health check endpoint — useful for AWS load balancers to verify server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// ── Fallback ────────────────────────────────────────────────────────

// For any unmatched route, serve index.html (handles client-side hash routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../index.html'));
});

// ── Start ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n⬡  CYBER_ARCHIVE running at http://localhost:${PORT}`);
  console.log(`   API available at http://localhost:${PORT}/api/gallery\n`);
});
