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
  { pvm: '12.08.2026', aika: '10:30', tuote: 'Jogurtti', pakkaukset: 840, paino: 420, linja: 'Linja 1', operaattori: 'Liisa Mäkinen', huomiot: 'nopea erä' },
  { pvm: '12.08.2026', aika: '09:00', tuote: 'Rahka', pakkaukset: 600, paino: 300, linja: 'Linja 2', operaattori: 'Liisa Mäkinen', huomiot: '' },
  { pvm: '11.08.2026', aika: '13:45', tuote: 'Jogurtti', pakkaukset: 1200, paino: 600, linja: 'Linja 1', operaattori: 'Pekka Saari', huomiot: 'ylitys 5%' },
  { pvm: '11.08.2026', aika: '09:15', tuote: 'Kermaviili', pakkaukset: 480, paino: 240, linja: 'Linja 3', operaattori: 'Pekka Saari', huomiot: '' },
  { pvm: '10.08.2026', aika: '11:30', tuote: 'Rahka', pakkaukset: 720, paino: 360, linja: 'Linja 2', operaattori: 'Liisa Mäkinen', huomiot: '' },
]

const chartData = [
  { pvm: '06.08', pakkaukset: 2400, paino: 1.2 },
  { pvm: '07.08', pakkaukset: 3100, paino: 1.55 },
  { pvm: '08.08', pakkaukset: 2800, paino: 1.4 },
  { pvm: '09.08', pakkaukset: 3600, paino: 1.8 },
  { pvm: '10.08', pakkaukset: 3200, paino: 1.6 },
  { pvm: '11.08', pakkaukset: 4280, paino: 2.14 },
  { pvm: '12.08', pakkaukset: 2840, paino: 1.42 },
]

export default function ReportsPakkaamo({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterTuote, setFilterTuote] = useState('')
  const [filterOp, setFilterOp] = useState('')

  const filtered = ALL_ROWS.filter(r => {
    if (filterTuote && r.tuote !== filterTuote) return false
    if (filterOp && r.operaattori !== filterOp) return false
    if (search) {
      const q = search.toLowerCase()
      if (![r.pvm, r.tuote, r.operaattori, r.linja, r.huomiot].some(v => v.toLowerCase().includes(q))) return false
    }
    return true
  })

  const operaattorit = [...new Set(ALL_ROWS.map(r => r.operaattori))]
  const tuotteet = [...new Set(ALL_ROWS.map(r => r.tuote))]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Raportit — Pakkaamo</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Pakkaamon tuotantodatan analysointi ja raportointi</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['report-keitto', 'report-separointi'] as Page[]).map(p => (
            <button key={p} onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'report-keitto' ? 'Keitto' : 'Separointi'}
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
          onClick={() => { setSearch(''); setFilterTuote(''); setFilterOp('') }}
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
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1a2733' }}>Pakkaamon tuotantomäärät — pakkaukset & paino</h2>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
            <XAxis dataKey="pvm" tick={{ fontSize: 12, fill: '#5a7080' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2eaf0', boxShadow: 'none' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#5a7080' }} />
            <Bar yAxisId="left" dataKey="pakkaukset" fill="#16a34a" radius={[4, 4, 0, 0]} name="Pakkaukset (kpl)" />
            <Line yAxisId="right" type="monotone" dataKey="paino" stroke="#0d6e8f" strokeWidth={2} dot={false} name="Paino (tonnia)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2eaf0' }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Pakkaamodata</h2>
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
                {['Päivämäärä', 'Aika', 'Tuote', 'Pakkaukset (kpl)', 'Paino (kg)', 'Linja', 'Operaattori', 'Huomiot'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#8aa3b0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b hover:bg-slate-50" style={{ borderColor: '#f0f4f7' }}>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.pvm}</td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: '#5a7080' }}>{r.aika}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1a2733' }}>{r.tuote}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.pakkaukset}</td>
                  <td className="px-4 py-3 mono text-xs text-right" style={{ color: '#1a2733' }}>{r.paino}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#1a2733' }}>{r.linja}</td>
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
