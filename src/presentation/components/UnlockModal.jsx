import styled from '@emotion/styled'
import { Button, Dialog } from 'react-aria-components'
import { IconLock, IconPlay } from '../../icons.jsx'
import { CenterModal, CenterOverlay } from './aria.jsx'

// Modal unlock sebagai Dialog React Aria: focus trap, Escape menutup,
// klik luar menutup, role="dialog" + aria-label otomatis dari Dialog.
const H2 = styled.h2`margin: 0 0 ${(p) => p.theme.space.sm}px; display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.title}px;`
const P = styled.p`margin: 0 0 ${(p) => p.theme.space.lg}px; color: ${(p) => p.theme.colors.muted}; line-height: 1.6;`
const BtnPlay = styled(Button)`
  width: 100%; min-height: ${(p) => p.theme.touch}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px;
`
const BtnGhost = styled(Button)`
  width: 100%; min-height: ${(p) => p.theme.touch}px; margin-top: ${(p) => p.theme.space.sm}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.surface2}; border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.text}; font-weight: 700;
`

export default function UnlockModal({ episode, onAd, onLater }) {
  return (
    <CenterOverlay isOpen isDismissable onOpenChange={(open) => { if (!open) onLater() }}>
      <CenterModal>
        <Dialog aria-label={`Buka Episode ${episode.ep}`}>
          <H2><IconLock size={20} /> Buka Episode {episode.ep}</H2>
          <P>Tonton 1 iklan singkat untuk membuka episode ini, gratis. Atau pakai 10 koin dari feed.</P>
          <BtnPlay onPress={onAd}><IconPlay size={16} /> Nonton Iklan (Demo)</BtnPlay>
          <BtnGhost onPress={onLater}>Nanti Saja</BtnGhost>
        </Dialog>
      </CenterModal>
    </CenterOverlay>
  )
}
