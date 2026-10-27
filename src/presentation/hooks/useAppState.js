import { useCallback, useEffect, useState } from 'react'
import { UNLOCK_COIN_COST } from '../../domain/rules.js'
import { MOCK_COMMENTS } from '../../infrastructure/seedData.js'
import { STORAGE_KEYS, storageRepository } from '../../infrastructure/storageRepository.js'

// Satu-satunya state aplikasi. Halaman & komponen hanya menerima
// state + aksi ini lewat props — tidak ada yang mengelola localStorage sendiri.
export function useAppState() {
  const [liked, setLiked] = useState(() => storageRepository.loadSet(STORAGE_KEYS.liked))
  const [saved, setSaved] = useState(() => storageRepository.loadSet(STORAGE_KEYS.saved))
  const [unlocked, setUnlocked] = useState(() => storageRepository.loadSet(STORAGE_KEYS.unlocked))
  const [coins, setCoins] = useState(() => storageRepository.loadNumber(STORAGE_KEYS.coins, 120))
  const [progress, setProgress] = useState(() => storageRepository.loadObject(STORAGE_KEYS.progress, {}))
  const [comments, setComments] = useState(() => storageRepository.loadComments(MOCK_COMMENTS))
  const [toast, setToast] = useState('')

  useEffect(() => storageRepository.saveSet(STORAGE_KEYS.liked, liked), [liked])
  useEffect(() => storageRepository.saveSet(STORAGE_KEYS.saved, saved), [saved])
  useEffect(() => storageRepository.saveSet(STORAGE_KEYS.unlocked, unlocked), [unlocked])
  useEffect(() => storageRepository.saveNumber(STORAGE_KEYS.coins, coins), [coins])
  useEffect(() => storageRepository.saveObject(STORAGE_KEYS.progress, progress), [progress])
  useEffect(() => storageRepository.saveComments(comments), [comments])

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2800)
  }, [])

  const toggleInSet = (set, fn, id) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    fn(next)
    return next.has(id)
  }

  const toggleLike = useCallback((id) => toggleInSet(liked, setLiked, id), [liked])
  const toggleSave = useCallback((id) => toggleInSet(saved, setSaved, id), [saved])

  const unlockWithCoins = useCallback((episode) => {
    if (coins < UNLOCK_COIN_COST) return false
    setCoins(coins - UNLOCK_COIN_COST)
    setUnlocked(new Set(unlocked).add(episode.id))
    return true
  }, [coins, unlocked])

  const unlockWithAd = useCallback((episode) => {
    setUnlocked(new Set(unlocked).add(episode.id))
  }, [unlocked])

  const recordProgress = useCallback((id, t, d) => {
    setProgress((p) => ({ ...p, [id]: { t: Math.floor(t), d: Math.floor(d || 1) } }))
  }, [])

  const addComment = useCallback((text) => {
    if (!text.trim()) return
    setComments((c) => [{ user: 'Kamu', text }, ...c])
  }, [])

  const shareEpisode = useCallback(async (title, ep) => {
    const text = `Nonton ${title} Episode ${ep} di DracinReels`
    try {
      if (navigator.share) await navigator.share({ title: 'DracinReels', text })
      else {
        await navigator.clipboard.writeText(text)
        showToast('Link episode disalin')
      }
    } catch {
      showToast('Link episode disalin')
    }
  }, [showToast])

  return {
    liked, saved, unlocked, coins, progress, comments, toast,
    showToast, toggleLike, toggleSave, unlockWithCoins, unlockWithAd,
    recordProgress, addComment, shareEpisode,
  }
}
