import { useState } from 'react'

export type Page =
  | 'dashboard'
  | 'entry-keitto'
  | 'entry-pakkaamo'
  | 'entry-separointi'
  | 'report-keitto'
  | 'report-pakkaamo'
  | 'report-separointi'

interface LayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  userRole: 'operaattori' | 'esimies'
  userName: string
  onLogout: () => void
  children: React.ReactNode
}

export default function Layout({ currentPage, onNavigate, userRole, userName, onLogout, children }: LayoutProps) {
  const [entryOpen, setEntryOpen] = useState(
    currentPage.startsWith('entry-')
  )
  const [reportOpen, setReportOpen] = useState(
    currentPage.startsWith('report-')
  )

  const navLink = (label: string, page: Page) => {
    const active = currentPage === page
    return (
      <button
        key={page}
        onClick={() => onNavigate(page)}
        className={`w-full text-left px-4 py-2.5 text-sm rounded transition-colors ${
          active
            ? 'bg-white/20 text-white font-semibold'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f0f4f7' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col w-56 shrink-0"
        style={{ background: '#0d4f6e', minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-white font-bold text-base leading-tight">
            Meijeri
          </div>
          <div className="text-white/60 text-xs mt-0.5 mono uppercase tracking-widest">
            Tuotanto
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navLink('Etusivu', 'dashboard')}

          {/* Tietojensyöttö */}
          <div>
            <button
              onClick={() => setEntryOpen(!entryOpen)}
              className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors flex items-center justify-between"
            >
              <span>Tietojensyöttö</span>
              <svg
                className={`w-3.5 h-3.5 opacity-60 transition-transform ${entryOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {entryOpen && (
              <div className="ml-3 space-y-0.5 mt-0.5">
                {navLink('↳ Keitto', 'entry-keitto')}
                {navLink('↳ Pakkaamo', 'entry-pakkaamo')}
                {navLink('↳ Separointi', 'entry-separointi')}
              </div>
            )}
          </div>

          {/* Raportit — only for esimies */}
          {userRole === 'esimies' && (
            <div>
              <button
                onClick={() => setReportOpen(!reportOpen)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors flex items-center justify-between"
              >
                <span>Raportit</span>
                <svg
                  className={`w-3.5 h-3.5 opacity-60 transition-transform ${reportOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {reportOpen && (
                <div className="ml-3 space-y-0.5 mt-0.5">
                  {navLink('↳ Keitto', 'report-keitto')}
                  {navLink('↳ Pakkaamo', 'report-pakkaamo')}
                  {navLink('↳ Separointi', 'report-separointi')}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-white/90 text-sm font-medium truncate">{userName}</div>
          <div className="text-white/50 text-xs mt-0.5 capitalize">{userRole}</div>
          <button
            onClick={onLogout}
            className="mt-3 text-xs text-white/50 hover:text-white/90 transition-colors"
          >
            Kirjaudu ulos
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
