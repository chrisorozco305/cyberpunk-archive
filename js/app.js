/* ═══════════════════════════════════════════════════════════════
   CYBERPUNK ARCHIVE — APP.JS
   ═══════════════════════════════════════════════════════════════

   Core application logic for the cyberpunk archive website.
   Handles all interactivity: page routing, search, audio player,
   lightbox gallery, preferences, notifications, and animations.

   ARCHITECTURE:
   1. DATA SECTION: Arrays of content (gallery, playlists, blog posts)
   2. STATE SECTION: Global variables tracking current page, audio state
   3. INIT SECTION: DOMContentLoaded setup and event listeners
   4. ROUTING: Single-page app navigation using hash fragments
   5. FEATURES: Gallery, audio player, guestbook, settings, etc.
   6. UTILITIES: Helper functions (notifications, HTML escape, etc.)

   KEY STATE VARIABLES:
   • currentPage: which page is displayed
   • isPlaying: audio player state
   • prefs: user settings (theme, effects) stored in localStorage
   • currentTrack/currentSeconds: audio playback position

   HOW TO EXTEND:
   1. Add new data to BLOG_DATA, GALLERY_DATA, etc.
   2. Create new <section class="page"> in index.html
   3. Add render function for that page
   4. Wire it up in routeFromHash() with new page ID
   5. Add nav link in sidebar

   NOTE: All functions are in global scope for easy onclick handlers.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ────────────────────────────────────
// DATA — Content arrays for all pages
// ────────────────────────────────────

const GALLERY_DATA = [
  { id:1,  title:'Neon Districts',       cat:'wallpaper',  emoji:'🌆', colors:['#0a0e27','#00ffff','#ff006e'] },
  { id:2,  title:'Chrome Runner',        cat:'concept',    emoji:'🤖', colors:['#1a1f3a','#9d00ff','#00e5ff'] },
  { id:3,  title:'Sector 7 Sunrise',     cat:'wallpaper',  emoji:'🌅', colors:['#0a0e27','#ff6b35','#ffd700'] },
  { id:4,  title:'Ghost Protocol',       cat:'screenshot', emoji:'👾', colors:['#06080f','#39ff14','#00e5ff'] },
  { id:5,  title:'Megacorp Tower',       cat:'concept',    emoji:'🏙️', colors:['#1a2035','#00e5ff','#9d00ff'] },
  { id:6,  title:'Rain & Neon',          cat:'wallpaper',  emoji:'🌧️', colors:['#0a0e27','#00ffff','#ff006e'] },
  { id:7,  title:'Synthetic Dreams',     cat:'fanart',     emoji:'🎨', colors:['#06080f','#ff006e','#9d00ff'] },
  { id:8,  title:'Digital Sprawl',       cat:'wallpaper',  emoji:'🌃', colors:['#0a0e27','#ffd700','#ff6b35'] },
  { id:9,  title:'Neural Interface',     cat:'concept',    emoji:'🧠', colors:['#1a1f3a','#39ff14','#00e5ff'] },
  { id:10, title:'Back Alley Market',    cat:'screenshot', emoji:'🏪', colors:['#06080f','#ff006e','#ffd700'] },
  { id:11, title:'Cyber Samurai',        cat:'fanart',     emoji:'⚔️', colors:['#0a0e27','#00e5ff','#9d00ff'] },
  { id:12, title:'The Grid',             cat:'wallpaper',  emoji:'⬡', colors:['#06080f','#9d00ff','#ff006e'] },
  { id:13, title:'Street Doc',           cat:'concept',    emoji:'💉', colors:['#1a2035','#39ff14','#ff006e'] },
  { id:14, title:'Aerial Pursuit',       cat:'screenshot', emoji:'🚁', colors:['#0a0e27','#ff6b35','#00e5ff'] },
  { id:15, title:'Memory Lane',          cat:'fanart',     emoji:'🧩', colors:['#1a1f3a','#ffd700','#9d00ff'] },
  { id:16, title:'The Badlands',         cat:'wallpaper',  emoji:'🏜️', colors:['#06080f','#ff6b35','#ffd700'] },
];

const PLAYLIST_DATA = [
  { id:1,  title:'Ghost in the Wire',         artist:'NEON_PHANTOM',      dur:'4:23', genre:'Darksynth' },
  { id:2,  title:'Chrome City Nights',        artist:'Synthetix_77',      dur:'5:01', genre:'Synthwave' },
  { id:3,  title:'Electric Dystopia',         artist:'VoidRunner',        dur:'3:47', genre:'Retrowave' },
  { id:4,  title:'Neural Cascade',            artist:'NEON_PHANTOM',      dur:'6:12', genre:'Darksynth' },
  { id:5,  title:'Sector Zero',               artist:'pixel_ghost',       dur:'4:55', genre:'Industrial' },
  { id:6,  title:'Midnight Sprawl',           artist:'Synthetix_77',      dur:'3:38', genre:'Synthwave' },
  { id:7,  title:'Binary Sunset',             artist:'CyberVoid',         dur:'5:29', genre:'Retrowave' },
  { id:8,  title:'The Last Upload',           artist:'VoidRunner',        dur:'4:07', genre:'Darksynth' },
  { id:9,  title:'Neon Requiem',              artist:'NEON_PHANTOM',      dur:'7:14', genre:'Ambient' },
  { id:10, title:'Circuit Breaker',           artist:'pixel_ghost',       dur:'3:52', genre:'Industrial' },
  { id:11, title:'Hologram Blues',            artist:'CyberVoid',         dur:'4:41', genre:'Synthwave' },
  { id:12, title:'Synthetic Nightmare',       artist:'Synthetix_77',      dur:'5:17', genre:'Darksynth' },
];

const ALBUM_DATA = [
  { title:'Synthetic Nightmares Vol.3', artist:'NEON_PHANTOM',   year:2026, emoji:'🎵', colors:['#ff006e','#9d00ff'] },
  { title:'Chrome City Sessions',       artist:'Synthetix_77',   year:2025, emoji:'🎶', colors:['#00e5ff','#9d00ff'] },
  { title:'Ghost Protocol OST',         artist:'VoidRunner',     year:2025, emoji:'🎸', colors:['#39ff14','#00e5ff'] },
  { title:'Neon Requiem',               artist:'NEON_PHANTOM',   year:2024, emoji:'🎹', colors:['#ffd700','#ff6b35'] },
  { title:'Industrial Dreams',          artist:'pixel_ghost',    year:2024, emoji:'🥁', colors:['#ff6b35','#ff006e'] },
  { title:'Retrowave Anthology',        artist:'CyberVoid',      year:2023, emoji:'📀', colors:['#9d00ff','#00e5ff'] },
];

const VIDEO_DATA = [
  { title:'Blade Runner 2049 — Recut',   dur:'2:14:00', cat:'Films',     emoji:'🎬', colors:['#0a0e27','#ff6b35','#ffd700'] },
  { title:'Ghost in the Shell (1995)',   dur:'1:22:48', cat:'Films',     emoji:'📽️', colors:['#06080f','#00e5ff','#9d00ff'] },
  { title:'Cyberpunk 2077 — All Trailers', dur:'18:42', cat:'Trailers',  emoji:'🎮', colors:['#1a1f3a','#ff006e','#ffd700'] },
  { title:'Neuromancer Fan Edit 2024',   dur:'1:47:30', cat:'Fan Edits', emoji:'🤖', colors:['#0a0e27','#39ff14','#00e5ff'] },
  { title:'The Sprawl Explained',        dur:'42:17',   cat:'Docs',      emoji:'📖', colors:['#06080f','#9d00ff','#ff006e'] },
  { title:'Synthwave: The Documentary',  dur:'1:02:55', cat:'Docs',      emoji:'🎵', colors:['#1a2035','#ffd700','#ff6b35'] },
];

const BLOG_DATA = [
  {
    title: 'NightCity Underground Report: Digital Resistance Growing',
    cat: 'NEWS', date: '2026.06.27', author: 'ghost_runner',
    excerpt: 'Operatives in Sector 9 report increased surveillance drone activity, but citizen counter-measures are proving remarkably effective against the new NeoCorp facial-recognition arrays. Underground networks are sharing ECM schematics freely.',
    emoji: '📡', colors: ['#0a0e27','#00e5ff','#ff006e'],
  },
  {
    title: 'Archive v2.0.77 — New Gallery Engine + Search Overhaul',
    cat: 'RELEASE', date: '2026.06.25', author: 'admin_zero',
    excerpt: "We've rebuilt the media gallery from scratch with hardware-accelerated rendering and a new fuzzy search algorithm. Load times are down 60%. Lightbox navigation now supports keyboard shortcuts.",
    emoji: '⚙️', colors: ['#06080f','#39ff14','#00e5ff'],
  },
  {
    title: 'Featured: The Neon Ruins Collection by pixel_ghost',
    cat: 'ART', date: '2026.06.22', author: 'curator_IX',
    excerpt: 'A 47-piece digital art series exploring post-collapse urban environments rendered in brutal neon. pixel_ghost spent 18 months documenting imaginary ruins, each piece containing hidden glyphs.',
    emoji: '🎨', colors: ['#1a1f3a','#ff006e','#9d00ff'],
  },
  {
    title: 'Interview: The Architects of Darksynth — NEON_PHANTOM Speaks',
    cat: 'COMMUNITY', date: '2026.06.19', author: 'wave_rider',
    excerpt: 'Rare sit-down with one of the underground\'s most prolific producers. We discuss the origins of darksynth, the influence of 80s horror scores, and why they refuse to release on major platforms.',
    emoji: '🎙️', colors: ['#0a0e27','#9d00ff','#ffd700'],
  },
  {
    title: 'MegaCorp Watch: OmniTech Files Patent for Neural Ad Injection',
    cat: 'TECH', date: '2026.06.15', author: 'null_pointer',
    excerpt: 'A newly filed patent reveals OmniTech\'s plan to deliver advertisements directly into augmented-reality visual overlays, bypassing all existing ad-blocking technology. The community responds.',
    emoji: '⚠️', colors: ['#06080f','#ff6b35','#ff006e'],
  },
];

const DOWNLOAD_DATA = [
  {
    category: 'WALLPAPER PACKS',
    items: [
      { name:'Neon City Pack Vol.1 (4K)',     meta:'ZIP · 847 MB · 120 images',  emoji:'🌆' },
      { name:'Cyberpunk Minimalist Set',       meta:'ZIP · 124 MB · 40 images',   emoji:'◼' },
      { name:'Blade Runner Palette Collection',meta:'ZIP · 312 MB · 65 images',   emoji:'🎞️' },
      { name:'Synthwave Sunsets Pack',         meta:'ZIP · 560 MB · 89 images',   emoji:'🌅' },
    ],
  },
  {
    category: 'TOOLS & UTILITIES',
    items: [
      { name:'CyberPalette — Color Extractor', meta:'EXE · 4.2 MB · Windows/Mac', emoji:'🎨' },
      { name:'GlitchMaker Pro 2.1',            meta:'ZIP · 18 MB · Cross-platform',emoji:'📺' },
      { name:'SynthFont — Orbitron Extended',  meta:'TTF · 2.1 MB · Font pack',    emoji:'Aa' },
      { name:'Archive API Client v3',           meta:'ZIP · 8.7 MB · CLI tool',     emoji:'⌨️' },
    ],
  },
  {
    category: 'AUDIO',
    items: [
      { name:'Synthwave Sample Pack Vol.2',    meta:'ZIP · 1.2 GB · WAV 24-bit',  emoji:'🎵' },
      { name:'Darksynth Drum Machine Kit',     meta:'ZIP · 340 MB · .rex files',   emoji:'🥁' },
      { name:'Cyber FX Library',               meta:'ZIP · 890 MB · 500+ sounds',  emoji:'🔊' },
    ],
  },
  {
    category: 'GUIDES & DOCS',
    items: [
      { name:'Cyberpunk Art Style Guide v4',   meta:'PDF · 14 MB · 120 pages',    emoji:'📖' },
      { name:'Synthwave Production Manual',    meta:'PDF · 8 MB · 94 pages',      emoji:'📗' },
      { name:'Archive API Documentation',      meta:'PDF · 2 MB · Online version', emoji:'📋' },
    ],
  },
];

const CONTRIBUTORS = [
  { name:'admin_zero',  role:'Founder / Developer',   init:'AZ' },
  { name:'ghost_runner',role:'Content Lead',           init:'GR' },
  { name:'pixel_ghost', role:'Art Director',           init:'PG' },
  { name:'null_pointer',role:'Backend Dev',            init:'NP' },
  { name:'wave_rider',  role:'Community Manager',      init:'WR' },
  { name:'curator_IX',  role:'Gallery Curator',        init:'CI' },
];

const GUESTBOOK_DEFAULTS = [
  { name:'chrome_wanderer', date:'2026.06.26', msg:'This archive is the most important place on the net. Don\'t ever take it down.' },
  { name:'neon_drifter',    date:'2026.06.24', msg:'Found 3 albums here I\'ve been looking for years. Respect to everyone maintaining this.' },
  { name:'VoidRunner',      date:'2026.06.20', msg:'Dropped a new album in the audio section. Hope you all enjoy it. Stay underground.' },
  { name:'data_ghost_77',   date:'2026.06.18', msg:'The new gallery engine is incredible. Night and day compared to v1.' },
];

const SEARCH_INDEX = [
  { label:'Archive Home',    page:'home',      desc:'Main landing page and featured content' },
  { label:'Media Gallery',   page:'gallery',   desc:'Wallpapers, concept art, screenshots' },
  { label:'Audio Player',    page:'audio',     desc:'Synthwave, darksynth, retrowave tracks' },
  { label:'Videos',          page:'videos',    desc:'Films, trailers, fan edits, docs' },
  { label:'Community Hub',   page:'community', desc:'Forums, IRC, Discord, guestbook' },
  { label:'Blog / News',     page:'blog',      desc:'Articles, updates, dispatches' },
  { label:'Downloads',       page:'downloads', desc:'Tools, wallpaper packs, audio samples' },
  { label:'About / History', page:'about',     desc:'Site background and contributors' },
  { label:'Settings',        page:'settings',  desc:'Theme, effects, accessibility' },
];

// ────────────────────────────────────
// STATE — Global app state variables
// ────────────────────────────────────
// NOTE: These are intentionally global for easy access in onclick handlers

let currentPage = 'home';           // Current active page (routing)
let currentTrack = 0;               // Index into PLAYLIST_DATA
let isPlaying = false;              // Audio player state
let isShuffle = false;              // Shuffle mode toggle
let isRepeat = false;               // Repeat mode toggle
let playerInterval = null;          // setInterval ID for audio tick
let currentSeconds = 0;             // Current playback position
let lbIndex = 0;                    // Current image in lightbox
let prefs = {};                     // User preferences (loaded from localStorage)

// ────────────────────────────────────
// INIT
// ────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadPrefs();
  applyPrefs();
  renderGallery();
  renderPlaylist();
  renderAlbums();
  renderVideos();
  renderBlog();
  renderDownloads();
  renderContributors();
  renderGuestbook();
  initSearch();
  initNavLinks();
  initHamburger();
  initCounters();
  startTypingAnimation();
  startVizAnimation();
  routeFromHash();
  window.addEventListener('hashchange', routeFromHash);
});

// ────────────────────────────────────
// ROUTING — Single-page app navigation
// ────────────────────────────────────
// Uses URL hash fragments (#page) for routing. Triggered by:
// - User clicks nav link (onclick handler in HTML)
// - User visits URL directly (window.onhashchange listener)
// - User clicks internal link (navigateTo() call)

function routeFromHash() {
  // Read hash from URL, default to 'home'
  const hash = window.location.hash.slice(1) || 'home';
  const validPages = ['home','gallery','audio','videos','community','blog','downloads','about','settings'];

  // Validate page exists, otherwise show 404
  navigateTo(validPages.includes(hash) ? hash : '404');
}

function navigateTo(page) {
  // Close sidebar on mobile (if user navigates, sidebar should close)
  closeMobileSidebar();

  // Hide all pages and remove active nav links
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Show target page and scroll to top
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) {
    pageEl.classList.add('active');
    pageEl.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  // Highlight active nav link
  const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');

  // Update state and URL
  currentPage = page;
  if (history.pushState) history.pushState(null, '', '#' + page);

  // Run page-specific setup (animations, data fetches, etc.)
  if (page === 'home') initCounters();        // Animate stat counters
  if (page === '404')  initMatrixRain();      // Generate matrix effect
}

// ────────────────────────────────────
// SIDEBAR — GROUP TOGGLE
// ────────────────────────────────────

function toggleGroup(id) {
  const group = document.getElementById('group-' + id);
  if (group) group.classList.toggle('collapsed');
}

// ────────────────────────────────────
// MOBILE SIDEBAR
// ────────────────────────────────────

function initHamburger() {
  const ham = document.getElementById('hamburger');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!ham) return;

  ham.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const open = sidebar.classList.toggle('open');
    ham.classList.toggle('open', open);
    backdrop.classList.toggle('visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  backdrop.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const ham = document.getElementById('hamburger');
  const backdrop = document.getElementById('sidebarBackdrop');
  sidebar && sidebar.classList.remove('open');
  ham && ham.classList.remove('open');
  backdrop && backdrop.classList.remove('visible');
  document.body.style.overflow = '';
}

// ────────────────────────────────────
// NAV LINKS
// ────────────────────────────────────

function initNavLinks() {
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
}

// ────────────────────────────────────
// SEARCH — Live sidebar search
// ────────────────────────────────────
// User types in search box, matches pages in real-time
// Searches against SEARCH_INDEX array (page titles and descriptions)
// Clicking a result navigates to that page

function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    // If search is empty, hide results
    if (!q) { results.classList.remove('visible'); return; }

    // Filter SEARCH_INDEX for matches in label or description
    const matches = SEARCH_INDEX.filter(item =>
      item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    if (!matches.length) {
      results.innerHTML = '<div class="sr-item" style="color:var(--text-3)">No results found</div>';
    } else {
      results.innerHTML = matches.map(m =>
        `<div class="sr-item" onclick="navigateTo('${m.page}'); document.getElementById('searchInput').value=''; document.getElementById('searchResults').classList.remove('visible');">
          <strong style="color:var(--acc)">${m.label}</strong><br>
          <span style="color:var(--text-3);font-size:0.65rem">${m.desc}</span>
        </div>`
      ).join('');
    }
    results.classList.add('visible');
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('visible');
    }
  });
}

// ────────────────────────────────────
// GALLERY
// ────────────────────────────────────

function renderGallery(filter = 'all') {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const items = filter === 'all' ? GALLERY_DATA : GALLERY_DATA.filter(i => i.cat === filter);

  grid.innerHTML = items.map((item, idx) => {
    const bg = `linear-gradient(135deg, ${item.colors.join(', ')})`;
    return `
      <div class="gallery-item" data-idx="${idx}" data-filter="${item.cat}" onclick="openLightbox(${idx})">
        <div class="gallery-thumb" style="background:${bg}">
          <span>${item.emoji}</span>
        </div>
        <div class="gallery-overlay">
          <div class="gallery-info">
            <div class="gallery-title">${item.title}</div>
            <div class="gallery-cat">${item.cat.toUpperCase()}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });
}

// ────────────────────────────────────
// LIGHTBOX — Full-screen image viewer
// ────────────────────────────────────
// Shows gallery items in a modal overlay with navigation
// Keyboard shortcuts:
//   ← / → arrows: previous/next image
//   Esc: close lightbox
// Click outside image to close (except on buttons)

function openLightbox(idx) {
  // Set current index and show modal
  lbIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';  // Prevent body scroll while viewing
}

function updateLightbox() {
  // Refresh the lightbox display with current item
  const item = GALLERY_DATA[lbIndex];
  const bg = `linear-gradient(135deg, ${item.colors.join(', ')})`;
  document.getElementById('lbPlaceholder').style.background = bg;
  document.getElementById('lbPlaceholder').innerHTML = `<span style="font-size:5rem">${item.emoji}</span>`;
  document.getElementById('lbCaption').textContent = `${item.title} · ${item.cat.toUpperCase()} · ${lbIndex + 1} / ${GALLERY_DATA.length}`;
}

function closeLightbox(e) {
  // Close lightbox. Allow click-outside-to-close, but not on buttons
  if (e && e.target !== document.getElementById('lightbox') && !e.target.closest('.lb-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';  // Restore body scroll
}

function lbNav(dir, e) {
  // Navigate to previous (-1) or next (1) image
  // Uses modulo to wrap around (circular navigation)
  e && e.stopPropagation();
  lbIndex = (lbIndex + dir + GALLERY_DATA.length) % GALLERY_DATA.length;
  updateLightbox();
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
});

// ────────────────────────────────────
// AUDIO PLAYER — Full music playback UI
// ────────────────────────────────────
// This is a full UI mock-up with simulated playback. The player:
// - Displays track info, cover art, current time
// - Allows track selection, play/pause, seek, shuffle, repeat, volume
// - Updates a progress bar using setInterval (tickPlayer)
// - Animates a visualizer with random bar heights
//
// HOW IT WORKS:
// 1. selectTrack(idx) sets currentTrack and loads track metadata
// 2. togglePlay() starts/stops a setInterval that calls tickPlayer()
// 3. tickPlayer() increments currentSeconds and updates progress bar
// 4. When track ends, play next (or repeat current if isRepeat)
// 5. seekAudio() lets user click progress bar to jump to time
//
// TO CONNECT REAL AUDIO:
// - Create an <audio> element in the HTML
// - Replace tickPlayer() with actual playback time from audio.currentTime
// - Use audio.play() / audio.pause() instead of timer logic

function renderPlaylist() {
  const ul = document.getElementById('playlist');
  if (!ul) return;

  ul.innerHTML = PLAYLIST_DATA.map((t, i) => `
    <li class="pl-item ${i === 0 ? 'active' : ''}" onclick="selectTrack(${i})">
      <span class="pl-num">${i === 0 ? '▶' : i + 1}</span>
      <div class="pl-info">
        <div class="pl-track">${t.title}</div>
        <div class="pl-artist">${t.artist}</div>
      </div>
      <span class="pl-dur">${t.dur}</span>
    </li>`).join('');

  document.getElementById('playlistCount').textContent = PLAYLIST_DATA.length + ' TRACKS';
}

function renderAlbums() {
  const grid = document.getElementById('albumGrid');
  if (!grid) return;

  grid.innerHTML = ALBUM_DATA.map(a => {
    const bg = `linear-gradient(135deg, ${a.colors.join(', ')})`;
    return `
      <div class="album-card" onclick="notify('Playing album: ${a.title}', 'success')">
        <div class="album-cover" style="background:${bg}">${a.emoji}</div>
        <div class="album-info">
          <div class="album-title">${a.title}</div>
          <div class="album-artist">${a.artist}</div>
          <div class="album-year">${a.year}</div>
        </div>
      </div>`;
  }).join('');
}

function selectTrack(idx) {
  currentTrack = idx;
  const t = PLAYLIST_DATA[idx];

  document.getElementById('playerTrack').textContent  = t.title;
  document.getElementById('playerArtist').textContent = t.artist;
  document.getElementById('playerDuration').textContent = t.dur;
  currentSeconds = 0;
  updateProgress(0);

  document.querySelectorAll('.pl-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.querySelector('.pl-num').textContent = i === idx ? '▶' : i + 1;
  });

  if (!isPlaying) togglePlay();
  notify(`Now playing: ${t.title}`, 'success');
}

function togglePlay() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('playBtn');
  btn.textContent = isPlaying ? '⏸' : '▶';

  const cover = document.querySelector('.player-main');
  cover && cover.classList.toggle('playing', isPlaying);

  if (isPlaying) {
    playerInterval = setInterval(tickPlayer, 1000);
  } else {
    clearInterval(playerInterval);
  }
}

function tickPlayer() {
  const t = PLAYLIST_DATA[currentTrack];
  const parts = t.dur.split(':').map(Number);
  const totalSec = parts[0] * 60 + parts[1];
  currentSeconds++;

  if (currentSeconds >= totalSec) {
    if (isRepeat) {
      currentSeconds = 0;
    } else {
      nextTrack();
      return;
    }
  }

  const pct = (currentSeconds / totalSec) * 100;
  updateProgress(pct);
  const m = Math.floor(currentSeconds / 60);
  const s = currentSeconds % 60;
  document.getElementById('playerCurrentTime').textContent = `${m}:${s.toString().padStart(2,'0')}`;
}

function updateProgress(pct) {
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressThumb').style.left = pct + '%';
}

function seekAudio(e) {
  const bar = document.getElementById('playerProgress');
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  const t = PLAYLIST_DATA[currentTrack];
  const parts = t.dur.split(':').map(Number);
  currentSeconds = Math.floor((pct / 100) * (parts[0] * 60 + parts[1]));
  updateProgress(pct);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + PLAYLIST_DATA.length) % PLAYLIST_DATA.length;
  selectTrack(currentTrack);
}

function nextTrack() {
  if (isShuffle) {
    currentTrack = Math.floor(Math.random() * PLAYLIST_DATA.length);
  } else {
    currentTrack = (currentTrack + 1) % PLAYLIST_DATA.length;
  }
  selectTrack(currentTrack);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById('shuffleBtn').classList.toggle('active', isShuffle);
  notify(isShuffle ? 'Shuffle ON' : 'Shuffle OFF', 'info');
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  document.getElementById('repeatBtn').classList.toggle('active', isRepeat);
  notify(isRepeat ? 'Repeat ON' : 'Repeat OFF', 'info');
}

function toggleMute() {
  const slider = document.getElementById('volumeSlider');
  slider.value = slider.value > 0 ? 0 : 80;
  slider.dispatchEvent(new Event('input'));
}

document.addEventListener('DOMContentLoaded', () => {
  const vol = document.getElementById('volumeSlider');
  if (vol) {
    vol.addEventListener('input', () => {
      document.getElementById('volVal').textContent = vol.value + '%';
    });
  }
});

// ────────────────────────────────────
// VISUALIZER
// ────────────────────────────────────

function startVizAnimation() {
  const container = document.getElementById('vizBars');
  if (!container) return;

  const count = 48;
  container.innerHTML = Array.from({ length: count }, (_, i) =>
    `<div class="viz-bar" style="animation-delay:${(i * 0.04).toFixed(2)}s"></div>`
  ).join('');

  function animateBars() {
    const bars = container.querySelectorAll('.viz-bar');
    bars.forEach(bar => {
      const h = isPlaying
        ? (Math.random() * 70 + 10) + '%'
        : (Math.random() * 8 + 4) + '%';
      bar.style.height = h;
    });
    setTimeout(animateBars, isPlaying ? 120 : 800);
  }
  animateBars();
}

// ────────────────────────────────────
// VIDEOS
// ────────────────────────────────────

function renderVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;

  grid.innerHTML = VIDEO_DATA.map(v => {
    const bg = `linear-gradient(135deg, ${v.colors.join(', ')})`;
    return `
      <div class="video-card" onclick="notify('Video player coming soon: ${escHtml(v.title)}', 'info')">
        <div class="video-thumb" style="background:${bg}">
          <span>${v.emoji}</span>
          <div class="video-play-overlay">▶</div>
        </div>
        <div class="video-meta">
          <div class="video-title">${v.title}</div>
          <div class="video-info">
            <span class="video-dur">${v.dur}</span>
            <span class="video-cat">${v.cat}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ────────────────────────────────────
// BLOG
// ────────────────────────────────────

function renderBlog() {
  const list = document.getElementById('blogList');
  if (!list) return;

  const catClass = { NEWS:'cat-news', RELEASE:'cat-release', ART:'cat-art', COMMUNITY:'cat-release', TECH:'cat-news' };

  list.innerHTML = BLOG_DATA.map(post => {
    const bg = `linear-gradient(135deg, ${post.colors.join(', ')})`;
    return `
      <article class="blog-post" onclick="notify('Full article view coming soon', 'info')">
        <div class="bp-banner" style="background:${bg}">
          <span style="font-size:4rem">${post.emoji}</span>
        </div>
        <div class="bp-body">
          <div class="bp-meta">
            <span class="ra-cat ${catClass[post.cat] || 'cat-news'}">${post.cat}</span>
            <span class="ra-date">${post.date}</span>
          </div>
          <h2 class="bp-title">${post.title}</h2>
          <p class="bp-excerpt">${post.excerpt}</p>
          <div class="bp-footer">
            <span class="bp-author">by ${post.author}</span>
            <span class="bp-read">READ MORE →</span>
          </div>
        </div>
      </article>`;
  }).join('');
}

// ────────────────────────────────────
// DOWNLOADS
// ────────────────────────────────────

function renderDownloads() {
  const container = document.getElementById('dlCats');
  if (!container) return;

  container.innerHTML = DOWNLOAD_DATA.map(cat => `
    <div>
      <div class="dl-category-title">${cat.category}</div>
      <div class="dl-grid">
        ${cat.items.map(item => `
          <div class="dl-item" onclick="notify('Downloading: ${escHtml(item.name)}', 'success')">
            <span class="dl-icon">${item.emoji}</span>
            <div class="dl-info">
              <div class="dl-name">${item.name}</div>
              <div class="dl-meta">${item.meta}</div>
            </div>
            <button class="dl-btn">GET</button>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

// ────────────────────────────────────
// CONTRIBUTORS
// ────────────────────────────────────

function renderContributors() {
  const list = document.getElementById('contributorList');
  if (!list) return;

  list.innerHTML = CONTRIBUTORS.map(c => `
    <div class="contributor">
      <div class="contrib-avatar">${c.init}</div>
      <div>
        <div class="contrib-name">${c.name}</div>
        <div class="contrib-role">${c.role}</div>
      </div>
    </div>`).join('');
}

// ────────────────────────────────────
// GUESTBOOK
// ────────────────────────────────────

let guestbookEntries = [...GUESTBOOK_DEFAULTS];

function renderGuestbook() {
  const el = document.getElementById('guestbook');
  if (!el) return;

  el.innerHTML = guestbookEntries.map(e => `
    <div class="gb-entry">
      <div class="gb-header">
        <span class="gb-name">${escHtml(e.name)}</span>
        <span class="gb-date">${e.date}</span>
      </div>
      <div class="gb-msg">${escHtml(e.msg)}</div>
    </div>`).join('');
}

function openGuestbook() {
  document.getElementById('guestbookForm').style.display = 'block';
  document.getElementById('gbName').focus();
}

function closeGuestbook() {
  document.getElementById('guestbookForm').style.display = 'none';
}

function submitGuestbook() {
  const name = document.getElementById('gbName').value.trim();
  const msg  = document.getElementById('gbMsg').value.trim();

  if (!name) { notify('Enter your operative name', 'error'); return; }
  if (!msg)  { notify('Write a message first', 'error'); return; }

  const now = new Date();
  const date = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

  guestbookEntries.unshift({ name, date, msg });
  renderGuestbook();
  document.getElementById('gbName').value = '';
  document.getElementById('gbMsg').value  = '';
  closeGuestbook();
  notify('Transmission logged, operative.', 'success');
}

// ────────────────────────────────────
// SETTINGS / PREFS — User preferences
// ────────────────────────────────────
// All preferences are stored in browser localStorage as JSON
// Format: { theme: 'cyan', scanlines: true, ... }
// Persists across sessions — settings stick around after refresh

const DEFAULT_PREFS = {
  theme: 'cyan',           // Accent color theme
  scanlines: true,         // CRT-style horizontal lines
  glitch: true,            // RGB shift effect on titles
  noise: true,             // Film grain texture
  animations: true,        // CSS transitions and keyframes
  reducedMotion: false,    // Disable animations for accessibility
  highContrast: false,     // Increase text contrast
  compact: false,          // Reduce sidebar padding
};

function loadPrefs() {
  // Load from localStorage, merge with defaults
  // If localStorage is unavailable (private mode), use defaults
  try {
    const stored = JSON.parse(localStorage.getItem('cyberArchivePrefs') || '{}');
    prefs = { ...DEFAULT_PREFS, ...stored };
  } catch {
    prefs = { ...DEFAULT_PREFS };
  }
}

function savePrefs() {
  try { localStorage.setItem('cyberArchivePrefs', JSON.stringify(prefs)); } catch {}
}

function applyPrefs() {
  setTheme(prefs.theme, false);
  toggleEffect('scanlines',     prefs.scanlines,     false);
  toggleEffect('glitch',        prefs.glitch,        false);
  toggleEffect('noise',         prefs.noise,         false);
  toggleEffect('animations',    prefs.animations,    false);
  toggleEffect('reduced-motion',prefs.reducedMotion, false);
  toggleEffect('high-contrast', prefs.highContrast,  false);
  toggleEffect('compact',       prefs.compact,       false);

  // Sync checkboxes
  const sync = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  sync('scanlineToggle', prefs.scanlines);
  sync('glitchToggle',   prefs.glitch);
  sync('noiseToggle',    prefs.noise);
  sync('animToggle',     prefs.animations);
  sync('reducedMotion',  prefs.reducedMotion);
  sync('highContrast',   prefs.highContrast);
  sync('compactToggle',  prefs.compact);

  // Sync swatch active state
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === prefs.theme);
  });
}

function setTheme(name, save = true) {
  const themes = ['cyan','magenta','green','purple','orange'];
  document.body.classList.remove(...themes.map(t => 'theme-' + t));
  document.body.classList.add('theme-' + (themes.includes(name) ? name : 'cyan'));
  prefs.theme = name;
  if (save) {
    savePrefs();
    document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === name));
    notify('Theme updated: ' + name.toUpperCase(), 'success');
  }
}

function toggleEffect(effect, on, save = true) {
  const classMap = {
    scanlines:      ['no-scanlines',  'scanlines'],
    glitch:         ['no-glitch',     'glitch'],
    noise:          ['no-noise',      'noise'],
    animations:     [],
    'reduced-motion':['reduced-motion'],
    'high-contrast':['high-contrast'],
    compact:        ['compact'],
  };

  const body = document.body;

  if (effect === 'scanlines') {
    body.classList.toggle('no-scanlines', !on);
    prefs.scanlines = on;
  } else if (effect === 'glitch') {
    body.classList.toggle('no-glitch', !on);
    prefs.glitch = on;
  } else if (effect === 'noise') {
    body.classList.toggle('no-noise', !on);
    prefs.noise = on;
  } else if (effect === 'animations') {
    prefs.animations = on;
  } else if (effect === 'reduced-motion') {
    body.classList.toggle('reduced-motion', on);
    prefs.reducedMotion = on;
  } else if (effect === 'high-contrast') {
    body.classList.toggle('high-contrast', on);
    prefs.highContrast = on;
  } else if (effect === 'compact') {
    body.classList.toggle('compact', on);
    prefs.compact = on;
  }

  if (save) savePrefs();
}

function exportPrefs() {
  const blob = new Blob([JSON.stringify(prefs, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cyber-archive-prefs.json';
  a.click();
  notify('Preferences exported', 'success');
}

function resetPrefs() {
  prefs = { ...DEFAULT_PREFS };
  savePrefs();
  applyPrefs();
  notify('Settings reset to defaults', 'info');
}

// ────────────────────────────────────
// NOTIFICATIONS
// ────────────────────────────────────

function notify(msg, type = 'info') {
  const container = document.getElementById('notifications');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 350);
  }, 3000);
}

// ────────────────────────────────────
// TYPING ANIMATION
// ────────────────────────────────────

function startTypingAnimation() {
  const el = document.getElementById('typingTarget');
  if (!el) return;

  const texts = [
    'A living archive of cyberpunk culture — art, music, and transmissions from the digital underground.',
    'Preserving the signal in the noise. 12,847 files. Community-maintained since 2019.',
    'Unauthorized access will be prosecuted. All other operatives: welcome.',
  ];

  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const text = texts[textIdx];
    if (!deleting) {
      el.textContent = text.slice(0, ++charIdx);
      if (charIdx === text.length) {
        deleting = true;
        setTimeout(tick, 2800);
        return;
      }
    } else {
      el.textContent = text.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(tick, deleting ? 30 : 55);
  }
  tick();
}

// ────────────────────────────────────
// ANIMATED COUNTERS
// ────────────────────────────────────

function initCounters() {
  const cards = document.querySelectorAll('.stat-num[data-target]');
  cards.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ────────────────────────────────────
// MATRIX RAIN (404)
// ────────────────────────────────────

function initMatrixRain() {
  const container = document.getElementById('matrixRain');
  if (!container || container.dataset.init) return;
  container.dataset.init = '1';

  const cols = Math.floor(window.innerWidth / 20);
  for (let i = 0; i < cols; i++) {
    const col = document.createElement('div');
    col.style.cssText = `
      position:absolute;
      top:-100%;
      left:${i * 20}px;
      width:20px;
      color:var(--acc-green);
      font-family:'JetBrains Mono',monospace;
      font-size:14px;
      writing-mode:vertical-rl;
      animation:matrixFall ${(Math.random() * 3 + 2).toFixed(1)}s linear ${(Math.random() * 2).toFixed(1)}s infinite;
      opacity:${(Math.random() * 0.5 + 0.2).toFixed(2)};
      text-shadow:0 0 8px var(--acc-green);
    `;
    col.textContent = Array.from({ length: 30 }, () =>
      String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
    ).join('');
    container.appendChild(col);
  }

  if (!document.getElementById('matrixKeyframes')) {
    const style = document.createElement('style');
    style.id = 'matrixKeyframes';
    style.textContent = `
      @keyframes matrixFall {
        from { top: -100%; }
        to   { top: 100%; }
      }`;
    document.head.appendChild(style);
  }
}

// ────────────────────────────────────
// UTILITY
// ────────────────────────────────────

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
