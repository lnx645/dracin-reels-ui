# DracinReels — Vite + React, Mobile-First, Clean Architecture + Emotion + Router

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
`vercel.json` sudah berisi rewrites SPA ke `index.html`, jadi rute dalam
seperti `/watch/ceo/1` dan `/title/ceo` bisa dibuka langsung / dibagikan
tanpa 404. Jalankan hasil build lewat server HTTP, jangan langsung `file://`
(modul ES diblokir CORS oleh browser).

Catatan penting soal `vite.config.js`: `base` harus `'/'`, BUKAN `'./'`.
Base relatif membuat aset JS 404 di rute dalam dan halaman watch blank
(terbukti saat refactor ini, diperbaiki).

## Rute (react-router-dom, player BUKAN modal)
- `/` — Feed vertikal ala TikTok
- `/search` — Cari + genre
- `/saved` — Bookmark
- `/profile` — Profil + Lanjutkan Nonton
- `/title/:titleId` — Detail judul + grid episode
- `/watch/:titleId/:episode` — HALAMAN PLAYER penuh (bukan overlay modal).
  Tombol back browser kembali ke halaman sebelumnya; URL bisa dibagikan.

## Struktur Clean Architecture
```
src/
  theme.js                    # token desain + Global reset Emotion (satu-satunya sumber gaya global)
  icons.jsx                   # ikon SVG inline, tanpa emoji di tombol/nav
  domain/
    rules.js                  # aturan murni: episode 1-5 gratis, 6+ terkunci, 10 koin, progress
  infrastructure/
    seedData.js               # judul/feed/komentar demo
    videoSource.js            # URL video contoh + lisensi (ganti dengan HLS di sini saja)
    storageRepository.js      # satu-satunya akses localStorage
  presentation/
    hooks/
      useAppState.js          # state aplikasi + aksi (suka, bookmark, unlock, koin, progress)
      usePlayer.js            # logika player (play, seek, mute, speed, subtitle, fullscreen)
    components/
      TopBar.jsx BottomNav.jsx Poster.jsx ReelCard.jsx ReelActions.jsx
      TitleCard.jsx DetailSheet.jsx CommentsSheet.jsx UnlockModal.jsx
      Player.jsx              # elemen video + kontrol (dipakai WatchPage, BUKAN modal)
      Toast.jsx
    pages/
      FeedPage.jsx SearchPage.jsx SavedPage.jsx ProfilePage.jsx
      TitlePage.jsx WatchPage.jsx
  App.jsx                     # composition root saja: ThemeProvider + Router + wiring
  main.jsx
```

## Styling: SEMUA Emotion, tanpa CSS biasa
- `src/styles.css` sudah DIHAPUS. Tidak ada lagi import `.css` di proyek ini.
- Semua komponen memakai `styled()` / `css()` / `keyframes` dari
  `@emotion/react` + `@emotion/styled`, dengan token dari `theme.js`
  (warna, jarak, radius, tipografi, shadow). Satu-satunya gaya global
  adalah `<Global>` dari Emotion di `App.jsx`, yang isinya dari `theme.js`.

## UI standar TikTok
- Feed vertikal full-screen, scroll-snap, 1 reel = 1 layar, progress bar tipis di atas
- Rel aksi kanan: Like, Komentar, Bookmark, Bagikan — vertikal, ikon di
  lingkaran + label angka di bawahnya, tombol minimal 48px
- Like standar: ketuk hati = hati merah terisi + animasi scale; ketuk ganda
  (double-tap) pada area video = hati besar muncul di tengah lalu menghilang
  + like aktif; angka like berubah; state tersimpan di localStorage
- Info di kiri bawah: badge genre, Episode x / total, rating, judul tebal,
  sinopsis max 3 baris, tombol Tonton / Daftar Episode
- Bottom nav: ikon + label, aktif putih terang, non-aktif redup, safe-area
- Detail judul sebagai sheet dari bawah (sebagai halaman rute), grid episode
  jelas gratis vs terkunci, komentar sebagai sheet, modal unlock jelas
- Mobile-first max 430px, desktop = kolom HP di tengah, dark theme

## Fitur yang jalan
Player (play/pause, seek, mute, fullscreen, kecepatan 1-2x, subtitle CC
on/off, lanjut episode otomatis, simpan progress), feed, detail + grid
episode, cari + genre, bookmark, profil + Lanjutkan Nonton, komentar +
tambah komentar, bagikan (Web Share / salin link), unlock iklan/koin demo,
localStorage untuk suka/bookmark/unlock/koin/progress.

## Video contoh — bebas lisensi (bukan drama asli)
Bukan cuplikan drama China / film / konten berhak cipta. Footage stok
generik vertikal 360x640 dari Mixkit, lisensi Mixkit (gratis untuk proyek
komersial & non-komersial, tanpa atribusi wajib). Detail per URL, sumber,
dan hasil uji ada di `src/infrastructure/videoSource.js`:
- ceo: https://assets.mixkit.co/videos/13766/13766-360.mp4 (16 dtk)
- dendam: https://assets.mixkit.co/videos/13775/13775-360.mp4 (13 dtk)
- kostum: https://assets.mixkit.co/videos/51814/51814-360.mp4 (10 dtk)
- romantis: https://assets.mixkit.co/videos/51227/51227-360.mp4 (18 dtk)
Uji 2026-10-27: keempat URL HEAD 200 video/mp4, Range 206, dimensi
dicek ffprobe 360x640.

## Yang harus diganti saat produksi asli
- `src/infrastructure/videoSource.js` → ganti URL Mixkit dengan HLS
  dari Bunny Stream / Cloudflare Stream untuk tiap judul
- Subtitle di `videoSource.js` → subtitle / track VTT asli per episode
- Koin, unlock, komentar, dan login → API backend + pembayaran QRIS
- Poster gradient → poster / thumbnail video asli
