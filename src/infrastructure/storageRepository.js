// LocalStorageRepository — satu-satunya akses ke localStorage.
// Lapisan presentasi tidak boleh memanggil localStorage langsung.
function read(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null')
    return v === null ? fallback : v
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Penyimpanan penuh / privat: abaikan, state di memori tetap jalan.
  }
}

export const storageRepository = {
  loadSet: (key) => new Set(read(key, [])),
  saveSet: (key, set) => write(key, [...set]),
  loadNumber: (key, fallback) => read(key, fallback),
  saveNumber: (key, value) => write(key, value),
  loadObject: (key, fallback) => read(key, fallback),
  saveObject: (key, value) => write(key, value),
  loadComments: (fallback) => read('dr-comments', fallback),
  saveComments: (comments) => write('dr-comments', comments),
}

export const STORAGE_KEYS = {
  liked: 'dr-liked',
  saved: 'dr-saved',
  unlocked: 'dr-unlocked',
  coins: 'dr-coins',
  progress: 'dr-progress',
}
