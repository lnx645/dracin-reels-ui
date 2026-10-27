import styled from '@emotion/styled'

const Box = styled.div`
  position: fixed; left: 50%; bottom: 90px; transform: translateX(-50%); z-index: 90;
  background: ${(p) => p.theme.colors.white}; color: ${(p) => p.theme.colors.black};
  padding: ${(p) => p.theme.space.sm}px ${(p) => p.theme.space.lg}px; border-radius: ${(p) => p.theme.radius.pill}px;
  font-weight: 700; font-size: ${(p) => p.theme.font.sm}px; box-shadow: ${(p) => p.theme.shadow.pop};
  max-width: calc(100% - 32px); text-align: center;
`

export default function Toast({ message }) {
  if (!message) return null
  return <Box>{message}</Box>
}
