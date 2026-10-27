import { useEffect, useRef, useState } from 'react'

function fmt(sec) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Logika player saja — tanpa tampilan. Dipakai komponen Player.
export function usePlayer({ src, onEnded, onProgress }) {
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
  }, [playing, speed, src])

  const togglePlay = () => setPlaying((p) => !p)
  const toggleMute = () => setMuted((m) => !m)
  const toggleSub = () => setShowSub((s) => !s)
  const cycleSpeed = () => setSpeed((s) => (s >= 2 ? 1 : s + 0.5))

  const seek = (pct) => {
    const v = videoRef.current
    if (v && dur) v.currentTime = (pct / 100) * dur
  }

  const toggleFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
  }

  const handleTimeUpdate = (e) => {
    setTime(e.target.currentTime)
    if (onProgress) onProgress(e.target.currentTime, e.target.duration)
  }

  return {
    videoRef, playing, muted, time, dur, showSub, speed,
    timeText: fmt(time), durText: fmt(dur),
    progressPct: dur ? (time / dur) * 100 : 0,
    togglePlay, toggleMute, toggleSub, cycleSpeed, seek, toggleFullscreen,
    handleTimeUpdate, onLoaded: (e) => setDur(e.target.duration), onEnded,
  }
}
