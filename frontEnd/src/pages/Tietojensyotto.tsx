import { useState } from 'react'

type FormData = {
  tilaId: string
  tilaNimi: string
  pvm: string
  maara: string
  laatu: string
  rasvapitoisuus: string
  proteiinipitoisuus: string
  soluluku: string
  laite: string
  lisatiedot: string
}

const initialForm: FormData = {
  tilaId: '',
  tilaNimi: '',
  pvm: new Date().toISOString().split('T')[0],
  maara: '',
  laatu: 'E',
  rasvapitoisuus: '',
  proteiinipitoisuus: '',
  soluluku: '',
  laite: '',
  lisatiedot: '',
}

const tilat = [
  { id: 'T-001', nimi: 'Tila Mäkinen' },
  { id: 'T-002', nimi: 'Tila Korhonen' },
  { id: 'T-003', nimi: 'Tila Virtanen' },
  { id: 'T-004', nimi: 'Tila Leinonen' },
  { id: 'T-005', nimi: 'Tila Heikkinen' },
  { id: 'T-006', nimi: 'Tila Nieminen' },
]

const recentEntries = [
  { pvm: '2025-07-11', tila: 'Tila Mäkinen', maara: '1 240 l', laatu: 'E', status: 'Hyväksytty' },
  { pvm: '2025-07-11', tila: 'Tila Korhonen', maara: '980 l', laatu: 'E', status: 'Hyväksytty' },
  { pvm: '2025-07-10', tila: 'Tila Virtanen', maara: '1 100 l', laatu: 'I', status: 'Tarkistuksessa' },
  { pvm: '2025-07-10', tila: 'Tila Leinonen', maara: '750 l', laatu: 'E', status: 'Hyväksytty' },
  { pvm: '2025-07-09', tila: 'Tila Heikkinen', maara: '1 320 l', laatu: 'E', status: 'Hyväksytty' },
]

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{hint}</span>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  color: 'var(--foreground)',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.15s',
  width: '100%',
}

