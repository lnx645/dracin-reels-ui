import { useMemo, useState } from 'react'
import { FEED, TITLES, titleById } from './data.js'

const GENRES = ['Semua', 'CEO', 'Balas Dendam', 'Kostum', 'Romantis']

export default function App() {
  const [view, setView] = useState('feed')
  const [detailId, setDetailId] = useState(null)
  const [unlockEp, setUnlockEp] = useState(null)
  const [liked, setLiked] = useState(new Set())
  const [saved, setSaved] = useState(new Set(['ceo']))
  const [unlocked, setUnlocked] = useState(new Set())
  const [coins, setCoins] = useState(120)
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('Semua')

  const showToast = (msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2600)
  }

  const toggle = (set, setFn, id) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setFn(next)
  }

  const detail = detailId ? titleById(detailId) : null

  const filteredTitles = useMemo(() => {
    return TITLES.filter((t) => {
      const okGenre = genre === 'Semua' || t.genre === genre
      const okQuery = t.title.toLowerCase().includes(query.toLowerCase())
      return okGenre && okQuery
    })
  }, [genre, query])

  const isUnlocked = (item) => item.free || unlocked.has(item.id)

  return (
    <div className="phone">
      <header className="topbar">
        <div className="logo">Dracin<span>Reels</span></div>
        <button className="coin-pill" onClick={() => showToast('Koin kamu: ' + coins + ' — beli koin via QRIS (demo UI)')}>
          🪙 {coins} Koin
        </button>
      </header>

      {view === 'feed' && (
        <main className="feed">
          {FEED.map((item) => {
            const t = titleById(item.titleId)
            const open = isUnlocked(item)
            return (
              <article className="reel" key={item.id}>
                <div className="reel-poster poster-art" style={{ background: t.gradient }}><span className="poster-emoji">{t.emoji}</span><span className="poster-word">{t.genre}</span></div>
                <div className="reel-shade" />
                <div className="reel-progress"><i style={{ width: item.ep === 1 ? '12%' : '0%' }} /></div>

                <div className="reel-actions">
                  <button
                    className={liked.has(item.id) ? 'act active' : 'act'}
                    onClick={() => { toggle(liked, setLiked, item.id); if (!liked.has(item.id)) showToast('Disukai ❤️') }}
                    aria-label="Suka"
                  >
                    <span>{liked.has(item.id) ? '❤️' : '🤍'}</span><small>{item.likes}</small>
                  </button>
                  <button className="act" onClick={() => showToast('Komentar (demo UI) — ' + item.comments.toLocaleString('id-ID') + ' komentar')}>
                    <span>💬</span><small>{item.comments.toLocaleString('id-ID')}</small>
                  </button>
                  <button
                    className={saved.has(t.id) ? 'act active' : 'act'}
                    onClick={() => { toggle(saved, setSaved, t.id); showToast(saved.has(t.id) ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark 🔖') }}
                    aria-label="Simpan"
                  >
                    <span>{saved.has(t.id) ? '🔖' : '📑'}</span><small>Simpan</small>
                  </button>
                  <button className="act" onClick={() => showToast('Link episode disalin (demo UI)')}>
                    <span>↗️</span><small>Bagikan</small>
                  </button>
                </div>

                <div className="reel-info">
                  <div className="reel-meta">
                    <span className="pill-genre">{t.genre}</span>
                    <span className="pill-ep">Episode {item.ep} / {t.episodes}</span>
                    <span className="pill-rating">★ {t.rating}</span>
                  </div>
                  <h2 onClick={() => setDetailId(t.id)}>{t.title}</h2>
                  <p>{t.desc}</p>
                  {!open ? (
                    <div className="locked-box">
                      <div className="locked-title">🔒 Episode terkunci</div>
                      <p className="locked-text">Episode 1–5 gratis. Buka episode ini dengan iklan atau koin.</p>
                      <div className="locked-btns">
                        <button className="btn-ad" onClick={() => setUnlockEp(item)}>▶ Nonton Iklan</button>
                        <button className="btn-coin" onClick={() => {
                          if (coins < 10) { showToast('Koin tidak cukup — beli koin dulu'); return }
                          setCoins(coins - 10); setUnlocked(new Set(unlocked).add(item.id)); showToast('Episode terbuka! −10 koin')
                        }}>🪙 10 Koin</button>
                      </div>
                    </div>
                  ) : (
                    <div className="watch-row">
                      <button className="btn-play" onClick={() => showToast('Memutar Episode ' + item.ep + ' — ' + t.title + ' (demo UI, video belum disambungkan)')}>▶ Tonton Episode {item.ep}</button>
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
          <input
            className="search-input"
            placeholder="Cari judul, misal CEO, balas dendam…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="chips">
            {GENRES.map((g) => (
              <button key={g} className={genre === g ? 'chip active' : 'chip'} onClick={() => setGenre(g)}>{g}</button>
            ))}
          </div>
          <div className="title-grid">
            {filteredTitles.map((t) => (
              <button key={t.id} className="title-card" onClick={() => setDetailId(t.id)}>
                <div className="card-poster poster-art" style={{ background: t.gradient }}><span className="poster-emoji">{t.emoji}</span></div>
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
                <div className="saved-poster poster-art" style={{ background: t.gradient }}><span>{t.emoji}</span></div>
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
            <div className="avatar">U</div>
            <h1>Penonton Dracin</h1>
            <p>Akun demo UI — belum ada backend</p>
          </div>
          <div className="stats">
            <div><b>{coins}</b><span>Koin</span></div>
            <div><b>{saved.size}</b><span>Bookmark</span></div>
            <div><b>{liked.size}</b><span>Disukai</span></div>
          </div>
          <div className="profile-actions">
            <button className="btn-play" onClick={() => showToast('Beli koin via QRIS / GoPay / DANA (demo UI)')}>🪙 Beli Koin</button>
            <button className="btn-ghost" onClick={() => showToast('Riwayat nonton (demo UI)')}>🕘 Riwayat Nonton</button>
          </div>
          <p className="note">UI only — video, login, pembayaran, dan iklan belum disambungkan ke backend.</p>
        </main>
      )}

      {detail && (
        <div className="sheet-backdrop" onClick={() => setDetailId(null)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setDetailId(null)}>✕</button>
            <div className="sheet-poster poster-art" style={{ background: detail.gradient }}><span className="poster-emoji">{detail.emoji}</span><span className="poster-word">{detail.genre}</span></div>
            <div className="sheet-body">
              <div className="reel-meta">
                <span className="pill-genre">{detail.genre}</span>
                <span className="pill-rating">★ {detail.rating}</span>
              </div>
              <h2>{detail.title}</h2>
              <p>{detail.desc}</p>
              <p className="sheet-meta">{detail.episodes} episode · Episode 1–5 gratis · Sisanya iklan / koin</p>
              <h3>Daftar Episode (demo: 10 pertama)</h3>
              <div className="ep-grid">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((ep) => {
                  const free = ep <= 5
                  return (
                    <button
                      key={ep}
                      className={free ? 'ep free' : 'ep locked'}
                      onClick={() => {
                        if (!free) { showToast('Episode ' + ep + ' terkunci — buka dengan iklan / koin di feed'); return }
                        showToast('Memutar Episode ' + ep + ' — ' + detail.title + ' (demo UI)')
                      }}
                    >
                      <span>{ep}</span><small>{free ? 'Gratis' : '🔒'}</small>
                    </button>
                  )
                })}
              </div>
              <button className="btn-play full" onClick={() => { setDetailId(null); setView('feed'); showToast('Mulai dari Episode 1 — ' + detail.title) }}>▶ Mulai dari Episode 1</button>
            </div>
          </section>
        </div>
      )}

      {unlockEp && (
        <div className="sheet-backdrop" onClick={() => setUnlockEp(null)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🔓 Buka Episode {unlockEp.ep}</h2>
            <p>Tonton 1 iklan singkat untuk membuka episode ini, gratis. Atau pakai 10 koin.</p>
            <button className="btn-play full" onClick={() => {
              setUnlocked(new Set(unlocked).add(unlockEp.id)); setUnlockEp(null); showToast('Iklan selesai (demo) — episode terbuka!')
            }}>▶ Nonton Iklan (Demo)</button>
            <button className="btn-ghost full" onClick={() => setUnlockEp(null)}>Nanti Saja</button>
          </section>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      <nav className="bottomnav">
        <button className={view === 'feed' ? 'active' : ''} onClick={() => setView('feed')}><span>🏠</span><small>Beranda</small></button>
        <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')}><span>🔍</span><small>Cari</small></button>
        <button className={view === 'saved' ? 'active' : ''} onClick={() => setView('saved')}><span>🔖</span><small>Bookmark</small></button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}><span>👤</span><small>Saya</small></button>
      </nav>
    </div>
  )
}
