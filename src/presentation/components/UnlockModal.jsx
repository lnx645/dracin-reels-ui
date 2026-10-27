import styled from '@emotion/styled'
import { IconLock, IconPlay } from '../../icons.jsx'

const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 70; background: ${(p) => p.theme.colors.overlay};
  display: flex; align-items: center; justify-content: center; padding: ${(p) => p.theme.space.lg}px;
`
const Modal = styled.section`
  width: 100%; max-width: 360px; background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border}; border-radius: ${(p) => p.theme.radius.lg}px;
  padding: ${(p) => p.theme.space.xl}px;
`
const H2 = styled.h2`margin: 0 0 ${(p) => p.theme.space.sm}px; display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.title}px;`
const P = styled.p`margin: 0 0 ${(p) => p.theme.space.lg}px; color: ${(p) => p.theme.colors.muted}; line-height: 1.6;`
const BtnPlay = styled.button`
  width: 100%; min-height: ${(p) => p.theme.touch}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px;
`
const BtnGhost = styled.button`
  width: 100%; min-height: ${(p) => p.theme.touch}px; margin-top: ${(p) => p.theme.space.sm}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.surface2}; border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.text}; font-weight: 700;
`

export default function UnlockModal({ episode, onAd, onLater }) {
  return (
    <Backdrop onClick={onLater}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <H2><IconLock size={20} /> Buka Episode {episode.ep}</H2>
        <P>Tonton 1 iklan singkat untuk membuka episode ini, gratis. Atau pakai 10 koin dari feed.</P>
        <BtnPlay onClick={onAd}><IconPlay size={16} /> Nonton Iklan (Demo)</BtnPlay>
        <BtnGhost onClick={onLater}>Nanti Saja</BtnGhost>
      </Modal>
    </Backdrop>
  )
}
