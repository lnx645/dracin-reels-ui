export const TITLES = [
  {
    id: 'ceo',
    title: 'Pewaris Rahasia Sang CEO',
    genre: 'CEO',
    desc: 'Setelah 3 tahun disakiti, Sasha menceraikan suami CEO-nya dan bangkit. Saat sang mantan menyesal, Sasha sudah jauh di luar jangkauannya.',
    episodes: 80,
    rating: 4.8,
    emoji: '👑',
    gradient: 'linear-gradient(160deg, #ff4d2e 0%, #ff8a00 55%, #7a1a0a 100%)',
  },
  {
    id: 'dendam',
    title: 'Menantu yang Diremehkan',
    genre: 'Balas Dendam',
    desc: 'Menantu miskin yang selalu dihina ternyata pewaris tersembunyi. Satu per satu, semua yang meremehkannya harus menelan penyesalan.',
    episodes: 64,
    rating: 4.9,
    emoji: '⚔️',
    gradient: 'linear-gradient(160deg, #7c3aed 0%, #2563eb 55%, #0f0a2e 100%)',
  },
  {
    id: 'kostum',
    title: 'Putri Istana yang Terbuang',
    genre: 'Kostum',
    desc: 'Putri yang dibuang ke istana terpencil membongkar konspirasi, membangun usaha, dan kembali merebut takhtanya.',
    episodes: 72,
    rating: 4.7,
    emoji: '🏮',
    gradient: 'linear-gradient(160deg, #0d9488 0%, #b45309 55%, #1a0f02 100%)',
  },
  {
    id: 'romantis',
    title: 'Cinta Setelah Pernikahan Kilat',
    genre: 'Romantis',
    desc: 'Pernikahan kilat demi menyelamatkan keluarga berubah jadi cinta yang sesungguhnya — tapi masa lalu keduanya belum selesai.',
    episodes: 56,
    rating: 4.6,
    emoji: '💖',
    gradient: 'linear-gradient(160deg, #ec4899 0%, #8b5cf6 55%, #2e0a1e 100%)',
  },
];

// Feed MVP: 10 episode pertama dari 2 judul, episode 1-5 gratis, 6+ terkunci
export const FEED = [
  { id: 'ceo-1', titleId: 'ceo', ep: 1, free: true, likes: '128rb', comments: 3421 },
  { id: 'ceo-2', titleId: 'ceo', ep: 2, free: true, likes: '96rb', comments: 2104 },
  { id: 'ceo-5', titleId: 'ceo', ep: 5, free: true, likes: '88rb', comments: 1876 },
  { id: 'ceo-6', titleId: 'ceo', ep: 6, free: false, likes: '74rb', comments: 1543 },
  { id: 'dendam-1', titleId: 'dendam', ep: 1, free: true, likes: '210rb', comments: 5210 },
  { id: 'dendam-6', titleId: 'dendam', ep: 6, free: false, likes: '132rb', comments: 2987 },
  { id: 'kostum-1', titleId: 'kostum', ep: 1, free: true, likes: '154rb', comments: 4102 },
  { id: 'kostum-7', titleId: 'kostum', ep: 7, free: false, likes: '91rb', comments: 2033 },
];

export function titleById(id) {
  return TITLES.find((t) => t.id === id);
}