export default function Tietojensyotto() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const set = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.tilaId) e.tilaId = 'Valitse tila'
    if (!form.pvm) e.pvm = 'Anna päivämäärä'
    if (!form.maara) e.maara = 'Anna maitomäärä'
    else if (isNaN(Number(form.maara))) e.maara = 'Numeerinen arvo vaaditaan'
    if (!form.rasvapitoisuus) e.rasvapitoisuus = 'Anna rasvapitoisuus'
    if (!form.proteiinipitoisuus) e.proteiinipitoisuus = 'Anna proteiinipitoisuus'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm(initialForm)
    }, 3000)
  }

  const handleTilaChange = (id: string) => {
    const tila = tilat.find((t) => t.id === id)
    setForm((f) => ({ ...f, tilaId: id, tilaNimi: tila?.nimi ?? '' }))
    if (errors.tilaId) setErrors((e) => ({ ...e, tilaId: undefined }))
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Syöttölomake
        </p>
        <h1 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, color: 'var(--foreground)' }}>
          Tietojensyöttö
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px 28px',
          }}
        >
          {submitted && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                marginBottom: 24,
                fontSize: 13,
                color: '#15803d',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>✓</span> Tiedot tallennettu onnistuneesti!
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Tila + päivämäärä */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Tila" required hint={errors.tilaId}>
                <select
                  value={form.tilaId}
                  onChange={(e) => handleTilaChange(e.target.value)}
                  style={{
                    ...inputStyle,
                    border: `1px solid ${errors.tilaId ? '#dc2626' : 'var(--border)'}`,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: 32,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Valitse tila…</option>
                  {tilat.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nimi} ({t.id})
                    </option>
                  ))}
                </select>
                {errors.tilaId && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.tilaId}</span>}
              </Field>

              <Field label="Päivämäärä" required hint={errors.pvm}>
                <input
                  type="date"
                  value={form.pvm}
                  onChange={(e) => set('pvm', e.target.value)}
                  style={{ ...inputStyle, border: `1px solid ${errors.pvm ? '#dc2626' : 'var(--border)'}` }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.pvm ? '#dc2626' : 'var(--border)')}
                />
                {errors.pvm && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.pvm}</span>}
              </Field>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: 16 }}>
                Maidon tiedot
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Maitomäärä (litraa)" required>
                  <input
                    type="number"
                    placeholder="esim. 1240"
                    value={form.maara}
                    onChange={(e) => set('maara', e.target.value)}
                    style={{ ...inputStyle, border: `1px solid ${errors.maara ? '#dc2626' : 'var(--border)'}` }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.maara ? '#dc2626' : 'var(--border)')}
                  />
                  {errors.maara && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.maara}</span>}
                </Field>

                <Field label="Laatu">
                  <select
                    value={form.laatu}
                    onChange={(e) => set('laatu', e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: 32,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="E">E-luokka (Extra)</option>
                    <option value="I">I-luokka</option>
                    <option value="II">II-luokka</option>
                  </select>
                </Field>

                <Field label="Keräyslaite">
                  <input
                    type="text"
                    placeholder="esim. Lely A5"
                    value={form.laite}
                    onChange={(e) => set('laite', e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </Field>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: 16 }}>
                Analyysitulokset
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Rasvapitoisuus (%)" required>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="esim. 4.20"
                    value={form.rasvapitoisuus}
                    onChange={(e) => set('rasvapitoisuus', e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', border: `1px solid ${errors.rasvapitoisuus ? '#dc2626' : 'var(--border)'}` }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.rasvapitoisuus ? '#dc2626' : 'var(--border)')}
                  />
                  {errors.rasvapitoisuus && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.rasvapitoisuus}</span>}
                </Field>

                <Field label="Proteiinipitoisuus (%)" required>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="esim. 3.40"
                    value={form.proteiinipitoisuus}
                    onChange={(e) => set('proteiinipitoisuus', e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', border: `1px solid ${errors.proteiinipitoisuus ? '#dc2626' : 'var(--border)'}` }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.proteiinipitoisuus ? '#dc2626' : 'var(--border)')}
                  />
                  {errors.proteiinipitoisuus && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.proteiinipitoisuus}</span>}
                </Field>

                <Field label="Soluluku (1000/ml)">
                  <input
                    type="number"
                    placeholder="esim. 185"
                    value={form.soluluku}
                    onChange={(e) => set('soluluku', e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </Field>
              </div>
            </div>

            <Field label="Lisätiedot">
              <textarea
                rows={3}
                placeholder="Vapaamuotoiset huomiot, poikkeamat tai lisätiedot…"
                value={form.lisatiedot}
                onChange={(e) => set('lisatiedot', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 76 }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button
                type="button"
                onClick={() => { setForm(initialForm); setErrors({}) }}
                style={{
                  padding: '9px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Tyhjennä
              </button>
              <button
                type="submit"
                style={{
                  padding: '9px 24px',
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
                Tallenna tiedot
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: recent entries */}
        <div>
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 20px',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Viimeisimmät kirjaukset</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentEntries.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 0',
                    borderBottom: i < recentEntries.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{entry.tila}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 10,
                        background: entry.status === 'Hyväksytty' ? '#f0fdf4' : '#fef3c7',
                        color: entry.status === 'Hyväksytty' ? '#16a34a' : '#b45309',
                      }}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted-foreground)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{entry.pvm}</span>
                    <span>{entry.maara}</span>
                    <span>Luokka {entry.laatu}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div
            style={{
              marginTop: 16,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius)',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>Ohje</div>
            <div style={{ fontSize: 12, color: '#3b82f6', lineHeight: 1.6 }}>
              Pakolliset kentät on merkitty tähdellä (*). Analyysitulokset voidaan syöttää jälkikäteen, kun laboratoriotulokset ovat saatavilla.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
