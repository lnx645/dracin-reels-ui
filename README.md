# DracinReels — UI Only (Vite + React, Mobile-First)

UI saja, belum ada backend, video, login, pembayaran, atau iklan.
Semua data di `src/data.js` adalah data contoh.

## Jalankan (dev)
```bash
cd dracin-reels-ui
bun install
bun run dev
```
Lalu buka alamat yang ditampilkan Vite di browser HP / desktop.

## Build (produksi statis)
```bash
bun x vite build
```
Hasilnya di `dist/` — jalankan lewat server HTTP, jangan dibuka langsung
via `file://` karena modul ES diblokir CORS oleh browser, contoh:
```bash
cd dist && python3 -m http.server 8000
```

## Yang ada di UI ini
- Beranda: feed vertikal scroll-snap, 1 reel = 1 layar, aksi suka / komentar / bookmark / bagikan
- Episode gratis 1–5, episode 6+ terkunci dengan modal Nonton Iklan / 10 Koin (demo, tanpa backend)
- Detail judul: sinopsis + grid episode 1–10
- Cari: pencarian + chip genre (CEO, Balas Dendam, Kostum, Romantis)
- Bookmark, Profil (koin demo 120), bottom nav 4 tab
- Mobile-first: lebar maks 430px, tombol minimal 44–48px, safe-area bottom nav
