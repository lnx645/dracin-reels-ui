import styled from '@emotion/styled'
import { Button } from 'react-aria-components'
import { Link } from 'react-router-dom'
import { IconLock, IconPlay, IconStar } from '../../icons.jsx'
import { buildEpisode, isEpisodeUnlocked } from '../../domain/rules.js'
import Poster from './Poster.jsx'

const Sheet = styled.section`
  background: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.radius.lg}px ${(p) => p.theme.radius.lg}px 0 0;
  overflow: hidden;
`
const PosterBox = styled(Poster)`height: 280px;`
const Body = styled.div`padding: ${(p) => p.theme.space.lg}px;`
const Meta = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px; margin-bottom: ${(p) => p.theme.space.sm}px;`
const Pill = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  font-size: ${(p) => p.theme.font.xs}px; font-weight: 700; padding: 4px 10px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: ${(p) => p.gold ? p.theme.colors.overlay : p.theme.colors.accent}; color: ${(p) => p.gold ? p.theme.colors.gold : p.theme.colors.white};
`
const H2 = styled.h2`margin: 0 0 ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.title}px;`
const P = styled.p`margin: 0 0 ${(p) => p.theme.space.sm}px; line-height: 1.6; color: rgba(255,255,255,0.9);`
const Small = styled.p`margin: 0 0 ${(p) => p.theme.space.lg}px; font-size: ${(p) => p.theme.font.sm}px; color: ${(p) => p.theme.colors.muted};`
const H3 = styled.h3`font-size: ${(p) => p.theme.font.base}px; margin: ${(p) => p.theme.space.lg}px 0 ${(p) => p.theme.space.sm}px;`
const Grid = styled.div`display: grid; grid-template-columns: repeat(5, 1fr); gap: ${(p) => p.theme.space.sm}px;`
const Ep = styled(Link)`
  min-height: 56px; border-radius: ${(p) => p.theme.radius.sm}px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  background: ${(p) => p.open ? p.theme.colors.surface2 : p.theme.colors.bg};
  border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.text};
  span { font-weight: 800; }
  small { font-size: 11px; color: ${(p) => p.theme.colors.muted}; display: flex; align-items: center; gap: 2px; }
`
const EpLocked = styled(Button)`
  min-height: 56px; border-radius: ${(p) => p.theme.radius.sm}px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  background: ${(p) => p.theme.colors.bg}; border: 1px solid ${(p) => p.theme.colors.border}; color: ${(p) => p.theme.colors.muted};
  span { font-weight: 800; }
  small { font-size: 11px; display: flex; align-items: center; gap: 2px; }
`
const BtnPlay = styled(Link)`
  display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
  min-height: ${(p) => p.theme.touch}px; margin-top: ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
`

export default function DetailSheet({ title, state, onUnlockRequest }) {
  return (
    <Sheet>
      <PosterBox title={title} size={64} />
      <Body>
        <Meta><Pill>{title.genre}</Pill><Pill gold><IconStar size={12} /> {title.rating}</Pill></Meta>
        <H2>{title.title}</H2>
        <P>{title.desc}</P>
        <Small>{title.episodes} episode · Episode 1–5 gratis · Sisanya iklan / koin</Small>
        <H3>Daftar Episode (demo: 10 pertama)</H3>
        <Grid>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((ep) => {
            const episode = buildEpisode(title.id, ep)
            const open = isEpisodeUnlocked(episode, state.unlocked)
            if (open) return <Ep key={ep} to={`/watch/${title.id}/${ep}`} open><span>{ep}</span><small>Buka</small></Ep>
            return <EpLocked key={ep} onPress={() => onUnlockRequest(episode)} aria-label={`Episode ${ep} terkunci, buka dengan iklan atau koin`}><span>{ep}</span><small><IconLock size={12} /> Terkunci</small></EpLocked>
          })}
        </Grid>
        <BtnPlay to={`/watch/${title.id}/1`}><IconPlay size={16} /> Mulai dari Episode 1</BtnPlay>
      </Body>
    </Sheet>
  )
}
