# DracinReels — Vite + React, Mobile-First, Siap Produksi (Frontend)

Frontend lengkap untuk web reels drama China. Belum ada backend —
video, login, pembayaran, dan iklan masih memakai data contoh / localStorage,
siap diganti dengan API dan HLS asli saat produksi.

## Jalankan (dev)
```bash
bun install
bun run dev
```

## Build (produksi statis, untuk Vercel)
```bash
bun run build
```
Vercel: Framework Vite, Build Command `npm run build`, Output Directory `dist`.
Jalankan hasil build lewat server HTTP, jangan langsung `file://`
(modul ES diblokir CORS oleh browser).

## Yang sudah lengkap di frontend ini
- Player video asli: play/pause, seek, mute, fullscreen, kecepatan 1x–2x,
  subtitle Indonesia on/off (CC), lanjut episode otomatis, simpan progress
- Feed vertikal scroll-snap, detail judul + grid episode, cari + genre,
  bookmark, profil, komentar (tambah komentar lokal), bagikan (Web Share / salin link)
- Episode 1–5 gratis, 6+ terkunci: buka dengan iklan (demo) atau 10 koin
- Semua state penting tersimpan di localStorage: suka, bookmark, unlock, koin, progress
- Ikon SVG inline semua (tanpa emoji di tombol/nav), poster gradient per genre
- PWA: manifest + ikon SVG, theme-color gelap, mobile-first max 430px,
  tombol minimal 44–48px, focus-visible, prefers-reduced-motion

## Yang harus diganti saat produksi asli
- `src/data.js` → `VIDEO_URLS`: ganti video contoh publik dengan URL HLS
  dari Bunny Stream / Cloudflare Stream untuk tiap judul
- `SUBTITLE_LINES` → subtitle / track VTT asli per episode
- Koin, unlock, komentar, dan login → API backend + pembayaran QRIS
- Poster gradient → poster / thumbnail video asli
