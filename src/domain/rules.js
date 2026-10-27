// Aturan bisnis MURNI — tanpa React, tanpa DOM, tanpa localStorage.
// Diuji dari logikanya saja, bukan dari tampilan.

export const FREE_EPISODES = 5
export const UNLOCK_COIN_COST = 10

export function isEpisodeUnlocked(episode, unlockedIds) {
  if (!episode) return false
  if (episode.free) return true
  return unlockedIds.has(episode.id)
}

export function episodeId(titleId, ep) {
  return `${titleId}-${ep}`
}

export function buildEpisode(titleId, ep, feedItem) {
  return {
    id: episodeId(titleId, ep),
    titleId,
    ep,
    free: ep <= FREE_EPISODES,
    likes: feedItem ? feedItem.likes : '0',
    comments: feedItem ? feedItem.comments : 0,
  }
}

export function progressPercent(record) {
  if (!record || !record.d) return 0
  return Math.min(100, Math.round((record.t / record.d) * 100))
}

export function formatCount(n) {
  if (typeof n === 'string') return n
  return n.toLocaleString('id-ID')
}

export function initialsOf(title) {
  return title.split(' ').slice(0, 2).map((w) => w[0]).join('')
}
