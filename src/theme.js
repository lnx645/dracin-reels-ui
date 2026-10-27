import { css } from '@emotion/react'

// SATU-SATUNYA sumber token desain. Komponen dilarang memakai nilai
// warna / jarak / radius / shadow hardcode di luar file ini — pakai theme.
export const theme = {
  colors: {
    bg: '#0b0b10',
    surface: '#1a1a24',
    surface2: '#262633',
    text: '#f5f1e8',
    muted: '#a8a29e',
    dim: '#71717a',
    accent: '#ff4d2e',
    accent2: '#ff8a00',
    gold: '#f5c518',
    like: '#fe2c55',
    border: 'rgba(255,255,255,0.14)',
    overlay: 'rgba(0,0,0,0.55)',
    white: '#ffffff',
    black: '#000000',
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  radius: { sm: 10, md: 14, lg: 18, pill: 999 },
  font: { base: 15, sm: 13, xs: 12, title: 20, big: 28 },
  shadow: { card: '0 10px 30px rgba(0,0,0,0.45)', pop: '0 8px 24px rgba(0,0,0,0.5)' },
  touch: 48,
  phone: 430,
}

export const globalStyles = css`
  * { box-sizing: border-box; }
  html, body, #root { margin: 0; min-height: 100%; }
  body {
    background: ${theme.colors.bg};
    color: ${theme.colors.text};
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  button { font: inherit; cursor: pointer; }
  button:focus-visible, a:focus-visible, input:focus-visible {
    outline: 2px solid ${theme.colors.accent2};
    outline-offset: 2px;
  }
  input { font: inherit; }
  a { color: inherit; text-decoration: none; }
`
