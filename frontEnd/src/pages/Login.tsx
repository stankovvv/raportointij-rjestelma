import { useState } from 'react'

interface LoginProps {
  onLogin: (role: 'operaattori' | 'esimies', name: string) => void
}

const USERS = [
  { username: 'matti.virtanen', password: 'meijeri1', name: 'Matti Virtanen', role: 'operaattori' as const },
  { username: 'liisa.makinen', password: 'meijeri2', name: 'Liisa Mäkinen', role: 'operaattori' as const },
  { username: 'esimies', password: 'esimies123', name: 'Timo Korhonen', role: 'esimies' as const },
]

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = USERS.find(u => u.username === username && u.password === password)
    if (user) {
      onLogin(user.role, user.name)
    } else {
      setError('Virheellinen käyttäjätunnus tai salasana.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0d4f6e' }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Raportointijärjestelmä</h1>
          <p className="text-white/60 text-sm mt-1 mono">MEIJERITEOLLISUUS · TUOTANTO</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1a2733' }}>Kirjaudu sisään</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>
                Käyttäjätunnus
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
                onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => (e.target.style.borderColor = '#d1dce5')}
                placeholder="käyttäjätunnus"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>
                Salasana
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
                onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => (e.target.style.borderColor = '#d1dce5')}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors mt-2"
              style={{ background: '#0d4f6e' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0a3d56')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0d4f6e')}
            >
              Kirjaudu
            </button>
          </form>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: '#e8eef3' }}>
            <p className="text-xs mb-2" style={{ color: '#9ab0bc' }}>Demo-tunnukset:</p>
            <div className="space-y-1 mono text-xs" style={{ color: '#7a9aaa' }}>
              <div>operaattori: <span style={{ color: '#1a2733' }}>matti.virtanen / meijeri1</span></div>
              <div>esimies: <span style={{ color: '#1a2733' }}>esimies / esimies123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
