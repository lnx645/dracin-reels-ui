import styled from '@emotion/styled'
import { initialsOf } from '../../domain/rules.js'

const Box = styled.div`
  background: ${(p) => p.gradient};
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: ${(p) => p.theme.space.sm}px; color: ${(p) => p.theme.colors.white};
  overflow: hidden; position: relative;
`
const Initial = styled.span`
  font-size: ${(p) => p.size}px; font-weight: 900; letter-spacing: 0.02em;
  text-shadow: 0 8px 24px rgba(0,0,0,0.4);
`
const Word = styled.span`
  font-size: ${(p) => p.theme.font.xs}px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase;
`

export default function Poster({ title, size = 72, className, showWord = true }) {
  return (
    <Box gradient={title.gradient} className={className}>
      <Initial size={size}>{initialsOf(title.title)}</Initial>
      {showWord && <Word>{title.genre}</Word>}
    </Box>
  )
}
