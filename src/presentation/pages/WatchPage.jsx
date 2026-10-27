import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconClose, IconCoin, IconStar } from '../../icons.jsx'
import { buildEpisode, isEpisodeUnlocked, UNLOCK_COIN_COST } from '../../domain/rules.js'
import { FEED, feedItemById, titleById } from '../../infrastructure/seedData.js'
import { getVideoSource } from '../../infrastructure/videoSource.js'
import CommentsSheet from '../components/CommentsSheet.jsx'
import Player from '../components/Player.jsx'
import ReelActions from '../components/ReelActions.jsx'
import UnlockModal from '../components/UnlockModal.jsx'

// HALAMAN PLAYER — rute /watch/:titleId/:episode. Bukan modal.
// Back browser kembali ke halaman sebelumnya; URL ini bisa dibuka
// langsung / dibagikan (deep link) berkat rewrites SPA di vercel.json.
const Page = styled.main`display: flex; flex-direction: column; height: 100dvh; background: ${(p) => p.theme.colors.black}; position: relative;`
const Top = styled.div`
  position: absolute; top: 0; left: 0; right: 0; z-index: 5; max-width: ${(p) => p.theme.phone}px; margin: 0 auto;
  display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px; padding: ${(p) => p.theme.space.md}px;
  background: linear-gradient(180deg, rgba(0,0,0,0.7), transparent);
`
const BackBtn = styled.button`
  width: 44px; height: 44px; min-width: 44px; border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.overlay}; color: ${(p) => p.theme.colors.white};
  display: grid; place-items: center;
`
const TopTitle = styled.div`flex: 1; b { display: block; font-size: ${(p) => p.theme.font.base}px; } span { font-size: ${(p) => p.theme.font.xs}px; color: rgba(255,255,255,0.75); }`
const RailWrap = styled.div`position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column;`
const Locked = styled.div`flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${(p) => p.theme.space.md}px; padding: ${(p) => p.theme.space.xl}px; text-align: center;`
const LockedP = styled.p`color: ${(p) => p.theme.colors.muted}; line-height: 1.6; max-width: 320px;`
const BtnPlay = styled.button`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
`
const BtnGhost = styled.button`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.white}; font-weight: 700;
  display: inline-flex; align-items: center; gap: 6px;
`

export default function WatchPage({ state }) {
  const { titleId, episode } = useParams()
  const navigate = useNavigate()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [unlockOpen, setUnlockOpen] = useState(false)

  const title = titleById(titleId)
  const epNum = Number(episode)
  if (!title || !Number.isFinite(epNum) || epNum < 1) {
    return <Locked><h2>Episode tidak ditemukan</h2><BtnGhost onClick={() => navigate('/')}>Kembali ke Beranda</BtnGhost></Locked>
  }
  const feedItem = feedItemById(`${titleId}-${epNum}`)
  const ep = buildEpisode(titleId, epNum, feedItem)
  const open = isEpisodeUnlocked(ep, state.unlocked)
  const src = getVideoSource(titleId)

  const handleEnded = () => {
    const idx = FEED.findIndex((f) => f.id === ep.id)
    const next = FEED[idx + 1]
    if (!next) { state.showToast('Episode terakhir di feed demo ini'); return }
    const nextEp = buildEpisode(next.titleId, next.ep, next)
    if (isEpisodeUnlocked(nextEp, state.unlocked)) navigate(`/watch/${next.titleId}/${next.ep}`)
    else setUnlockOpen(true)
  }

  if (!open) {
    return (
      <Page>
        <Top>
          <BackBtn onClick={() => navigate(-1)} aria-label="Kembali"><IconClose /></BackBtn>
          <TopTitle><b>{title.title}</b><span>Episode {epNum} / {title.episodes} · {title.genre}</span></TopTitle>
        </Top>
        <Locked>
          <h2>Episode {epNum} terkunci</h2>
          <LockedP>Episode 1–5 gratis. Buka episode ini dengan iklan atau {UNLOCK_COIN_COST} koin.</LockedP>
          <BtnPlay onClick={() => { state.unlockWithAd(ep); state.showToast('Iklan selesai (demo) — episode terbuka!') }}>Nonton Iklan (Demo)</BtnPlay>
          <BtnGhost onClick={() => {
            if (!state.unlockWithCoins(ep)) { state.showToast('Koin tidak cukup — beli koin dulu'); return }
            state.showToast(`Episode terbuka! −${UNLOCK_COIN_COST} koin`)
          }}><IconCoin size={16} /> {UNLOCK_COIN_COST} Koin</BtnGhost>
          <BtnGhost onClick={() => navigate(-1)}>Kembali</BtnGhost>
        </Locked>
      </Page>
    )
  }

  return (
    <Page>
      <Top>
        <BackBtn onClick={() => navigate(-1)} aria-label="Kembali"><IconClose /></BackBtn>
        <TopTitle><b>{title.title}</b><span>Episode {epNum} / {title.episodes} · {title.genre} · ★ {title.rating}</span></TopTitle>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f5c518', fontSize: 13, fontWeight: 800 }}><IconStar size={12} /> {title.rating}</span>
      </Top>
      <RailWrap>
        <Player
          src={src.url}
          sourceLabel={`Video contoh: ${src.source} · ${src.license} · ${src.orientation}`}
          onEnded={handleEnded}
          onProgress={(t, d) => state.recordProgress(ep.id, t, d)}
        />
      </RailWrap>
      <ReelActions
        item={ep} liked={state.liked.has(ep.id)} saved={state.saved.has(titleId)}
        onLike={() => state.toggleLike(ep.id)}
        onComment={() => setCommentsOpen(true)}
        onSave={() => { state.toggleSave(titleId); state.showToast(state.saved.has(titleId) ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark') }}
        onShare={() => state.shareEpisode(title.title, epNum)}
      />
      {commentsOpen && (
        <CommentsSheet
          episode={ep} title={title.title} comments={state.comments} onClose={() => setCommentsOpen(false)}
          onAdd={(text) => { state.addComment(text); state.showToast('Komentar terkirim (demo, hanya di perangkat ini)') }}
        />
      )}
      {unlockOpen && (
        <UnlockModal
          episode={buildEpisode(FEED[FEED.findIndex((f) => f.id === ep.id) + 1].titleId, FEED[FEED.findIndex((f) => f.id === ep.id) + 1].ep)}
          onAd={() => {
            const next = FEED[FEED.findIndex((f) => f.id === ep.id) + 1]
            state.unlockWithAd(buildEpisode(next.titleId, next.ep, next)); setUnlockOpen(false)
            navigate(`/watch/${next.titleId}/${next.ep}`)
          }}
          onLater={() => setUnlockOpen(false)}
        />
      )}
    </Page>
  )
}
