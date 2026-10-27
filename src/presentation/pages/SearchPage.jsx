import styled from '@emotion/styled'
import { Input, SearchField, ToggleButton } from 'react-aria-components'
import { useMemo, useState } from 'react'
import { TITLES } from '../../infrastructure/seedData.js'
import { IconSearch } from '../../icons.jsx'
import TitleCard from '../components/TitleCard.jsx'
import { VisuallyHiddenLabel } from '../components/aria.jsx'

const Page = styled.main`padding: ${(p) => p.theme.space.lg}px;`
const H1 = styled.h1`font-size: ${(p) => p.theme.font.title}px; margin: 0 0 ${(p) => p.theme.space.lg}px;`
// SearchField React Aria: Label (disembunyikan visual, tetap dibaca
// screen reader) memberi accessible name; Input dirender RAC sehingga
// keyboard + aria-nya benar tanpa atribut manual.
const SearchWrap = styled(SearchField)`
  display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px;
  background: ${(p) => p.theme.colors.surface}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.md}px; padding: 0 ${(p) => p.theme.space.md}px; color: ${(p) => p.theme.colors.muted};
`
const SearchInput = styled(Input)`
  flex: 1; min-height: ${(p) => p.theme.touch}px; border: none; background: none; color: ${(p) => p.theme.colors.text}; font-size: ${(p) => p.theme.font.base}px;
  width: 100%;
`
const Chips = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px; flex-wrap: wrap; margin: ${(p) => p.theme.space.md}px 0;`
// Chip genre sebagai ToggleButton: isSelected memberi aria-pressed
// otomatis, jadi screen reader tahu genre mana yang aktif.
const Chip = styled(ToggleButton)`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface}; color: ${(p) => p.theme.colors.white}; font-weight: 700;
  &[data-selected="true"] { background: ${(p) => p.theme.colors.accent}; }
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
      <SearchWrap value={query} onChange={setQuery}>
        <VisuallyHiddenLabel>Cari judul</VisuallyHiddenLabel>
        <IconSearch size={20} />
        <SearchInput placeholder="Cari judul, misal CEO, balas dendam…" />
      </SearchWrap>
      <Chips role="group" aria-label="Filter genre">
        {GENRES.map((g) => (
          <Chip key={g} isSelected={genre === g} onChange={() => setGenre(g)} aria-label={`Genre ${g}`}>{g}</Chip>
        ))}
      </Chips>
      <Grid>{filtered.map((t) => <TitleCard key={t.id} title={t} />)}</Grid>
      {filtered.length === 0 && <Empty>Tidak ada judul yang cocok. Coba kata kunci lain.</Empty>}
    </Page>
  )
}
