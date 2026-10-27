import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { IconBookmark, IconHome, IconSearch, IconUser } from '../../icons.jsx'

const Nav = styled.nav`
  position: sticky; bottom: 0; z-index: 20;
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: ${(p) => p.theme.colors.bg};
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 6px 6px max(6px, env(safe-area-inset-bottom));
`
const Item = styled(NavLink)`
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-height: 56px; justify-content: center;
  color: ${(p) => p.theme.colors.dim};
  &.active { color: ${(p) => p.theme.colors.white}; }
  small { font-size: 11px; font-weight: 700; }
`

export default function BottomNav() {
  return (
    <Nav>
      <Item to="/" end><IconHome /><small>Beranda</small></Item>
      <Item to="/search"><IconSearch /><small>Cari</small></Item>
      <Item to="/saved"><IconBookmark /><small>Bookmark</small></Item>
      <Item to="/profile"><IconUser /><small>Saya</small></Item>
    </Nav>
  )
}
