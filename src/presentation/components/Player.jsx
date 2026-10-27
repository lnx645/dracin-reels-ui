import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, Slider, SliderThumb, SliderTrack, ToggleButton } from 'react-aria-components'
import { useEffect, useRef, useState } from 'react'
import { IconFullscreen, IconPause, IconPlay, IconSettings, IconVolume, IconVolumeOff } from '../../icons.jsx'
import { SUBTITLE_LINES } from '../../infrastructure/videoSource.js'
import { usePlayer } from '../hooks/usePlayer.js'

// Player IMERSIF ala TikTok — dipakai halaman rute /watch/:titleId/:episode.
// BUKAN panel kontrol: video FULL-BLEED 9:16 memenuhi layar, gradasi halus
// atas-bawah supaya teks terbaca, progress tipis di paling bawah.
// Kontrol lanjutan (mute, CC, kecepatan, fullscreen, waktu) TIDAK permanen:
// muncul saat video dijeda, atau lewat tombol pengaturan kecil di kanan atas.
// Ketuk video = play/pause; ikon play besar muncul sebentar saat mulai memutar.
// Subtitle tidak lagi absolute di tengah video — ia duduk di atas Info
// (children) di BottomStack, jadi tidak menutupi video dan tidak menabrak Info.
// Kontrol tetap React Aria: Button, ToggleButton CC, Slider seek.
const flashFade = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  25% { transform: scale(1); opacity: 1; }
  75% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
`
const Stage = styled.div`
  position: absolute; inset: 0; background: ${(p) => p.theme.colors.black};
  overflow: hidden; cursor: pointer;
`
const Video = styled.video`
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; background: ${(p) => p.theme.colors.black};
`
const Shade = styled.div`
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 28%, transparent 52%, rgba(0,0,0,0.85) 100%);
`
const BigPlay = styled.div`
  position: absolute; left: 50%; top: 44%; z-index: 2; pointer-events: none;
  /* pointer-events none supaya ketukan di tengah tetap sampai ke video */
  transform: translate(-50%, -50%); width: 84px; height: 84px; border-radius: 50%;
  background: ${(p) => p.theme.colors.overlay}; border: 1px solid ${(p) => p.theme.colors.border};
  display: grid; place-items: center; color: ${(p) => p.theme.colors.white};
`
const FlashPlay = styled(BigPlay)`animation: ${flashFade} 0.7s ease forwards;`
const AdvToggle = styled(Button)`
  position: absolute; top: 76px; right: ${(p) => p.theme.space.md}px; z-index: 6;
  width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.overlay};
  color: ${(p) => p.theme.colors.white}; display: grid; place-items: center;
`
const AdvPanel = styled.div`
  position: absolute; top: 128px; right: ${(p) => p.theme.space.md}px; z-index: 6;
  display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px;
  background: ${(p) => p.theme.colors.overlay}; border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radius.pill}px; padding: ${(p) => p.theme.space.sm}px;
`
const IconBtn = styled(Button)`
  width: 40px; height: 40px; min-width: 40px; border-radius: 50%;
  border: none; background: transparent; color: ${(p) => p.theme.colors.white};
  display: grid; place-items: center;
`
const PillToggle = styled(ToggleButton)`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border}; background: transparent;
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
  &[data-selected="true"] { background: ${(p) => p.theme.colors.accent}; border-color: transparent; }
`
const PillBtn = styled(Button)`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border}; background: transparent;
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
`
const Time = styled.span`font-size: ${(p) => p.theme.font.sm}px; color: rgba(255,255,255,0.85); font-variant-numeric: tabular-nums; white-space: nowrap;`
const BottomStack = styled.div`
  position: absolute; left: ${(p) => p.theme.space.lg}px; right: 88px; bottom: ${(p) => p.theme.space.xxl + 16}px; z-index: 3;
  display: flex; flex-direction: column; gap: ${(p) => p.theme.space.sm}px; pointer-events: none;
  & > * { pointer-events: auto; }
`
const Sub = styled.div`
  text-align: center; font-size: ${(p) => p.theme.font.base}px; font-weight: 700; line-height: 1.4;
  color: ${(p) => p.theme.colors.white}; text-shadow: 0 2px 6px ${(p) => p.theme.colors.black};
  background: ${(p) => p.theme.colors.overlay};
  padding: ${(p) => p.theme.space.sm}px ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.sm}px;
`
const Progress = styled.div`position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; height: 28px; display: flex; align-items: flex-end;`
const SeekTrack = styled(SliderTrack)`position: relative; width: 100%; height: 28px; display: flex; align-items: center;`
const SeekBar = styled.div`position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255,255,255,0.25);`
const SeekFill = styled.div`position: absolute; left: 0; bottom: 0; height: 3px; background: ${(p) => p.theme.colors.accent}; pointer-events: none;`
const SeekThumb = styled(SliderThumb)`
  position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%;
  background: ${(p) => p.theme.colors.white}; box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  transform: translate(-50%, -50%);
`

export default function Player({ src, onEnded, onProgress, children }) {
  const p = usePlayer({ src, onEnded, onProgress })
  const [showAdv, setShowAdv] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const timer = useRef(null)

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const handleTap = () => {
    const wasPlaying = p.playing
    p.togglePlay()
    if (!wasPlaying) {
      setFlashKey((k) => k + 1)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setFlashKey(0), 700)
    }
  }

  return (
    <Stage>
      <div onClick={handleTap} style={{ position: 'absolute', inset: 0 }}>
        <Video
          ref={p.videoRef} src={src} muted={p.muted} playsInline autoPlay
          onTimeUpdate={p.handleTimeUpdate} onLoadedMetadata={p.onLoaded} onEnded={p.onEnded}
        />
      </div>
      <Shade />
      {!p.playing && <BigPlay><IconPlay size={44} /></BigPlay>}
      {flashKey > 0 && p.playing && <FlashPlay key={flashKey}><IconPlay size={44} /></FlashPlay>}

      <AdvToggle onPress={() => setShowAdv((v) => !v)} aria-label="Kontrol lanjutan" aria-expanded={showAdv}>
        <IconSettings />
      </AdvToggle>
      {(showAdv || !p.playing) && (
        <AdvPanel role="group" aria-label="Kontrol lanjutan video">
          <IconBtn onPress={p.toggleMute} aria-label={p.muted ? 'Nyalakan suara' : 'Bisukan'}>{p.muted ? <IconVolumeOff /> : <IconVolume />}</IconBtn>
          <PillToggle isSelected={p.showSub} onChange={p.toggleSub} aria-label="Subtitle Indonesia">CC</PillToggle>
          <PillBtn onPress={p.cycleSpeed} aria-label={`Kecepatan ${p.speed}x`}>{p.speed}x</PillBtn>
          <IconBtn onPress={p.toggleFullscreen} aria-label="Layar penuh"><IconFullscreen /></IconBtn>
          <Time>{p.timeText} / {p.durText}</Time>
        </AdvPanel>
      )}

      <BottomStack>
        {p.showSub && <Sub>{SUBTITLE_LINES[Math.min(2, Math.floor(p.time / 15))]}</Sub>}
        {children}
      </BottomStack>

      <Progress>
        <Slider aria-label="Cari posisi video" minValue={0} maxValue={100} step={0.1} value={p.progressPct} onChange={(v) => p.seek(v)}>
          <SeekTrack>
            <SeekBar />
            <SeekFill style={{ width: `${p.progressPct}%` }} />
            <SeekThumb />
          </SeekTrack>
        </Slider>
      </Progress>
    </Stage>
  )
}
