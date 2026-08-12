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
  { pvm: '12.08.2026', aika: '09:45', tuote: 'Maito', maara: 500, lampotila: 80, kesto: 50, operaattori: 'Matti Virtanen', huomiot: 'laktoosi' },
  { pvm: '12.08.2026', aika: '08:15', tuote: 'Kerma', maara: 320, lampotila: 75, kesto: 45, operaattori: 'Matti Virtanen', huomiot: '' },
  { pvm: '11.08.2026', aika: '14:00', tuote: 'Maito', maara: 600, lampotila: 82, kesto: 55, operaattori: 'Antti Leinonen', huomiot: 'rasvainen erä' },
  { pvm: '11.08.2026', aika: '09:30', tuote: 'Kerma', maara: 280, lampotila: 74, kesto: 42, operaattori: 'Antti Leinonen', huomiot: '' },
  { pvm: '10.08.2026', aika: '11:00', tuote: 'Maito', maara: 550, lampotila: 79, kesto: 48, operaattori: 'Matti Virtanen', huomiot: '' },
]

const chartData = [
  { pvm: '06.08', maara: 420, lampotila: 78 },
  { pvm: '07.08', maara: 580, lampotila: 81 },
  { pvm: '08.08', maara: 490, lampotila: 77 },
  { pvm: '09.08', maara: 630, lampotila: 83 },
  { pvm: '10.08', maara: 550, lampotila: 79 },
  { pvm: '11.08', maara: 880, lampotila: 78 },
  { pvm: '12.08', maara: 820, lampotila: 80 },
]

export default function ReportsKeitto({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterTuote, setFilterTuote] = useState('')
  const [filterOp, setFilterOp] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const filtered = ALL_ROWS.filter(r => {
    if (filterTuote && r.tuote !== filterTuote) return false
    if (filterOp && r.operaattori !== filterOp) return false
    if (search) {
      const q = search.toLowerCase()
      if (![r.pvm, r.tuote, r.operaattori, r.huomiot].some(v => v.toLowerCase().includes(q))) return false
    }
    return true
  })

  const operaattorit = [...new Set(ALL_ROWS.map(r => r.operaattori))]
  const tuotteet = [...new Set(ALL_ROWS.map(r => r.tuote))]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Raportit — Keitto</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Keiton tuotantodatan analysointi ja raportointi</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['report-pakkaamo', 'report-separointi'] as Page[]).map(p => (
            <button key={p} onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'report-pakkaamo' ? 'Pakkaamo' : 'Separointi'}
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
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Alkaen</label>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
            onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
            onBlur={e => (e.target.style.borderColor = '#d1dce5')}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Päättyen</label>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
            onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
            onBlur={e => (e.target.style.borderColor = '#d1dce5')}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Tuote</label>
          <select value={filterTuote} onChange={e => setFilterTuote(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d1dce5', background: '#f8fbfd' }}
          >
            <option value="">Kaikki</option>
            {tuotteet.map(t => <option key={t} value={t}>{t}</option>)}
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
          onClick={() => { setSearch(''); setFilterTuote(''); setFilterOp(''); setFilterFrom(''); setFilterTo('') }}
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
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1a2733' }}>Keiton tuotantomäärät — määrä & lämpötila</h2>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
            <XAxis dataKey="pvm" tick={{ fontSize: 12, fill: '#5a7080' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2eaf0', boxShadow: 'none' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#5a7080' }} />
            <Bar yAxisId="left" dataKey="maara" fill="#0d6e8f" radius={[4, 4, 0, 0]} name="Määrä (l)" />
            <Line yAxisId="right" type="monotone" dataKey="lampotila" stroke="#d97706" strokeWidth={2} dot={false} name="Lämpötila (°C)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2eaf0' }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Keittodata</h2>
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
                {['Päivämäärä', 'Aika', 'Tuote', 'Määrä (l)', 'Lämpötila (°C)', 'Kesto (min)', 'Operaattori', 'Huomiot'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors" style={{ color: '#8aa3b0' }}>{h} ↕</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b hover:bg-slate-50" style={{ borderColor: '#f0f4f7' }}>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.pvm}</td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.aika}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1a2733' }}>{r.tuote}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.maara}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.lampotila}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.kesto}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5a7080' }}>{r.operaattori}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8aa3b0' }}>{r.huomiot || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: '#8aa3b0' }}>
                    Ei tuloksia hakuehdoilla.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
