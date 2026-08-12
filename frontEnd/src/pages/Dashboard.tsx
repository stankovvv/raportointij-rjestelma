import type { Page } from '../components/Layout'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

interface DashboardProps {
  onNavigate: (page: Page) => void
  userRole: 'operaattori' | 'esimies'
}

const kpiData = [
  {
    osasto: 'Keitto',
    maara: '4 820 l',
    era: 'Erä #K-2026-0812',
    status: 'ok',
    info: 'Viim. erä: 09:45',
  },
  {
    osasto: 'Pakkaamo',
    maara: '12 340 kpl',
    era: 'Erä #P-2026-0812',
    status: 'warning',
    info: 'Linja 2 hitaampi',
  },
  {
    osasto: 'Separointi',
    maara: '3 200 l',
    era: 'Erä #S-2026-0812',
    status: 'ok',
    info: 'Rasvapitoisuus: 3.8%',
  },
]

const barData = [
  { name: 'Keitto', maara: 4820 },
  { name: 'Pakkaamo', maara: 3100 },
  { name: 'Separointi', maara: 3200 },
]

const weekData = [
  { pv: 'Ma', keitto: 4200, pakkaamo: 2800, separointi: 2900 },
  { pv: 'Ti', keitto: 4600, pakkaamo: 3100, separointi: 3050 },
  { pv: 'Ke', keitto: 4100, pakkaamo: 2950, separointi: 2800 },
  { pv: 'To', keitto: 5200, pakkaamo: 3400, separointi: 3500 },
  { pv: 'Pe', keitto: 4820, pakkaamo: 3100, separointi: 3200 },
  { pv: 'La', keitto: 3800, pakkaamo: 2400, separointi: 2600 },
  { pv: 'Su', keitto: 2100, pakkaamo: 1200, separointi: 1800 },
]

const events = [
  { time: '11:22', osasto: 'Pakkaamo', tapahtuma: 'Linja 2 nopeus laskenut 15%', operaattori: 'Liisa Mäkinen', type: 'warning' },
  { time: '10:55', osasto: 'Keitto', tapahtuma: 'Erä #K-0812 valmis, 500 l maito', operaattori: 'Matti Virtanen', type: 'ok' },
  { time: '10:12', osasto: 'Separointi', tapahtuma: 'Separaattori 1 käynnistetty', operaattori: 'Antti Leinonen', type: 'ok' },
  { time: '09:45', osasto: 'Keitto', tapahtuma: 'Lämpötila 83°C — tarkistettu', operaattori: 'Matti Virtanen', type: 'ok' },
  { time: '09:10', osasto: 'Pakkaamo', tapahtuma: 'Aamuvaihdon aloitus, 3 linja', operaattori: 'Liisa Mäkinen', type: 'ok' },
  { time: '08:30', osasto: 'Separointi', tapahtuma: 'Huomio: rasvapitoisuus 4.2% — korkea', operaattori: 'Antti Leinonen', type: 'warning' },
]

const statusColor = (s: string) =>
  s === 'ok' ? '#16a34a' : s === 'warning' ? '#d97706' : '#dc2626'

const statusBg = (s: string) =>
  s === 'ok' ? '#f0fdf4' : s === 'warning' ? '#fffbeb' : '#fef2f2'

export default function Dashboard({ onNavigate, userRole }: DashboardProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Etusivu</h1>
        <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>
          Tuotannon yhteenveto · {new Date().toLocaleDateString('fi-FI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {kpiData.map(k => (
          <div
            key={k.osasto}
            className="bg-white rounded-xl p-5 border"
            style={{ borderColor: '#e2eaf0' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5a7080' }}>
                {k.osasto}
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ color: statusColor(k.status), background: statusBg(k.status) }}
              >
                {k.status === 'ok' ? 'Normaali' : 'Huomio'}
              </span>
            </div>
            <div className="text-2xl font-bold mono mb-1" style={{ color: '#0d4f6e' }}>
              {k.maara}
            </div>
            <div className="text-xs" style={{ color: '#5a7080' }}>{k.era}</div>
            <div className="text-xs mt-1" style={{ color: '#8aa3b0' }}>{k.info}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1a2733' }}>
            Tuotantomäärät osastoittain — tänään
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5a7080' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2eaf0', boxShadow: 'none' }}
                formatter={(v: number) => [`${v.toLocaleString('fi-FI')} l/kpl`, 'Määrä']}
              />
              <Bar dataKey="maara" fill="#0d6e8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1a2733' }}>
            Tuotantomäärät viikoittain osastoittain
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f5" />
              <XAxis dataKey="pv" tick={{ fontSize: 12, fill: '#5a7080' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5a7080', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2eaf0', boxShadow: 'none' }}
                formatter={(v: number) => [`${v.toLocaleString('fi-FI')} l/kpl`]}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#5a7080' }} />
              <Line type="monotone" dataKey="keitto" stroke="#0d6e8f" strokeWidth={2} dot={false} name="Keitto" />
              <Line type="monotone" dataKey="pakkaamo" stroke="#16a34a" strokeWidth={2} dot={false} name="Pakkaamo" />
              <Line type="monotone" dataKey="separointi" stroke="#d97706" strokeWidth={2} dot={false} name="Separointi" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Viimeisimmät tapahtumat</h2>
          <span className="text-xs mono" style={{ color: '#8aa3b0' }}>tänään {new Date().toLocaleDateString('fi-FI')}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2eaf0' }}>
                {['Aika', 'Osasto', 'Tapahtuma', 'Operaattori'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#8aa3b0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors hover:bg-slate-50"
                  style={{ borderColor: '#f0f4f7' }}
                >
                  <td className="px-5 py-3 mono text-xs" style={{ color: '#5a7080' }}>{ev.time}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium" style={{ color: '#1a2733' }}>{ev.osasto}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: statusColor(ev.type) }}
                      />
                      <span style={{ color: '#1a2733' }}>{ev.tapahtuma}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#5a7080' }}>{ev.operaattori}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => onNavigate('entry-keitto')}
          className="px-5 py-3 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ background: '#0d4f6e' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0a3d56')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0d4f6e')}
        >
          + Syötä tiedot
        </button>
        {userRole === 'esimies' && (
          <button
            onClick={() => onNavigate('report-keitto')}
            className="px-5 py-3 rounded-lg text-sm font-medium transition-colors border"
            style={{ color: '#0d4f6e', borderColor: '#0d4f6e', background: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f0f8fc' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
          >
            Katso raportit
          </button>
        )}
      </div>
    </div>
  )
}
