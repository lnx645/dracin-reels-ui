import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import Poster from './Poster.jsx'

const Card = styled(Link)`display: block; text-align: left;`
const PosterBox = styled(Poster)`aspect-ratio: 3 / 4; border-radius: ${(p) => p.theme.radius.md}px;`
const Genre = styled.span`display: block; margin-top: ${(p) => p.theme.space.sm}px; font-size: ${(p) => p.theme.font.xs}px; color: ${(p) => p.theme.colors.accent2}; font-weight: 700;`
const Name = styled.span`display: block; font-weight: 800; font-size: ${(p) => p.theme.font.base}px; line-height: 1.3;`
const Meta = styled.span`display: block; font-size: ${(p) => p.theme.font.xs}px; color: ${(p) => p.theme.colors.muted};`

export default function TitleCard({ title }) {
  return (
    <Card to={`/title/${title.id}`}>
      <PosterBox title={title} size={42} />
      <Genre>{title.genre}</Genre>
      <Name>{title.title}</Name>
      <Meta>★ {title.rating} · {title.episodes} episode</Meta>
    </Card>
  )
}
