import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { TITLES } from '../../infrastructure/seedData.js'
import { IconSearch } from '../../icons.jsx'
import TitleCard from '../components/TitleCard.jsx'

const Page = styled.main`padding: ${(p) => p.theme.space.lg}px;`
const H1 = styled.h1`font-size: ${(p) => p.theme.font.title}px; margin: 0 0 ${(p) => p.theme.space.lg}px;`
const SearchWrap = styled.div`
  display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.md}px; padding: 0 ${(p) => p.theme.space.md}px; color: ${(p) => p.theme.colors.muted};
`
const Input = styled.input`
  flex: 1; min-height: ${(p) => p.theme.touch}px; border: none; background: none; color: ${(p) => p.theme.colors.text}; font-size: ${(p) => p.theme.font.base}px;
`
const Chips = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px; flex-wrap: wrap; margin: ${(p) => p.theme.space.md}px 0;`
const Chip = styled.button`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.active ? p.theme.colors.accent : p.theme.colors.surface}; color: ${(p) => p.theme.colors.white}; font-weight: 700;
`
const Grid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: ${(p) => p.theme.space.md}px;`
const Empty = styled.p`color: ${(p) => p.theme.colors.muted};`

const GENRES = ['Semua', 'CEO', 'Balas Dendam', 'Kostum', 'Romantis']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('Semua')
  const filtered = useMemo(() => TITLES.filter((t) =>
    (genre === 'Semua' || t.genre === genre) && t.title.toLowerCase().includes(query.toLowerCase())
  ), [genre, query])

  return (
    <Page>
      <H1>Cari Dracin</H1>
      <SearchWrap><IconSearch size={20} /><Input placeholder="Cari judul, misal CEO, balas dendam…" value={query} onChange={(e) => setQuery(e.target.value)} /></SearchWrap>
      <Chips>{GENRES.map((g) => <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>)}</Chips>
      <Grid>{filtered.map((t) => <TitleCard key={t.id} title={t} />)}</Grid>
      {filtered.length === 0 && <Empty>Tidak ada judul yang cocok. Coba kata kunci lain.</Empty>}
    </Page>
  )
}
