import { useEffect, useMemo, useState } from 'react'
import { FEED, MOCK_COMMENTS, TITLES, titleById } from './data.js'
import Player from './Player.jsx'
import {
  IconBookmark, IconBookmarkFilled, IconCheck, IconClose, IconCoin, IconComment,
  IconCrown, IconHeart, IconHeartFilled, IconHome, IconLock, IconPlay, IconSearch,
  IconSend, IconShare, IconStar, IconUser,
} from './icons.jsx'

const GENRES = ['Semua', 'CEO', 'Balas Dendam', 'Kostum', 'Romantis']

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null')
    return v === null ? fallback : v
  } catch { return fallback }
}

export default function App() {
  const [view, setView] = useState('feed')
  const [detailId, setDetailId] = useState(null)
  const [unlockEp, setUnlockEp] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [commentsFor, setCommentsFor] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [liked, setLiked] = useState(() => new Set(load('dr-liked', [])))
  const [saved, setSaved] = useState(() => new Set(load('dr-saved', ['ceo'])))
  const [unlocked, setUnlocked] = useState(() => new Set(load('dr-unlocked', [])))
  const [coins, setCoins] = useState(() => load('dr-coins', 120))
  const [progress, setProgress] = useState(() => load('dr-progress', {}))
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('Semua')

  useEffect(() => { localStorage.setItem('dr-liked', JSON.stringify([...liked])) }, [liked])
  useEffect(() => { localStorage.setItem('dr-saved', JSON.stringify([...saved])) }, [saved])
  useEffect(() => { localStorage.setItem('dr-unlocked', JSON.stringify([...unlocked])) }, [unlocked])
  useEffect(() => { localStorage.setItem('dr-coins', JSON.stringify(coins)) }, [coins])
  useEffect(() => { localStorage.setItem('dr-progress', JSON.stringify(progress)) }, [progress])

  const showToast = (msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2800)
  }
  const toggleSet = (set, fn, id) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id); else next.add(id)
    fn(next)
  }
  const detail = detailId ? titleById(detailId) : null
  const isUnlocked = (item) => item.free || unlocked.has(item.id)
  const filteredTitles = useMemo(() => TITLES.filter((t) =>
    (genre === 'Semua' || t.genre === genre) && t.title.toLowerCase().includes(query.toLowerCase())
  ), [genre, query])

  const playItem = (item) => {
    if (!isUnlocked(item)) { setUnlockEp(item); return }
    setPlaying(item)
  }
  const handleEnded = (item) => {
    const idx = FEED.findIndex((f) => f.id === item.id)
    const next = FEED[idx + 1]
    if (next && isUnlocked(next)) { setPlaying(next); showToast('Lanjut otomatis ke Episode ' + next.ep) }
    else if (next) { setPlaying(null); setUnlockEp(next); }
    else { setPlaying(null); showToast('Episode terakhir di feed demo ini') }
  }
  const handleShare = async (item) => {
    const text = 'Nonton ' + titleById(item.titleId).title + ' Episode ' + item.ep + ' di DracinReels'
    try {
      if (navigator.share) await navigator.share({ title: 'DracinReels', text })
      else { await navigator.clipboard.writeText(text); showToast('Link episode disalin') }
    } catch { showToast('Link episode disalin') }
  }

  const Poster = ({ t, className }) => (
    <div className={className + ' poster-art'} style={{ background: t.gradient }}>
      <span className="poster-initial">{t.title.split(' ').slice(0, 2).map((w) => w[0]).join('')}</span>
      <span className="poster-word">{t.genre}</span>
    </div>
  )

  return (
    <div className="phone">
      <header className="topbar">
        <div className="logo">Dracin<span>Reels</span></div>
        <button className="coin-pill" onClick={() => showToast('Koin kamu: ' + coins + ' — beli koin via QRIS (demo UI)')}>
          <IconCoin size={18} /> {coins} Koin
        </button>
      </header>

      {view === 'feed' && (
        <main className="feed">
          {FEED.map((item) => {
            const t = titleById(item.titleId)
            const open = isUnlocked(item)
            const pct = progress[item.id] ? Math.min(100, Math.round((progress[item.id].t / Math.max(1, progress[item.id].d)) * 100)) : 0
            return (
              <article className="reel" key={item.id}>
                <Poster t={t} className="reel-poster" />
                <div className="reel-shade" />
                <div className="reel-progress"><i style={{ width: (item.ep === 1 ? 12 : pct) + '%' }} /></div>
                <div className="reel-actions">
                  <button className={liked.has(item.id) ? 'act active' : 'act'} onClick={() => { toggleSet(liked, setLiked, item.id); if (!liked.has(item.id)) showToast('Disukai') }} aria-label="Suka">
                    <span>{liked.has(item.id) ? <IconHeartFilled /> : <IconHeart />}</span><small>{item.likes}</small>
                  </button>
                  <button className="act" onClick={() => setCommentsFor(item)} aria-label="Komentar">
                    <span><IconComment /></span><small>{item.comments.toLocaleString('id-ID')}</small>
                  </button>
                  <button className={saved.has(t.id) ? 'act active' : 'act'} onClick={() => { toggleSet(saved, setSaved, t.id); showToast(saved.has(t.id) ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark') }} aria-label="Simpan">
                    <span>{saved.has(t.id) ? <IconBookmarkFilled /> : <IconBookmark />}</span><small>Simpan</small>
                  </button>
                  <button className="act" onClick={() => handleShare(item)} aria-label="Bagikan">
                    <span><IconShare /></span><small>Bagikan</small>
                  </button>
                </div>
                <div className="reel-info">
                  <div className="reel-meta">
                    <span className="pill-genre">{t.genre}</span>
                    <span className="pill-ep">Episode {item.ep} / {t.episodes}</span>
                    <span className="pill-rating"><IconStar size={12} /> {t.rating}</span>
                    {pct > 0 && <span className="pill-ep">Lanjut {pct}%</span>}
                  </div>
                  <h2 onClick={() => setDetailId(t.id)}>{t.title}</h2>
                  <p>{t.desc}</p>
                  {!open ? (
                    <div className="locked-box">
                      <div className="locked-title"><IconLock size={16} /> Episode terkunci</div>
                      <p className="locked-text">Episode 1–5 gratis. Buka episode ini dengan iklan atau koin.</p>
                      <div className="locked-btns">
                        <button className="btn-ad" onClick={() => setUnlockEp(item)}>Nonton Iklan</button>
                        <button className="btn-coin" onClick={() => {
                          if (coins < 10) { showToast('Koin tidak cukup — beli koin dulu'); return }
                          setCoins(coins - 10); setUnlocked(new Set(unlocked).add(item.id)); showToast('Episode terbuka! −10 koin')
                        }}><IconCoin size={16} /> 10 Koin</button>
                      </div>
                    </div>
                  ) : (
                    <div className="watch-row">
                      <button className="btn-play" onClick={() => playItem(item)}><IconPlay size={16} /> {pct > 0 ? 'Lanjutkan' : 'Tonton'} Episode {item.ep}</button>
                      <button className="btn-ghost" onClick={() => setDetailId(t.id)}>Daftar Episode</button>
                    </div>
                  )}
                  <div className="swipe-hint">Geser ke atas untuk episode berikutnya ↑</div>
                </div>
              </article>
            )
          })}
          <div className="feed-end">
            <p>Itu dulu untuk demo UI ini.</p>
            <button className="btn-play" onClick={() => setView('search')}>Cari Judul Lain →</button>
          </div>
        </main>
      )}

      {view === 'search' && (
        <main className="page">
          <h1 className="page-title">Cari Dracin</h1>
          <div className="search-wrap"><IconSearch size={20} /><input className="search-input" placeholder="Cari judul, misal CEO, balas dendam…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <div className="chips">{GENRES.map((g) => <button key={g} className={genre === g ? 'chip active' : 'chip'} onClick={() => setGenre(g)}>{g}</button>)}</div>
          <div className="title-grid">
            {filteredTitles.map((t) => (
              <button key={t.id} className="title-card" onClick={() => setDetailId(t.id)}>
                <Poster t={t} className="card-poster" />
                <span className="title-card-genre">{t.genre}</span>
                <span className="title-card-name">{t.title}</span>
                <span className="title-card-meta">★ {t.rating} · {t.episodes} episode</span>
              </button>
            ))}
          </div>
          {filteredTitles.length === 0 && <p className="empty">Tidak ada judul yang cocok. Coba kata kunci lain.</p>}
        </main>
      )}

      {view === 'saved' && (
        <main className="page">
          <h1 className="page-title">Bookmark Saya</h1>
          {TITLES.filter((t) => saved.has(t.id)).length === 0 && <p className="empty">Belum ada bookmark. Ketuk ikon bookmark di feed.</p>}
          <div className="saved-list">
            {TITLES.filter((t) => saved.has(t.id)).map((t) => (
              <button key={t.id} className="saved-item" onClick={() => setDetailId(t.id)}>
                <Poster t={t} className="saved-poster" />
                <span><b>{t.title}</b><small>{t.genre} · {t.episodes} episode · ★ {t.rating}</small></span>
                <i>›</i>
              </button>
            ))}
          </div>
        </main>
      )}

      {view === 'profile' && (
        <main className="page profile-page">
          <div className="profile-head">
            <div className="avatar"><IconUser size={40} /></div>
            <h1>Penonton Dracin</h1>
            <p>Progress, suka, bookmark, dan koin tersimpan di perangkat ini (localStorage).</p>
          </div>
          <div className="stats">
            <div><b>{coins}</b><span>Koin</span></div>
            <div><b>{saved.size}</b><span>Bookmark</span></div>
            <div><b>{liked.size}</b><span>Disukai</span></div>
          </div>
          <div className="profile-actions">
            <button className="btn-play" onClick={() => showToast('Beli koin via QRIS / GoPay / DANA (demo UI)')}><IconCoin size={16} /> Beli Koin</button>
            <button className="btn-ghost" onClick={() => setView('feed')}>Lanjutkan Nonton</button>
          </div>
          <h3 className="section-h">Lanjutkan Nonton</h3>
          {Object.keys(progress).length === 0 && <p className="empty">Belum ada progress. Putar satu episode dulu.</p>}
          {Object.keys(progress).map((id) => {
            const item = FEED.find((f) => f.id === id)
            if (!item) return null
            const t = titleById(item.titleId)
            return <button key={id} className="saved-item" onClick={() => playItem(item)}><Poster t={t} className="saved-poster" /><span><b>{t.title} — Episode {item.ep}</b><small>Progress tersimpan</small></span><i>›</i></button>
          })}
          <p className="note">Frontend siap produksi untuk UI — video contoh publik, tanpa backend. Ganti videoUrl di data.js dengan HLS judul asli saat produksi.</p>
        </main>
      )}

      {detail && (
        <div className="sheet-backdrop" onClick={() => setDetailId(null)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setDetailId(null)} aria-label="Tutup"><IconClose /></button>
            <Poster t={detail} className="sheet-poster" />
            <div className="sheet-body">
              <div className="reel-meta"><span className="pill-genre">{detail.genre}</span><span className="pill-rating"><IconStar size={12} /> {detail.rating}</span></div>
              <h2>{detail.title}</h2>
              <p>{detail.desc}</p>
              <p className="sheet-meta">{detail.episodes} episode · Episode 1–5 gratis · Sisanya iklan / koin</p>
              <h3>Daftar Episode (demo: 10 pertama)</h3>
              <div className="ep-grid">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((ep) => {
                  const free = ep <= 5
                  const item = { id: detail.id + '-' + ep, titleId: detail.id, ep }
                  const open = free || unlocked.has(item.id)
                  return (
                    <button key={ep} className={open ? 'ep free' : 'ep locked'} onClick={() => playItem(item)}>
                      <span>{ep}</span><small>{open ? 'Buka' : 'Terkunci'}</small>
                    </button>
                  )
                })}
              </div>
              <button className="btn-play full" onClick={() => { setDetailId(null); setView('feed'); showToast('Mulai dari Episode 1 — ' + detail.title) }}><IconPlay size={16} /> Mulai dari Episode 1</button>
            </div>
          </section>
        </div>
      )}

      {unlockEp && (
        <div className="sheet-backdrop" onClick={() => setUnlockEp(null)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <h2><IconLock size={20} /> Buka Episode {unlockEp.ep}</h2>
            <p>Tonton 1 iklan singkat untuk membuka episode ini, gratis. Atau pakai 10 koin.</p>
            <button className="btn-play full" onClick={() => { setUnlocked(new Set(unlocked).add(unlockEp.id)); setUnlockEp(null); showToast('Iklan selesai (demo) — episode terbuka!') }}><IconPlay size={16} /> Nonton Iklan (Demo)</button>
            <button className="btn-ghost full" onClick={() => setUnlockEp(null)}>Nanti Saja</button>
          </section>
        </div>
      )}

      {commentsFor && (
        <div className="sheet-backdrop" onClick={() => setCommentsFor(null)}>
          <section className="sheet sheet-comments" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setCommentsFor(null)} aria-label="Tutup"><IconClose /></button>
            <div className="sheet-body">
              <h2>Komentar</h2>
              <p className="sheet-meta">{titleById(commentsFor.titleId).title} — Episode {commentsFor.ep}</p>
              <div className="comment-list">
                {comments.map((c, i) => (
                  <div key={i} className="comment"><div className="comment-avatar">{c.user[0]}</div><div><b>{c.user}</b><p>{c.text}</p></div></div>
                ))}
              </div>
              <form className="comment-form" onSubmit={(e) => { e.preventDefault(); if (!commentText.trim()) return; setComments([{ user: 'Kamu', text: commentText }, ...comments]); setCommentText(''); showToast('Komentar terkirim (demo, hanya di perangkat ini)') }}>
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Tulis komentar…" />
                <button type="submit" aria-label="Kirim komentar"><IconSend /></button>
              </form>
            </div>
          </section>
        </div>
      )}

      {playing && (
        <Player
          item={playing}
          onClose={() => setPlaying(null)}
          onEnded={handleEnded}
          onProgress={(id, t, d) => setProgress((p) => ({ ...p, [id]: { t: Math.floor(t), d: Math.floor(d || 1) } }))}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

      <nav className="bottomnav">
        <button className={view === 'feed' ? 'active' : ''} onClick={() => setView('feed')}><IconHome /><small>Beranda</small></button>
        <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')}><IconSearch /><small>Cari</small></button>
        <button className={view === 'saved' ? 'active' : ''} onClick={() => setView('saved')}><IconBookmark /><small>Bookmark</small></button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}><IconUser /><small>Saya</small></button>
      </nav>

      <div className="crown-note"><IconCrown size={14} /> UI lengkap — player, komentar, dan progress sudah jalan di frontend</div>
    </div>
  )
}
