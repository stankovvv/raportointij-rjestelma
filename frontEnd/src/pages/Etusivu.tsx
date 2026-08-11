type Page = 'etusivu' | 'tietojensyotto' | 'raportit'

interface Props {
  onNavigate: (page: Page) => void
}

const kpiData = [
  { label: 'Kerätty maito', value: '2 847 t', change: '+3.2%', positive: true, sub: 'tänä kuukautena' },
  { label: 'Aktiiviset tilat', value: '312', change: '+8', positive: true, sub: 'vs. edellinen kk' },
  { label: 'Raportit lähetetty', value: '284', change: '-4.1%', positive: false, sub: 'tänä kuukautena' },
  { label: 'Laatu-indeksi', value: '98.4', change: '+0.6', positive: true, sub: 'pisteet / 100' },
]

const recentActivity = [
  { tila: 'Tila Mäkinen', toiminto: 'Päiväkirjamerkintä lisätty', aika: '14 min sitten', status: 'ok' },
  { tila: 'Tila Korhonen', toiminto: 'Viikkoraportti lähetetty', aika: '1 h sitten', status: 'ok' },
  { tila: 'Tila Virtanen', toiminto: 'Laaturaportti odottaa tarkistusta', aika: '2 h sitten', status: 'odottaa' },
  { tila: 'Tila Leinonen', toiminto: 'Eläinlääkärikäynti kirjattu', aika: '4 h sitten', status: 'ok' },
  { tila: 'Tila Heikkinen', toiminto: 'Maitoanalyysi saapunut', aika: 'eilen', status: 'uusi' },
  { tila: 'Tila Nieminen', toiminto: 'Viikkoraportti myöhässä', aika: 'eilen', status: 'varoitus' },
]

const monthlyData = [
  { kk: 'Tammi', maito: 2640, tilat: 298 },
  { kk: 'Helmi', maito: 2510, tilat: 301 },
  { kk: 'Maalis', maito: 2720, tilat: 305 },
  { kk: 'Huhti', maito: 2680, tilat: 308 },
  { kk: 'Touko', maito: 2890, tilat: 310 },
  { kk: 'Kesä', maito: 2960, tilat: 312 },
  { kk: 'Heinä', maito: 2847, tilat: 312 },
]

const maxMaito = Math.max(...monthlyData.map((d) => d.maito))

const statusColors: Record<string, string> = {
  ok: '#16a34a',
  odottaa: '#d97706',
  uusi: '#0066cc',
  varoitus: '#dc2626',
}

const statusLabels: Record<string, string> = {
  ok: 'OK',
  odottaa: 'Odottaa',
  uusi: 'Uusi',
  varoitus: 'Varoitus',
}

export default function Etusivu({ onNavigate }: Props) {
  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Tervetuloa
            </p>
            <h1 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, color: 'var(--foreground)', lineHeight: 1.15 }}>
              Valio Raportointijärjestelmä
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => onNavigate('tietojensyotto')}
              style={{
                padding: '9px 18px',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              + Lisää tietoja
            </button>
            <button
              onClick={() => onNavigate('raportit')}
              style={{
                padding: '9px 18px',
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}
            >
              Näytä raportit
            </button>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--muted-foreground)' }}>
          Heinäkuu 2025 — viimeisin päivitys 2 minuuttia sitten
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 20px 16px',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,32,91,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {kpi.label}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 400, color: 'var(--foreground)', lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: kpi.positive ? '#16a34a' : '#dc2626',
                  background: kpi.positive ? '#f0fdf4' : '#fef2f2',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                {kpi.change}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
        {/* Bar chart */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '24px 24px 20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Kerätty maito (tonnia)</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Tammi–Heinä 2025</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>t / kk</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {monthlyData.map((d, i) => {
              const h = (d.maito / maxMaito) * 140
              const isLast = i === monthlyData.length - 1
              return (
                <div key={d.kk} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', fontWeight: isLast ? 600 : 400, color: isLast ? 'var(--accent)' : 'var(--muted-foreground)' }}>
                    {d.maito.toLocaleString('fi-FI')}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: h,
                      background: isLast ? 'var(--accent)' : 'var(--primary)',
                      borderRadius: '4px 4px 0 0',
                      opacity: isLast ? 1 : 0.25,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = isLast ? '1' : '0.25')}
                  />
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 500 }}>{d.kk}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '24px',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Viimeisimmät toiminnot</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', marginBottom: 2 }}>{item.tila}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.toiminto}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 10,
                      background: statusColors[item.status] + '18',
                      color: statusColors[item.status],
                    }}
                  >
                    {statusLabels[item.status]}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{item.aika}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
