import styled from '@emotion/styled'
import { Button, Slider, SliderThumb, SliderTrack, ToggleButton } from 'react-aria-components'
import { IconFullscreen, IconPause, IconPlay, IconVolume, IconVolumeOff } from '../../icons.jsx'
import { SUBTITLE_LINES } from '../../infrastructure/videoSource.js'
import { usePlayer } from '../hooks/usePlayer.js'

// Player BUKAN modal. Ini elemen video + kontrol yang dipakai halaman
// rute /watch/:titleId/:episode (WatchPage). Tidak ada backdrop di sini.
// Kontrol memakai React Aria Components: Button untuk play/mute/
// fullscreen/kecepatan, ToggleButton untuk CC (aria-pressed otomatis),
// Slider untuk seek (role slider + keyboard arrow keys bawaan RAC).
const Wrap = styled.div`position: relative; flex: 1; background: ${(p) => p.theme.colors.black}; display: grid; place-items: center; cursor: pointer;`
const Video = styled.video`width: 100%; height: 100%; object-fit: cover; background: ${(p) => p.theme.colors.black};`
const BigPlay = styled.div`
  position: absolute; width: 84px; height: 84px; border-radius: 50%;
  background: ${(p) => p.theme.colors.accent}; display: grid; place-items: center; color: ${(p) => p.theme.colors.white};
  box-shadow: ${(p) => p.theme.shadow.pop};
`
const Sub = styled.div`
  position: absolute; left: ${(p) => p.theme.space.lg}px; right: ${(p) => p.theme.space.lg}px; bottom: 18px; text-align: center;
  font-size: ${(p) => p.theme.font.base}px; font-weight: 700; line-height: 1.4; color: ${(p) => p.theme.colors.white};
  text-shadow: 0 2px 6px ${(p) => p.theme.colors.black}; background: ${(p) => p.theme.colors.overlay};
  padding: ${(p) => p.theme.space.sm}px ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.sm}px;
`
const Controls = styled.div`padding: ${(p) => p.theme.space.md}px ${(p) => p.theme.space.lg}px max(${(p) => p.theme.space.lg}px, env(safe-area-inset-bottom)); background: ${(p) => p.theme.colors.bg};`
const SeekTrack = styled(SliderTrack)`
  position: relative; height: 28px; display: flex; align-items: center;
`
const SeekBar = styled.div`
  position: absolute; left: 0; right: 0; height: 4px; border-radius: 999px;
  background: rgba(255,255,255,0.25);
`
const SeekFill = styled.div`
  position: absolute; left: 0; height: 4px; border-radius: 999px;
  background: ${(p) => p.theme.colors.accent}; pointer-events: none;
`
const SeekThumb = styled(SliderThumb)`
  position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%;
  background: ${(p) => p.theme.colors.white}; box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  transform: translate(-50%, -50%);
`
const Row = styled.div`display: flex; align-items: center; gap: ${(p) => p.theme.space.sm}px; margin-top: ${(p) => p.theme.space.sm}px;`
const IconBtn = styled(Button)`
  width: 44px; height: 44px; min-width: 44px; border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.overlay}; color: ${(p) => p.theme.colors.white};
  display: grid; place-items: center;
`
const Time = styled.span`font-size: ${(p) => p.theme.font.sm}px; color: ${(p) => p.theme.colors.muted}; font-variant-numeric: tabular-nums;`
const PillBtn = styled(Button)`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
`
const PillToggle = styled(ToggleButton)`
  min-height: 40px; padding: 0 ${(p) => p.theme.space.md}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.white}; font-weight: 800;
  &[data-selected="true"] { background: ${(p) => p.theme.colors.accent}; }
`
const Note = styled.p`color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.xs}px; line-height: 1.5; margin: ${(p) => p.theme.space.md}px 0 0;`

export default function Player({ src, sourceLabel, onEnded, onProgress }) {
  const p = usePlayer({ src, onEnded, onProgress })
  return (
    <>
      <Wrap onClick={p.togglePlay}>
        <Video
          ref={p.videoRef} src={src} muted={p.muted} playsInline autoPlay
          onTimeUpdate={p.handleTimeUpdate} onLoadedMetadata={p.onLoaded} onEnded={p.onEnded}
        />
        {!p.playing && <BigPlay><IconPlay size={44} /></BigPlay>}
        {p.showSub && <Sub>{SUBTITLE_LINES[Math.min(2, Math.floor(p.time / 15))]}</Sub>}
      </Wrap>
      <Controls>
        <Slider
          aria-label="Cari posisi video" minValue={0} maxValue={100} step={0.1}
          value={p.progressPct} onChange={(v) => p.seek(v)}
        >
          <SeekTrack>
            <SeekBar />
            <SeekFill style={{ width: `${p.progressPct}%` }} />
            <SeekThumb />
          </SeekTrack>
        </Slider>
        <Row>
          <IconBtn onPress={p.togglePlay} aria-label={p.playing ? 'Jeda' : 'Putar'}>{p.playing ? <IconPause /> : <IconPlay />}</IconBtn>
          <IconBtn onPress={p.toggleMute} aria-label={p.muted ? 'Nyalakan suara' : 'Bisukan'}>{p.muted ? <IconVolumeOff /> : <IconVolume />}</IconBtn>
          <Time>{p.timeText} / {p.durText}</Time>
          <span style={{ marginLeft: 'auto' }} />
          <PillToggle isSelected={p.showSub} onChange={p.toggleSub} aria-label="Subtitle Indonesia">CC</PillToggle>
          <PillBtn onPress={p.cycleSpeed} aria-label={`Kecepatan ${p.speed}x`}>{p.speed}x</PillBtn>
          <IconBtn onPress={p.toggleFullscreen} aria-label="Layar penuh"><IconFullscreen /></IconBtn>
        </Row>
        <Note>{sourceLabel} — video contoh bebas lisensi; ganti dengan HLS judul asli saat produksi.</Note>
      </Controls>
    </>
  )
}
