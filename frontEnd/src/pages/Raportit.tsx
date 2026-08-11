import { useState } from 'react'

type Tab = 'yhteenveto' | 'tilat' | 'laatu'

const raporttiData = [
  { tila: 'Tila Mäkinen', id: 'T-001', maara: 8640, rasva: 4.18, proteiini: 3.38, soluluku: 172, laatu: 'E', raportit: 31, status: 'aktiivinen' },
  { tila: 'Tila Korhonen', id: 'T-002', maara: 7210, rasva: 4.02, proteiini: 3.31, soluluku: 198, laatu: 'E', raportit: 31, status: 'aktiivinen' },
  { tila: 'Tila Virtanen', id: 'T-003', maara: 7850, rasva: 3.89, proteiini: 3.28, soluluku: 312, laatu: 'I', raportit: 29, status: 'tarkistuksessa' },
  { tila: 'Tila Leinonen', id: 'T-004', maara: 5400, rasva: 4.31, proteiini: 3.42, soluluku: 145, laatu: 'E', raportit: 31, status: 'aktiivinen' },
  { tila: 'Tila Heikkinen', id: 'T-005', maara: 9240, rasva: 4.05, proteiini: 3.35, soluluku: 188, laatu: 'E', raportit: 30, status: 'aktiivinen' },
  { tila: 'Tila Nieminen', id: 'T-006', maara: 4870, rasva: 3.76, proteiini: 3.19, soluluku: 425, laatu: 'II', raportit: 27, status: 'varoitus' },
  { tila: 'Tila Järvinen', id: 'T-007', maara: 6320, rasva: 4.22, proteiini: 3.40, soluluku: 161, laatu: 'E', raportit: 31, status: 'aktiivinen' },
  { tila: 'Tila Saarinen', id: 'T-008', maara: 7100, rasva: 3.98, proteiini: 3.29, soluluku: 207, laatu: 'E', raportit: 31, status: 'aktiivinen' },
]

const kuukausittain = [
  { kk: 'Tammikuu', maara: 84200, tiloja: 24, e_luokka: 91, soluluku_avg: 192 },
  { kk: 'Helmikuu', maara: 78400, tiloja: 24, e_luokka: 89, soluluku_avg: 201 },
  { kk: 'Maaliskuu', maara: 89100, tiloja: 25, e_luokka: 92, soluluku_avg: 185 },
  { kk: 'Huhtikuu', maara: 87600, tiloja: 25, e_luokka: 90, soluluku_avg: 194 },
  { kk: 'Toukokuu', maara: 92300, tiloja: 26, e_luokka: 94, soluluku_avg: 178 },
  { kk: 'Kesäkuu', maara: 96100, tiloja: 26, e_luokka: 93, soluluku_avg: 182 },
  { kk: 'Heinäkuu', maara: 56630, tiloja: 8, e_luokka: 88, soluluku_avg: 206 },
]

type SortKey = 'tila' | 'maara' | 'rasva' | 'proteiini' | 'soluluku' | 'raportit'

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  aktiivinen: { bg: '#f0fdf4', text: '#16a34a', label: 'Aktiivinen' },
  tarkistuksessa: { bg: '#fef3c7', text: '#b45309', label: 'Tarkistuksessa' },
  varoitus: { bg: '#fef2f2', text: '#dc2626', label: 'Varoitus' },
}

const laatu_bg: Record<string, string> = {
  E: '#eff6ff',
  I: '#fef3c7',
  II: '#fef2f2',
}
const laatu_text: Record<string, string> = {
  E: '#1d4ed8',
  I: '#b45309',
  II: '#dc2626',
}

