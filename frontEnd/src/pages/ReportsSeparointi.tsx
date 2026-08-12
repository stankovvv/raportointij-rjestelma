import { useState } from 'react'
import type { Page } from '../components/Layout'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface Props {
  onNavigate: (page: Page) => void
}

const ALL_ROWS = [
  { pvm: '12.08.2026', aika: '10:12', maara: 800, rasvapitoisuus: 3.8, lampotila: 55, laitteisto: 'Separaattori 1', operaattori: 'Antti Leinonen', huomiot: '' },
  { pvm: '12.08.2026', aika: '08:30', maara: 650, rasvapitoisuus: 4.2, lampotila: 58, laitteisto: 'Separaattori 2', operaattori: 'Antti Leinonen', huomiot: 'rasvapitoisuus korkea' },
  { pvm: '11.08.2026', aika: '15:00', maara: 900, rasvapitoisuus: 3.6, lampotila: 54, laitteisto: 'Separaattori 1', operaattori: 'Matti Virtanen', huomiot: '' },
  { pvm: '11.08.2026', aika: '10:00', maara: 750, rasvapitoisuus: 3.9, lampotila: 56, laitteisto: 'Separaattori 2', operaattori: 'Matti Virtanen', huomiot: '' },
  { pvm: '10.08.2026', aika: '12:00', maara: 820, rasvapitoisuus: 3.7, lampotila: 55, laitteisto: 'Separaattori 1', operaattori: 'Antti Leinonen', huomiot: '' },
]

const chartData = [
  { pvm: '06.08', maara: 1400, rasva: 3.7 },
  { pvm: '07.08', maara: 1850, rasva: 3.9 },
  { pvm: '08.08', maara: 1600, rasva: 3.6 },
  { pvm: '09.08', maara: 2100, rasva: 4.0 },
  { pvm: '10.08', maara: 1820, rasva: 3.7 },
  { pvm: '11.08', maara: 2650, rasva: 3.9 },
  { pvm: '12.08', maara: 1450, rasva: 4.0 },
]

export default function ReportsSeparointi({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterLaite, setFilterLaite] = useState('')
  const [filterOp, setFilterOp] = useState('')

  const filtered = ALL_ROWS.filter(r => {
    if (filterLaite && r.laitteisto !== filterLaite) return false
    if (filterOp && r.operaattori !== filterOp) return false
    if (search) {
      const q = search.toLowerCase()
      if (![r.pvm, r.laitteisto, r.operaattori, r.huomiot].some(v => v.toLowerCase().includes(q))) return false
    }
    return true
  })

  const operaattorit = [...new Set(ALL_ROWS.map(r => r.operaattori))]
  const laitteet = [...new Set(ALL_ROWS.map(r => r.laitteisto))]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Raportit — Separointi</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Separoinnin tuotantodatan analysointi ja raportointi</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['report-keitto', 'report-pakkaamo'] as Page[]).map(p => (
            <button key={p} onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'report-keitto' ? 'Keitto' : 'Pakkaamo'}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-end" style={{ borderColor: '#e2eaf0' }}>
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Hae</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
            onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
            onBlur={e => (e.target.style.borderColor = '#d1dce5')}
            placeholder="Hae kaikista kentistä..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Laitteisto</label>
          <select value={filterLaite} onChange={e => setFilterLaite(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
          >
            <option value="">Kaikki</option>
            {laitteet.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Operaattori</label>
          <select value={filterOp} onChange={e => setFilterOp(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
          >
            <option value="">Kaikki</option>
            {operaattorit.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <button
          onClick={() => { setSearch(''); setFilterLaite(''); setFilterOp('') }}
          className="px-4 py-2 rounded-lg text-sm border transition-colors"
          style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
        >
          Tyhjennä
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border p-5 mb-5" style={{ borderColor: '#e2eaf0' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1a2733' }}>Separoinnin tuotantomäärät — määrä & rasvapitoisuus</h2>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
            <XAxis dataKey="pvm" tick={{ fontSize: 12, fill: '#5a7080' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[3, 4.5]} tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2eaf0', boxShadow: 'none' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#5a7080' }} />
            <Bar yAxisId="left" dataKey="maara" fill="#0d6e8f" radius={[4, 4, 0, 0]} name="Määrä (l)" />
            <Line yAxisId="right" type="monotone" dataKey="rasva" stroke="#d97706" strokeWidth={2} dot={false} name="Rasvapitoisuus (%)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2eaf0' }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Separointidata</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8aa3b0' }}>{filtered.length} riviä</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
            style={{ borderColor: '#d1dce5', color: '#0d4f6e', background: 'white' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f0f8fc')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Vie raportti
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2eaf0' }}>
                {['Päivämäärä', 'Aika', 'Määrä (l)', 'Rasvapitoisuus (%)', 'Lämpötila (°C)', 'Laitteisto', 'Operaattori', 'Huomiot'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#8aa3b0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b hover:bg-slate-50" style={{ borderColor: '#f0f4f7' }}>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.pvm}</td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.aika}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.maara}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.rasvapitoisuus}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.lampotila}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1a2733' }}>{r.laitteisto}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5a7080' }}>{r.operaattori}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8aa3b0' }}>{r.huomiot || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: '#8aa3b0' }}>Ei tuloksia hakuehdoilla.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
