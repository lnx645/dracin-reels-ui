import { Global, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { globalStyles, theme } from './theme.js'
import BottomNav from './presentation/components/BottomNav.jsx'
import Toast from './presentation/components/Toast.jsx'
import TopBar from './presentation/components/TopBar.jsx'
import { useAppState } from './presentation/hooks/useAppState.js'
import FeedPage from './presentation/pages/FeedPage.jsx'
import ProfilePage from './presentation/pages/ProfilePage.jsx'
import SavedPage from './presentation/pages/SavedPage.jsx'
import SearchPage from './presentation/pages/SearchPage.jsx'
import TitlePage from './presentation/pages/TitlePage.jsx'
import WatchPage from './presentation/pages/WatchPage.jsx'

// COMPOSITION ROOT saja: wiring repository (lewat hook) + router + shell.
// Tanpa logika bisnis, tanpa styling inline berantakan — semua gaya di
// theme.js dan komponen Emotion masing-masing.
const Shell = styled.div`
  width: 100%; max-width: ${(p) => p.theme.phone}px; margin: 0 auto;
  height: 100dvh; background: ${(p) => p.theme.colors.bg};
  display: flex; flex-direction: column; overflow: hidden;
  @media (min-width: 431px) {
    border-left: 1px solid ${(p) => p.theme.colors.border};
    border-right: 1px solid ${(p) => p.theme.colors.border};
  }
`
const Content = styled.div`flex: 1; min-height: 0; display: flex; flex-direction: column; overflow-y: auto;`

function AppShell() {
  const state = useAppState()
  const location = useLocation()
  const isWatch = location.pathname.startsWith('/watch')

  return (
    <Shell>
      {!isWatch && <TopBar coins={state.coins} onCoinClick={() => state.showToast(`Koin kamu: ${state.coins} — beli koin via QRIS (demo UI)`)} />}
      <Content>
        <Routes>
          <Route path="/" element={<FeedPage state={state} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved" element={<SavedPage state={state} />} />
          <Route path="/profile" element={<ProfilePage state={state} />} />
          <Route path="/title/:titleId" element={<TitlePage state={state} />} />
          <Route path="/watch/:titleId/:episode" element={<WatchPage state={state} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
      {!isWatch && <BottomNav />}
      <Toast message={state.toast} />
    </Shell>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
