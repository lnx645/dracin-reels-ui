import styled from '@emotion/styled'
import { Button } from 'react-aria-components'
import { Link } from 'react-router-dom'
import { FEED, titleById } from '../../infrastructure/seedData.js'
import { IconCoin, IconUser } from '../../icons.jsx'
import Poster from '../components/Poster.jsx'

const Page = styled.main`padding: ${(p) => p.theme.space.lg}px;`
const Head = styled.div`text-align: center;`
const Avatar = styled.div`
  width: 88px; height: 88px; margin: 0 auto; border-radius: 50%; background: ${(p) => p.theme.colors.surface2};
  display: grid; place-items: center; color: ${(p) => p.theme.colors.muted};
`
const H1 = styled.h1`font-size: ${(p) => p.theme.font.title}px; margin: ${(p) => p.theme.space.md}px 0 ${(p) => p.theme.space.sm}px;`
const Note = styled.p`color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.sm}px; line-height: 1.6;`
const Stats = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: ${(p) => p.theme.space.sm}px; margin: ${(p) => p.theme.space.lg}px 0;`
const Stat = styled.div`
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border}; border-radius: ${(p) => p.theme.radius.md}px;
  padding: ${(p) => p.theme.space.md}px; text-align: center;
  b { display: block; font-size: ${(p) => p.theme.font.title}px; }
  span { color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.xs}px; }
`
const Actions = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px; flex-wrap: wrap;`
const BtnPlay = styled(Button)`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border: none; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;
`
const BtnGhost = styled(Link)`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.white}; font-weight: 700;
  display: inline-flex; align-items: center;
`
const H3 = styled.h3`font-size: ${(p) => p.theme.font.base}px; margin: ${(p) => p.theme.space.xl}px 0 ${(p) => p.theme.space.sm}px;`
const Item = styled(Link)`
  display: flex; align-items: center; gap: ${(p) => p.theme.space.md}px; text-align: left; margin-bottom: ${(p) => p.theme.space.sm}px;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.md}px; padding: ${(p) => p.theme.space.sm}px;
  span { flex: 1; display: flex; flex-direction: column; }
  b { font-size: ${(p) => p.theme.font.base}px; }
  small { color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.sm}px; }
  i { font-style: normal; color: ${(p) => p.theme.colors.muted}; }
`
const PosterBox = styled(Poster)`width: 64px; height: 84px; border-radius: ${(p) => p.theme.radius.sm}px; flex: 0 0 auto;`

export default function ProfilePage({ state }) {
  const continued = Object.keys(state.progress).map((id) => FEED.find((f) => f.id === id)).filter(Boolean)
  return (
    <Page>
      <Head>
        <Avatar><IconUser size={40} /></Avatar>
        <H1>Penonton Dracin</H1>
        <Note>Progress, suka, bookmark, dan koin tersimpan di perangkat ini (localStorage).</Note>
      </Head>
      <Stats>
        <Stat><b>{state.coins}</b><span>Koin</span></Stat>
        <Stat><b>{state.saved.size}</b><span>Bookmark</span></Stat>
        <Stat><b>{state.liked.size}</b><span>Disukai</span></Stat>
      </Stats>
      <Actions>
        <BtnPlay onPress={() => state.showToast('Beli koin via QRIS / GoPay / DANA (demo UI)')} aria-label="Beli koin"><IconCoin size={16} /> Beli Koin</BtnPlay>
        <BtnGhost to="/">Lanjutkan Nonton</BtnGhost>
      </Actions>
      <H3>Lanjutkan Nonton</H3>
      {continued.length === 0 && <Note>Belum ada progress. Putar satu episode dulu.</Note>}
      {continued.map((item) => {
        const t = titleById(item.titleId)
        return (
          <Item key={item.id} to={`/watch/${t.id}/${item.ep}`}>
            <PosterBox title={t} size={22} />
            <span><b>{t.title} — Episode {item.ep}</b><small>Progress tersimpan</small></span>
            <i>›</i>
          </Item>
        )
      })}
      <Note>Frontend siap produksi untuk UI — video contoh bebas lisensi Mixkit, tanpa backend. Ganti videoUrl di videoSource.js dengan HLS judul asli saat produksi.</Note>
    </Page>
  )
}
