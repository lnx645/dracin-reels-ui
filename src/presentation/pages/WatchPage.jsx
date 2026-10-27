import styled from '@emotion/styled'
import { Button } from 'react-aria-components'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconClose, IconCoin, IconNext, IconStar } from '../../icons.jsx'
import { buildEpisode, isEpisodeUnlocked, UNLOCK_COIN_COST } from '../../domain/rules.js'
import { FEED, feedItemById, titleById } from '../../infrastructure/seedData.js'
import { getVideoSource } from '../../infrastructure/videoSource.js'
import CommentsSheet from '../components/CommentsSheet.jsx'
import Player from '../components/Player.jsx'
import ReelActions from '../components/ReelActions.jsx'
import UnlockModal from '../components/UnlockModal.jsx'

// HALAMAN PLAYER — rute /watch/:titleId/:episode. Bukan modal.
// Desain imersif ala TikTok: Player mengisi penuh layar (video cover 9:16,
// gradasi atas-bawah), Top hanya back + judul, Info duduk di kiri bawah
// DI DALAM BottomStack Player (di atas subtitle, di atas progress tipis),
// rel aksi kanan duduk di atas Info. Tidak ada lagi panel kontrol besar
// di bawah video dan tidak ada lagi teks catatan panjang di halaman.
// Back browser kembali ke halaman sebelumnya; URL bisa dibuka langsung.
const Page = styled.main`
  position: relative; height: 100%; background: ${(p) => p.theme.colors.black}; overflow: hidden;
`
const Top = styled.div`
  position: absolute; top: 0; left: 0; right: 0; z-index: 5;
  display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px; padding: ${(p) => p.theme.space.md}px;
  pointer-events: none;
  & > * { pointer-events: auto; }
`
const BackBtn = styled(Button)`
  width: 44px; height: 44px; min-width: 44px; border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.overlay}; color: ${(p) => p.theme.colors.white};
  display: grid; place-items: center;
`
const TopTitle = styled.div`
  flex: 1; min-width: 0;
  b { display: block; font-size: ${(p) => p.theme.font.base}px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  span { font-size: ${(p) => p.theme.font.xs}px; color: rgba(255,255,255,0.75); }
`
const Info = styled.div`display: flex; flex-direction: column; gap: ${(p) => p.theme.space.sm}px;`
const Meta = styled.div`display: flex; flex-wrap: wrap; gap: ${(p) => p.theme.space.sm}px;`
const Pill = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  font-size: ${(p) => p.theme.font.xs}px; font-weight: 700; padding: 4px 10px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.gold ? p.theme.colors.overlay : p.theme.colors.accent};
  color: ${(p) => p.gold ? p.theme.colors.gold : p.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.border};
`
const Title = styled.h2`margin: 0; font-size: ${(p) => p.theme.font.title}px; line-height: 1.25; text-shadow: 0 2px 8px rgba(0,0,0,0.6);`
const Desc = styled.p`
  margin: 0; font-size: ${(p) => p.theme.font.base}px; line-height: 1.5; color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
`
const NextBtn = styled(Button)`
  align-self: flex-start; min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px;
  border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
  display: inline-flex; align-items: center; gap: 6px;
`
const SourceTag = styled.span`font-size: ${(p) => p.theme.font.xs}px; color: rgba(255,255,255,0.55);`
const Locked = styled.div`height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${(p) => p.theme.space.md}px; padding: ${(p) => p.theme.space.xl}px; text-align: center;`
const LockedP = styled.p`color: ${(p) => p.theme.colors.muted}; line-height: 1.6; max-width: 320px;`
const BtnPlay = styled(Button)`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
`
const BtnGhost = styled(Button)`
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
    return <Page><Locked><h2>Episode tidak ditemukan</h2><BtnGhost onPress={() => navigate('/')}>Kembali ke Beranda</BtnGhost></Locked></Page>
  }
  const feedItem = feedItemById(`${titleId}-${epNum}`)
  const ep = buildEpisode(titleId, epNum, feedItem)
  const open = isEpisodeUnlocked(ep, state.unlocked)
  const src = getVideoSource(titleId)

  const idx = FEED.findIndex((f) => f.id === ep.id)
  const nextFeed = idx >= 0 ? FEED[idx + 1] : undefined
  const goNext = () => {
    if (!nextFeed) { state.showToast('Episode terakhir di feed demo ini'); return }
    const nextEp = buildEpisode(nextFeed.titleId, nextFeed.ep, nextFeed)
    if (isEpisodeUnlocked(nextEp, state.unlocked)) navigate(`/watch/${nextFeed.titleId}/${nextFeed.ep}`)
    else setUnlockOpen(true)
  }
  const handleEnded = () => {
    if (!nextFeed) { state.showToast('Episode terakhir di feed demo ini'); return }
    goNext()
  }

  if (!open) {
    return (
      <Page>
        <Top>
          <BackBtn onPress={() => navigate(-1)} aria-label="Kembali"><IconClose /></BackBtn>
          <TopTitle><b>{title.title}</b><span>Episode {epNum} / {title.episodes} · {title.genre}</span></TopTitle>
        </Top>
        <Locked>
          <h2>Episode {epNum} terkunci</h2>
          <LockedP>Episode 1–5 gratis. Buka episode ini dengan iklan atau {UNLOCK_COIN_COST} koin.</LockedP>
          <BtnPlay onPress={() => { state.unlockWithAd(ep); state.showToast('Iklan selesai (demo) — episode terbuka!') }}>Nonton Iklan (Demo)</BtnPlay>
          <BtnGhost onPress={() => {
            if (!state.unlockWithCoins(ep)) { state.showToast('Koin tidak cukup — beli koin dulu'); return }
            state.showToast(`Episode terbuka! −${UNLOCK_COIN_COST} koin`)
          }}><IconCoin size={16} /> {UNLOCK_COIN_COST} Koin</BtnGhost>
          <BtnGhost onPress={() => navigate(-1)}>Kembali</BtnGhost>
        </Locked>
      </Page>
    )
  }

  return (
    <Page>
      <Player
        src={src.url}
        onEnded={handleEnded}
        onProgress={(t, d) => state.recordProgress(ep.id, t, d)}
      >
        <Info>
          <Meta>
            <Pill>{title.genre}</Pill>
            <Pill>Episode {epNum} / {title.episodes}</Pill>
            <Pill gold><IconStar size={12} /> {title.rating}</Pill>
          </Meta>
          <Title>{title.title}</Title>
          <Desc>{title.desc}</Desc>
          {nextFeed && (
            <NextBtn onPress={goNext} aria-label={`Lanjut ke Episode ${nextFeed.ep}`}>
              Episode Berikutnya <IconNext size={16} />
            </NextBtn>
          )}
          <SourceTag>Contoh Mixkit</SourceTag>
        </Info>
      </Player>
      <Top>
        <BackBtn onPress={() => navigate(-1)} aria-label="Kembali"><IconClose /></BackBtn>
        <TopTitle><b>{title.title}</b><span>Episode {epNum} / {title.episodes} · {title.genre}</span></TopTitle>
      </Top>
      <ReelActions
        bottom={304}
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
      {unlockOpen && nextFeed && (
        <UnlockModal
          episode={buildEpisode(nextFeed.titleId, nextFeed.ep, nextFeed)}
          onAd={() => {
            state.unlockWithAd(buildEpisode(nextFeed.titleId, nextFeed.ep, nextFeed)); setUnlockOpen(false)
            navigate(`/watch/${nextFeed.titleId}/${nextFeed.ep}`)
          }}
          onLater={() => setUnlockOpen(false)}
        />
      )}
    </Page>
  )
}
