import styled from '@emotion/styled'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconClose } from '../../icons.jsx'
import { titleById } from '../../infrastructure/seedData.js'
import DetailSheet from '../components/DetailSheet.jsx'
import UnlockModal from '../components/UnlockModal.jsx'

const Page = styled.main`padding-bottom: ${(p) => p.theme.space.lg}px;`
const Back = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px; margin: ${(p) => p.theme.space.md}px ${(p) => p.theme.space.lg}px;
  min-height: 44px; color: ${(p) => p.theme.colors.muted}; font-weight: 700;
`
const NotFound = styled.p`padding: ${(p) => p.theme.space.lg}px; color: ${(p) => p.theme.colors.muted};`

// Halaman detail judul (rute /title/:titleId). Isinya adalah DetailSheet
// — sheet dari bawah secara visual, tapi sebagai halaman router penuh,
// sehingga tombol back browser dan deep link bekerja.
export default function TitlePage({ state }) {
  const { titleId } = useParams()
  const [unlockEp, setUnlockEp] = useState(null)
  const title = titleById(titleId)
  if (!title) return <NotFound>Judul tidak ditemukan.</NotFound>

  return (
    <Page>
      <Back to="/"><IconClose size={18} /> Kembali</Back>
      <DetailSheet title={title} state={state} onUnlockRequest={(ep) => setUnlockEp(ep)} />
      {unlockEp && (
        <UnlockModal
          episode={unlockEp}
          onAd={() => { state.unlockWithAd(unlockEp); setUnlockEp(null); state.showToast('Iklan selesai (demo) — episode terbuka!') }}
          onLater={() => setUnlockEp(null)}
        />
      )}
    </Page>
  )
}
