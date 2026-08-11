import { useState } from 'react'
import Etusivu from './pages/Etusivu'
import Tietojensyotto from './pages/Tietojensyotto'
import Raportit from './pages/Raportit'

type Page = 'etusivu' | 'tietojensyotto' | 'raportit'

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'etusivu', label: 'Etusivu', icon: '⌂' },
  { id: 'tietojensyotto', label: 'Tietojensyöttö', icon: '✎' },
  { id: 'raportit', label: 'Raportit', icon: '⊞' },
]

export default function App() {
  const [page, setPage] = useState<Page>('etusivu')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 64,
          minHeight: '100vh',
          background: 'var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarOpen ? '28px 24px 20px' : '28px 0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              color: '#fff',
              fontWeight: 400,
              flexShrink: 0,
            }}
          >
            V
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#fff', lineHeight: 1.1 }}>
                Valio
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Raportit
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map((item) => {
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: sidebarOpen ? '11px 20px' : '11px 0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '3px solid rgba(255,255,255,0.8)' : '3px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                  }
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            margin: '0 0 20px',
            padding: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
            transition: 'background 0.15s',
            alignSelf: 'center',
            borderRadius: 6,
            width: sidebarOpen ? 'calc(100% - 32px)' : 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <span style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s', display: 'inline-block' }}>◀</span>
          {sidebarOpen && <span>Pienennä</span>}
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minHeight: '100vh', overflow: 'auto' }}>
        {page === 'etusivu' && <Etusivu onNavigate={setPage} />}
        {page === 'tietojensyotto' && <Tietojensyotto />}
        {page === 'raportit' && <Raportit />}
      </main>
    </div>
  )
}
