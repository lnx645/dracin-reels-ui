import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Button } from 'react-aria-components'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCoin, IconLock, IconPlay, IconStar } from '../../icons.jsx'
import { UNLOCK_COIN_COST, progressPercent } from '../../domain/rules.js'
import { titleById } from '../../infrastructure/seedData.js'
import Poster from './Poster.jsx'
import ReelActions from './ReelActions.jsx'

const burst = keyframes`
  0% { transform: scale(0.4); opacity: 0; }
  30% { transform: scale(1.2); opacity: 1; }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.1); opacity: 0; }
`
const Reel = styled.article`
  position: relative; height: 100%; scroll-snap-align: start; scroll-snap-stop: always;
  overflow: hidden; background: ${(p) => p.theme.colors.bg}; flex: 0 0 auto;
`
const PosterFull = styled(Poster)`position: absolute; inset: 0; width: 100%; height: 100%;`
const Shade = styled.div`
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.75) 100%);
`
const Progress = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 4;
  background: rgba(255,255,255,0.25);
  i { display: block; height: 100%; background: ${(p) => p.theme.colors.accent}; }
`
const BurstHeart = styled.div`
  position: absolute; left: 50%; top: 42%; z-index: 5; pointer-events: none;
  transform: translate(-50%, -50%); color: ${(p) => p.theme.colors.like};
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5));
  animation: ${burst} 0.8s ease forwards;
`
const Info = styled.div`
  position: absolute; left: ${(p) => p.theme.space.lg}px; right: 88px; bottom: ${(p) => p.theme.space.lg}px; z-index: 2;
`
const Meta = styled.div`display: flex; flex-wrap: wrap; gap: ${(p) => p.theme.space.sm}px; margin-bottom: ${(p) => p.theme.space.sm}px;`
const Pill = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  font-size: ${(p) => p.theme.font.xs}px; font-weight: 700; padding: 4px 10px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.gold ? p.theme.colors.overlay : p.theme.colors.accent};
  color: ${(p) => p.gold ? p.theme.colors.gold : p.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.border};
`
const Title = styled.h2`
  margin: 0 0 ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.title}px; line-height: 1.25;
`
const Desc = styled.p`
  margin: 0 0 ${(p) => p.theme.space.md}px; font-size: ${(p) => p.theme.font.base}px; line-height: 1.5; color: rgba(255,255,255,0.9);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`
const Row = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px; flex-wrap: wrap;`
const BtnPlay = styled(Link)`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
  display: inline-flex; align-items: center; gap: 6px;
`
const BtnGhost = styled(Link)`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.overlay}; border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.white}; font-weight: 700;
  display: inline-flex; align-items: center; gap: 6px;
`
const LockedBox = styled.div`
  background: ${(p) => p.theme.colors.overlay}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.md}px; padding: ${(p) => p.theme.space.md}px;
`
const LockedTitle = styled.div`font-weight: 900; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;`
const LockedText = styled.p`margin: 0 0 ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.sm}px; color: ${(p) => p.theme.colors.muted}; line-height: 1.5;`
const BtnAd = styled(Button)`
  min-height: 44px; padding: 0 ${(p) => p.theme.space.md}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.white}; color: ${(p) => p.theme.colors.black}; font-weight: 800;
`
const BtnCoin = styled(Button)`
  min-height: 44px; padding: 0 ${(p) => p.theme.space.md}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.accent}; color: ${(p) => p.theme.colors.white}; font-weight: 800;
  display: inline-flex; align-items: center; gap: 6px;
`
const Hint = styled.div`margin-top: ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.xs}px; color: ${(p) => p.theme.colors.muted};`

export default function ReelCard({ item, state, onComment, onUnlockRequest }) {
  const t = titleById(item.titleId)
  const open = item.free || state.unlocked.has(item.id)
  const liked = state.liked.has(item.id)
  const saved = state.saved.has(t.id)
  const pct = progressPercent(state.progress[item.id])
  const [burstKey, setBurstKey] = useState(0)
  const lastTap = useRef(0)

  // Double-tap standar TikTok: dua ketukan <300ms di area video = like + burst.
  // Ketukan tunggal tidak melakukan apa-apa (tombol Tonton tetap jalur utama ke player).
  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      if (!state.liked.has(item.id)) state.toggleLike(item.id)
      setBurstKey((k) => k + 1)
      lastTap.current = 0
    } else {
      lastTap.current = now
    }
  }

  return (
    <Reel>
      <div onClick={handleTap} style={{ position: 'absolute', inset: 0 }}>
        <PosterFull title={t} size={96} />
      </div>
      <Shade />
      <Progress><i style={{ width: `${item.ep === 1 ? 12 : pct}%` }} /></Progress>
      {burstKey > 0 && <BurstHeart key={burstKey}><svg width="96" height="96" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.5 0 3 .8 4.3 2.3 1.3-1.5 2.8-2.3 4.3-2.3 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z" /></svg></BurstHeart>}
      <ReelActions
        item={item} liked={liked} saved={saved}
        onLike={() => state.toggleLike(item.id)}
        onComment={onComment}
        onSave={() => { state.toggleSave(t.id); state.showToast(state.saved.has(t.id) ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark') }}
        onShare={() => state.shareEpisode(t.title, item.ep)}
      />
      <Info>
        <Meta>
          <Pill>{t.genre}</Pill>
          <Pill>Episode {item.ep} / {t.episodes}</Pill>
          <Pill gold><IconStar size={12} /> {t.rating}</Pill>
          {pct > 0 && <Pill>Lanjut {pct}%</Pill>}
        </Meta>
        <Title><Link to={`/title/${t.id}`}>{t.title}</Link></Title>
        <Desc>{t.desc}</Desc>
        {!open ? (
          <LockedBox>
            <LockedTitle><IconLock size={16} /> Episode terkunci</LockedTitle>
            <LockedText>Episode 1–5 gratis. Buka episode ini dengan iklan atau koin.</LockedText>
            <Row>
              <BtnAd onPress={() => onUnlockRequest(item)} aria-label={`Buka Episode ${item.ep} dengan iklan`}>Nonton Iklan</BtnAd>
              <BtnCoin onPress={() => {
                if (!state.unlockWithCoins(item)) { state.showToast('Koin tidak cukup — beli koin dulu'); return }
                state.showToast(`Episode terbuka! −${UNLOCK_COIN_COST} koin`)
              }}><IconCoin size={16} /> {UNLOCK_COIN_COST} Koin</BtnCoin>
            </Row>
          </LockedBox>
        ) : (
          <Row>
            <BtnPlay to={`/watch/${t.id}/${item.ep}`}><IconPlay size={16} /> {pct > 0 ? 'Lanjutkan' : 'Tonton'} Episode {item.ep}</BtnPlay>
            <BtnGhost to={`/title/${t.id}`}>Daftar Episode</BtnGhost>
          </Row>
        )}
        <Hint>Geser ke atas untuk episode berikutnya · Ketuk 2x untuk suka</Hint>
      </Info>
    </Reel>
  )
}
