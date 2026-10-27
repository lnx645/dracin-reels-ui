// VideoSource — satu-satunya tempat URL video contoh.
// GANTI URL di bawah ini dengan HLS judul asli (Bunny / Cloudflare Stream)
// saat produksi; tidak ada komponen lain yang boleh meng-hardcode URL video.
//
// Video contoh di bawah ini BUKAN cuplikan drama China / film / konten
// berhak cipta. Ini footage stok generik dari Mixkit, vertikal 9:16,
// 360x640, format MP4 360p — dipilih supaya pas dengan feed reels.
// Lisensi: Mixkit License — gratis untuk proyek komersial maupun
// non-komersial, tanpa atribusi wajib (dicek di halaman lisensi Mixkit).
// Uji akses (2026-10-27, curl): keempat URL HEAD 200 video/mp4 dan
// Range request 206. Dimensi & durasi dicek dengan ffprobe setelah unduh:
//   13766: 360x640, 16 dtk | 13775: 360x640, 13 dtk
//   51814: 360x640, 10 dtk | 51227: 360x640, 18 dtk
export const VIDEO_SOURCES = {
  // Halaman kategori "vertical intro" Mixkit — footage intro/abstrak vertikal.
  ceo: {
    url: 'https://assets.mixkit.co/videos/13766/13766-360.mp4',
    source: 'Mixkit',
    license: 'Mixkit License (gratis komersial & non-komersial)',
    orientation: 'vertical 360x640',
  },
  // Halaman kategori "vertical intro" Mixkit — footage intro/abstrak vertikal.
  dendam: {
    url: 'https://assets.mixkit.co/videos/13775/13775-360.mp4',
    source: 'Mixkit',
    license: 'Mixkit License (gratis komersial & non-komersial)',
    orientation: 'vertical 360x640',
  },
  // Halaman kategori "vertical intro" Mixkit — footage intro/abstrak vertikal.
  kostum: {
    url: 'https://assets.mixkit.co/videos/51814/51814-360.mp4',
    source: 'Mixkit',
    license: 'Mixkit License (gratis komersial & non-komersial)',
    orientation: 'vertical 360x640',
  },
  // Halaman kategori "vertical lovely" Mixkit — footage pasangan / romantis vertikal.
  romantis: {
    url: 'https://assets.mixkit.co/videos/51227/51227-360.mp4',
    source: 'Mixkit',
    license: 'Mixkit License (gratis komersial & non-komersial)',
    orientation: 'vertical 360x640',
  },
}

export function getVideoSource(titleId) {
  return VIDEO_SOURCES[titleId] || VIDEO_SOURCES.ceo
}

export const SUBTITLE_LINES = [
  'Ini subtitle Indonesia contoh — ganti dengan subtitle asli episode.',
  'Setiap episode berakhir di cliffhanger, supaya penonton lanjut.',
  'Subtitle bisa dimatikan dari tombol CC di player.',
]
