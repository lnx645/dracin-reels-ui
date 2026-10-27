import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { TITLES } from '../../infrastructure/seedData.js'
import Poster from '../components/Poster.jsx'

const Page = styled.main`padding: ${(p) => p.theme.space.lg}px;`
const H1 = styled.h1`font-size: ${(p) => p.theme.font.title}px; margin: 0 0 ${(p) => p.theme.space.lg}px;`
const Empty = styled.p`color: ${(p) => p.theme.colors.muted};`
const List = styled.div`display: flex; flex-direction: column; gap: ${(p) => p.theme.space.sm}px;`
const Item = styled(Link)`
  display: flex; align-items: center; gap: ${(p) => p.theme.space.md}px; text-align: left;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.md}px; padding: ${(p) => p.theme.space.sm}px;
  span { flex: 1; display: flex; flex-direction: column; }
  b { font-size: ${(p) => p.theme.font.base}px; }
  small { color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.sm}px; }
  i { font-style: normal; color: ${(p) => p.theme.colors.muted}; }
`
const PosterBox = styled(Poster)`width: 64px; height: 84px; border-radius: ${(p) => p.theme.radius.sm}px; flex: 0 0 auto;`

export default function SavedPage({ state }) {
  const items = TITLES.filter((t) => state.saved.has(t.id))
  return (
    <Page>
      <H1>Bookmark Saya</H1>
      {items.length === 0 && <Empty>Belum ada bookmark. Ketuk ikon bookmark di feed.</Empty>}
      <List>
        {items.map((t) => (
          <Item key={t.id} to={`/title/${t.id}`}>
            <PosterBox title={t} size={22} />
            <span><b>{t.title}</b><small>{t.genre} · {t.episodes} episode · ★ {t.rating}</small></span>
            <i>›</i>
          </Item>
        ))}
      </List>
    </Page>
  )
}
