import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { IconCoin } from '../../icons.jsx'

const Bar = styled.header`
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between;
  padding: ${(p) => p.theme.space.md}px ${(p) => p.theme.space.lg}px;
  background: ${(p) => p.theme.colors.bg};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`
const Logo = styled(Link)`
  font-size: ${(p) => p.theme.font.title}px; font-weight: 900; letter-spacing: -0.02em;
  span { color: ${(p) => p.theme.colors.accent2}; }
`
const CoinPill = styled.button`
  min-height: ${(p) => p.theme.touch}px; padding: 0 ${(p) => p.theme.space.md}px;
  border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface}; color: ${(p) => p.theme.colors.text};
  font-weight: 700; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
`

export default function TopBar({ coins, onCoinClick }) {
  return (
    <Bar>
      <Logo to="/">Dracin<span>Reels</span></Logo>
      <CoinPill onClick={onCoinClick} aria-label={`Koin kamu ${coins}`}>
        <IconCoin size={18} /> {coins} Koin
      </CoinPill>
    </Bar>
  )
}
