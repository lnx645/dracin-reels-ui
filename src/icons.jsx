// Ikon SVG inline — tanpa emoji, tanpa dependensi ikon eksternal.
// Gaya: stroke 2px, rounded, konsisten di semua tombol.
function Svg({ children, size = 22, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export const IconHome = (p) => <Svg {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></Svg>
export const IconSearch = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
export const IconBookmark = (p) => <Svg {...p}><path d="M6 3h12v18l-6-4.5L6 21z" /></Svg>
export const IconBookmarkFilled = (p) => <Svg {...p} fill="currentColor" stroke="none"><path d="M6 3h12v18l-6-4.5L6 21z" /></Svg>
export const IconUser = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></Svg>
export const IconHeart = (p) => <Svg {...p}><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.5 0 3 .8 4.3 2.3 1.3-1.5 2.8-2.3 4.3-2.3 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z" /></Svg>
export const IconHeartFilled = (p) => <Svg {...p} fill="currentColor" stroke="none"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.5 0 3 .8 4.3 2.3 1.3-1.5 2.8-2.3 4.3-2.3 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z" /></Svg>
export const IconComment = (p) => <Svg {...p}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.3-4.9A8.5 8.5 0 1 1 21 11.5z" /></Svg>
export const IconShare = (p) => <Svg {...p}><circle cx="6" cy="12" r="3" /><circle cx="17" cy="6" r="3" /><circle cx="17" cy="18" r="3" /><path d="M8.6 10.7 14.4 7.3M8.6 13.3l5.8 3.4" /></Svg>
export const IconPlay = (p) => <Svg {...p} fill="currentColor" stroke="none"><path d="M7 4.5v15c0 .9 1 1.5 1.8 1L20 13a1.2 1.2 0 0 0 0-2L8.8 3.5C8 3 7 3.6 7 4.5z" /></Svg>
export const IconPause = (p) => <Svg {...p} fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></Svg>
export const IconVolume = (p) => <Svg {...p}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9.5 9.5 0 0 1 0 13" /></Svg>
export const IconVolumeOff = (p) => <Svg {...p}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m16 9 5 6M21 9l-5 6" /></Svg>
export const IconFullscreen = (p) => <Svg {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></Svg>
export const IconClose = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const IconChevronRight = (p) => <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
export const IconLock = (p) => <Svg {...p}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.5" fill="currentColor" /></Svg>
export const IconCoin = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M15 9.5c-.8-1-1.8-1.5-3-1.5-1.7 0-3 1-3 2.3 0 3.4 6 1.2 6 4 0 1.3-1.3 2.2-3 2.2-1.2 0-2.2-.5-3-1.5" /></Svg>
export const IconStar = (p) => <Svg {...p} fill="currentColor" stroke="none"><path d="M12 2.5 15 8.8l7 .8-5.2 4.7 1.4 6.9L12 17.7l-6.2 3.5 1.4-6.9L2 9.6l7-.8z" /></Svg>
export const IconClock = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Svg>
export const IconCheck = (p) => <Svg {...p}><path d="m4 12.5 5 5L20 6.5" /></Svg>
export const IconSend = (p) => <Svg {...p}><path d="M21 3 10 14" /><path d="M21 3 14 21l-4-8-7-4z" /></Svg>
export const IconCrown = (p) => <Svg {...p}><path d="M3 18h18M3 8l4 4 5-6 5 6 4-4v10H3z" /></Svg>
export const IconSettings = (p) => <Svg {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2.5" /><circle cx="10" cy="17" r="2.5" /></Svg>
export const IconNext = (p) => <Svg {...p}><path d="m9 6 6 6-6 6" /><path d="M4 6l6 6-6 6" /></Svg>