export default function Raportit() {
  const [tab, setTab] = useState<Tab>('yhteenveto')
  const [sortKey, setSortKey] = useState<SortKey>('tila')
  const [sortAsc, setSortAsc] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('kaikki')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const filtered = raporttiData
    .filter((r) => {
      const matchSearch = r.tila.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'kaikki' || r.status === filterStatus
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
      return sortAsc ? cmp : -cmp
    })

  const totalMaara = raporttiData.reduce((s, r) => s + r.maara, 0)
  const avgRasva = (raporttiData.reduce((s, r) => s + r.rasva, 0) / raporttiData.length).toFixed(2)
  const avgProteiini = (raporttiData.reduce((s, r) => s + r.proteiini, 0) / raporttiData.length).toFixed(2)
  const avgSoluluku = Math.round(raporttiData.reduce((s, r) => s + r.soluluku, 0) / raporttiData.length)
  const eCount = raporttiData.filter((r) => r.laatu === 'E').length

  const ThBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      onClick={() => handleSort(col)}
      style={{
        padding: '10px 14px',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--muted-foreground)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        background: sortKey === col ? 'var(--muted)' : 'var(--secondary)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
    >
      {label}
      {sortKey === col && (
        <span style={{ marginLeft: 4, opacity: 0.6 }}>{sortAsc ? '↑' : '↓'}</span>
      )}
    </th>
  )

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Analytiikka & data
        </p>
        <h1 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, color: 'var(--foreground)' }}>
          Raportit
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
        {([
          { id: 'yhteenveto', label: 'Yhteenveto' },
          { id: 'tilat', label: 'Tilakohtaiset raportit' },
          { id: 'laatu', label: 'Kuukausittainen raportti' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'transparent',
              color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: tab === t.id ? 600 : 400,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'yhteenveto' && (
        <div>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Tilat yhteensä', value: raporttiData.length.toString(), unit: 'tilaa' },
              { label: 'Kokonaistuotanto', value: totalMaara.toLocaleString('fi-FI'), unit: 'litraa / kk' },
              { label: 'E-luokka tilat', value: `${eCount} / ${raporttiData.length}`, unit: `${Math.round((eCount / raporttiData.length) * 100)}%` },
              { label: 'Rasva ka.', value: avgRasva + ' %', unit: 'proteiini ' + avgProteiini + ' %' },
              { label: 'Soluluku ka.', value: avgSoluluku.toLocaleString('fi-FI'), unit: '× 1000 / ml' },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: 6 }}>
                  {kpi.label}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--foreground)', lineHeight: 1.1 }}>{kpi.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 4 }}>{kpi.unit}</div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>Tilojen tilanne</div>
              {[
                { label: 'Aktiivinen', count: raporttiData.filter((r) => r.status === 'aktiivinen').length, color: '#16a34a' },
                { label: 'Tarkistuksessa', count: raporttiData.filter((r) => r.status === 'tarkistuksessa').length, color: '#b45309' },
                { label: 'Varoitus', count: raporttiData.filter((r) => r.status === 'varoitus').length, color: '#dc2626' },
              ].map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{s.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 2 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--muted)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(s.count / raporttiData.length) * 100}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: s.color, width: 24, textAlign: 'right' }}>{s.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>Laadun jakauma</div>
              {(['E', 'I', 'II'] as const).map((l) => {
                const count = raporttiData.filter((r) => r.laatu === l).length
                return (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: laatu_bg[l], color: laatu_text[l], width: 30, textAlign: 'center', flexShrink: 0,
                      }}
                    >
                      {l}
                    </span>
                    <span style={{ fontSize: 13, flex: 1 }}>
                      {l === 'E' ? 'Extra-luokka' : l === 'I' ? 'I-luokka' : 'II-luokka'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 2 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--muted)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(count / raporttiData.length) * 100}%`, height: '100%', background: laatu_text[l], borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: laatu_text[l], width: 24, textAlign: 'right' }}>{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'tilat' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="search"
              placeholder="Hae tilaa tai ID:tä…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                background: '#fff',
                width: 220,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {['kaikki', 'aktiivinen', 'tarkistuksessa', 'varoitus'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: '6px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: filterStatus === s ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    background: filterStatus === s ? 'var(--primary)' : 'var(--card)',
                    color: filterStatus === s ? '#fff' : 'var(--muted-foreground)',
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {s === 'kaikki' ? 'Kaikki' : statusColors[s]?.label ?? s}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 'auto' }}>
              {filtered.length} tilaa
            </span>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <ThBtn col="tila" label="Tila" />
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--secondary)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Laatu</th>
                    <ThBtn col="maara" label="Maitomäärä (l)" />
                    <ThBtn col="rasva" label="Rasva %" />
                    <ThBtn col="proteiini" label="Proteiini %" />
                    <ThBtn col="soluluku" label="Soluluku" />
                    <ThBtn col="raportit" label="Raportit" />
                    <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--secondary)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Tila</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'var(--muted)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--muted)')}
                    >
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{row.tila}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{row.id}</div>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: laatu_bg[row.laatu], color: laatu_text[row.laatu] }}>
                          {row.laatu}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {row.maara.toLocaleString('fi-FI')}
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {row.rasva.toFixed(2)}
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {row.proteiini.toFixed(2)}
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        <span style={{ color: row.soluluku > 300 ? '#dc2626' : row.soluluku > 200 ? '#b45309' : 'var(--foreground)' }}>
                          {row.soluluku}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {row.raportit} / 31
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                          background: statusColors[row.status].bg,
                          color: statusColors[row.status].text,
                        }}>
                          {statusColors[row.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'laatu' && (
        <div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Kuukausittainen yhteenveto 2025</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Tuotanto, aktiiviset tilat, laatu-indeksi</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  {['Kuukausi', 'Kokonaistuotanto (l)', 'Tiloja', 'E-luokka %', 'Soluluku ka.'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kuukausittain.map((row, i) => (
                  <tr key={row.kk} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--muted)' }}>
                    <td style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 500 }}>{row.kk}</td>
                    <td style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {row.maara.toLocaleString('fi-FI')}
                    </td>
                    <td style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{row.tiloja}</td>
                    <td style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 5, background: 'var(--muted)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${row.e_luokka}%`, height: '100%', background: row.e_luokka >= 92 ? '#16a34a' : row.e_luokka >= 89 ? '#b45309' : '#dc2626', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{row.e_luokka} %</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      <span style={{ color: row.soluluku_avg > 200 ? '#b45309' : 'var(--foreground)' }}>
                        {row.soluluku_avg}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export area */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
            {['Vie CSV', 'Tulosta', 'Vie PDF'].map((btn) => (
              <button
                key={btn}
                style={{
                  padding: '8px 18px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--card)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--foreground)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
