import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, ToggleButton } from 'react-aria-components'
import { IconBookmark, IconBookmarkFilled, IconComment, IconHeart, IconHeartFilled, IconShare } from '../../icons.jsx'
import { formatCount } from '../../domain/rules.js'

const pop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.35); }
  100% { transform: scale(1); }
`

const Rail = styled.div`
  position: absolute; right: ${(p) => p.theme.space.md}px; bottom: 240px; z-index: 3;
  display: flex; flex-direction: column; gap: ${(p) => p.theme.space.lg}px;
`
// Tombol aksi sebagai React Aria: ToggleButton untuk like/bookmark
// (isSelected memberi aria-pressed otomatis), Button untuk komentar/
// bagikan (onPress + keyboard Enter/Space bawaan RAC).
const ActToggle = styled(ToggleButton)`
  background: none; border: none; color: ${(p) => p.theme.colors.white};
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: ${(p) => p.theme.touch}px; min-height: ${(p) => p.theme.touch}px;
  padding: 0;
  small { font-size: 11px; font-weight: 700; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
`
const ActBtn = styled(Button)`
  background: none; border: none; color: ${(p) => p.theme.colors.white};
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: ${(p) => p.theme.touch}px; min-height: ${(p) => p.theme.touch}px;
  padding: 0;
  small { font-size: 11px; font-weight: 700; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
`
const Circle = styled.span`
  width: ${(p) => p.theme.touch}px; height: ${(p) => p.theme.touch}px; border-radius: 50%;
  background: ${(p) => p.theme.colors.overlay}; border: 1px solid ${(p) => p.theme.colors.border};
  display: grid; place-items: center;
  color: ${(p) => p.liked ? p.theme.colors.like : p.theme.colors.white};
  animation: ${(p) => p.liked ? `${pop} 0.35s ease` : 'none'};
`

export default function ReelActions({ item, liked, saved, onLike, onComment, onSave, onShare }) {
  return (
    <Rail role="group" aria-label="Aksi episode">
      <ActToggle isSelected={liked} onChange={onLike} aria-label={liked ? 'Batal suka episode ini' : 'Suka episode ini'}>
        <Circle liked={liked}>{liked ? <IconHeartFilled /> : <IconHeart />}</Circle>
        <small>{formatCount(item.likes)}</small>
      </ActToggle>
      <ActBtn onPress={onComment} aria-label="Buka komentar">
        <Circle><IconComment /></Circle>
        <small>{formatCount(item.comments)}</small>
      </ActBtn>
      <ActToggle isSelected={saved} onChange={onSave} aria-label={saved ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}>
        <Circle>{saved ? <IconBookmarkFilled /> : <IconBookmark />}</Circle>
        <small>Simpan</small>
      </ActToggle>
      <ActBtn onPress={onShare} aria-label="Bagikan episode">
        <Circle><IconShare /></Circle>
        <small>Bagikan</small>
      </ActBtn>
    </Rail>
  )
}
