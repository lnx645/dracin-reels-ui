import styled from '@emotion/styled'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FEED, titleById } from '../../infrastructure/seedData.js'
import CommentsSheet from '../components/CommentsSheet.jsx'
import ReelCard from '../components/ReelCard.jsx'
import UnlockModal from '../components/UnlockModal.jsx'

const Feed = styled.main`
  scroll-snap-type: y mandatory; overflow-y: auto; height: 100%;
`
const End = styled.div`padding: ${(p) => p.theme.space.xxl}px ${(p) => p.theme.space.lg}px; text-align: center; p { color: ${(p) => p.theme.colors.muted}; }`
const Btn = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px; min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px;
  border-radius: ${(p) => p.theme.radius.pill}px; font-weight: 800; color: ${(p) => p.theme.colors.white};
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
`

export default function FeedPage({ state }) {
  const [commentsFor, setCommentsFor] = useState(null)
  const [unlockEp, setUnlockEp] = useState(null)

  return (
    <>
      <Feed>
        {FEED.map((item) => (
          <ReelCard
            key={item.id} item={item} state={state}
            onComment={() => setCommentsFor(item)}
            onUnlockRequest={(ep) => setUnlockEp(ep)}
          />
        ))}
        <End>
          <p>Itu dulu untuk demo UI ini.</p>
          <Btn to="/search">Cari Judul Lain →</Btn>
        </End>
      </Feed>
      {commentsFor && (
        <CommentsSheet
          episode={commentsFor} title={titleById(commentsFor.titleId).title}
          comments={state.comments} onClose={() => setCommentsFor(null)}
          onAdd={(text) => { state.addComment(text); state.showToast('Komentar terkirim (demo, hanya di perangkat ini)') }}
        />
      )}
      {unlockEp && (
        <UnlockModal
          episode={unlockEp}
          onAd={() => { state.unlockWithAd(unlockEp); setUnlockEp(null); state.showToast('Iklan selesai (demo) — episode terbuka!') }}
          onLater={() => setUnlockEp(null)}
        />
      )}
    </>
  )
}
