import styled from '@emotion/styled'
import { Label, Modal, ModalOverlay } from 'react-aria-components'

// Primitif React Aria bersama — styling SELALU lewat Emotion + theme,
// tidak pernah lewat file CSS terpisah. Komponen RAC merender elemen
// native (button/input/div) sehingga outline focus-visible dari
// globalStyles di theme.js tetap berlaku, ditambah data-focus-visible
// bawaan React Aria.

// Label yang hanya dibaca screen reader (bukan disembunyikan dengan
// display:none, supaya tetap jadi accessible name untuk input).
export const VisuallyHiddenLabel = styled(Label)`
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
`

// Overlay sheet dari bawah (komentar). Focus trap + Escape menutup
// ditangani React Aria ModalOverlay/Modal/Dialog, bukan backdrop manual.
export const SheetOverlay = styled(ModalOverlay)`
  position: fixed; inset: 0; z-index: 60; background: ${(p) => p.theme.colors.overlay};
  display: flex; align-items: flex-end; justify-content: center;
`
export const SheetModal = styled(Modal)`
  width: 100%; max-width: ${(p) => p.theme.phone}px; max-height: 88dvh; overflow-y: auto;
  background: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.radius.lg}px ${(p) => p.theme.radius.lg}px 0 0;
  outline: none;
`

// Overlay modal terpusat (unlock episode).
export const CenterOverlay = styled(ModalOverlay)`
  position: fixed; inset: 0; z-index: 70; background: ${(p) => p.theme.colors.overlay};
  display: flex; align-items: center; justify-content: center;
  padding: ${(p) => p.theme.space.lg}px;
`
export const CenterModal = styled(Modal)`
  width: 100%; max-width: 360px; background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.lg}px;
  padding: ${(p) => p.theme.space.xl}px;
  outline: none;
`
