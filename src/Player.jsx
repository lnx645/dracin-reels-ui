import { useEffect, useRef, useState } from 'react'
import { SUBTITLE_LINES, VIDEO_URLS, titleById } from './data.js'
import { IconClose, IconFullscreen, IconPause, IconPlay, IconVolume, IconVolumeOff } from './icons.jsx'

function fmt(sec) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return m + ':' + String(s).padStart(2, '0')
}

export default function Player({ item, onClose, onEnded, onProgress }) {
  const t = titleById(item.titleId)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [showSub, setShowSub] = useState(true)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = speed
    if (playing) v.play().catch(() => setPlaying(false))
    else v.pause()
  }, [playing, speed, item.id])

  const togglePlay = () => setPlaying((p) => !p)

  const seek = (e) => {
    const v = videoRef.current
    if (!v || !dur) return
    v.currentTime = (Number(e.target.value) / 100) * dur
  }

  const toggleFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
  }

  return (
    <div className="player-backdrop" role="dialog" aria-label={'Memutar ' + t.title}>
      <div className="player">
        <div className="player-video-wrap" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={VIDEO_URLS[item.titleId]}
            muted={muted}
            playsInline
            autoPlay
            onTimeUpdate={(e) => { setTime(e.target.currentTime); onProgress && onProgress(item.id, e.target.currentTime, e.target.duration) }}
            onLoadedMetadata={(e) => setDur(e.target.duration)}
            onEnded={() => onEnded && onEnded(item)}
          />
          {!playing && <div className="player-bigplay"><IconPlay size={44} /></div>}
          {showSub && (
            <div className="player-sub">
              {SUBTITLE_LINES[Math.min(2, Math.floor(time / 15))]}
            </div>
          )}
        </div>

        <div className="player-top">
          <button className="player-icon-btn" onClick={onClose} aria-label="Tutup player"><IconClose /></button>
          <div className="player-title">
            <b>{t.title}</b>
            <span>Episode {item.ep} / {t.episodes} · {t.genre}</span>
          </div>
          <button className="player-icon-btn" onClick={toggleFullscreen} aria-label="Layar penuh"><IconFullscreen /></button>
        </div>

        <div className="player-controls">
          <input
            className="player-seek"
            type="range" min="0" max="100" step="0.1"
            value={dur ? (time / dur) * 100 : 0}
            onChange={seek}
            aria-label="Cari posisi video"
          />
          <div className="player-row">
            <button className="player-icon-btn" onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar'}>
              {playing ? <IconPause /> : <IconPlay />}
            </button>
            <button className="player-icon-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Nyalakan suara' : 'Bisukan'}>
              {muted ? <IconVolumeOff /> : <IconVolume />}
            </button>
            <span className="player-time">{fmt(time)} / {fmt(dur)}</span>
            <button className={showSub ? 'player-cc active' : 'player-cc'} onClick={() => setShowSub((s) => !s)}>CC</button>
            <button className="player-speed" onClick={() => setSpeed((s) => (s >= 2 ? 1 : s + 0.5))}>{speed}x</button>
          </div>
          <p className="player-note">Video contoh publik untuk demo player — ganti videoUrl di data.js dengan HLS judul asli saat produksi.</p>
        </div>
      </div>
    </div>
  )
}
