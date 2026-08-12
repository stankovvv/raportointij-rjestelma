import { useState } from 'react'
import type { Page } from '../components/Layout'

interface Props {
  onNavigate: (page: Page) => void
  userName: string
}

interface Row {
  pvm: string; aika: string; tuote: string; maara: string
  lampotila: string; kesto: string; operaattori: string; huomiot: string
}

const SAMPLE_ROWS: Row[] = [
  { pvm: '12.08.2026', aika: '09:45', tuote: 'Maito', maara: '500', lampotila: '80', kesto: '50', operaattori: 'Matti Virtanen', huomiot: 'laktoosi' },
  { pvm: '12.08.2026', aika: '08:15', tuote: 'Kerma', maara: '320', lampotila: '75', kesto: '45', operaattori: 'Matti Virtanen', huomiot: '' },
  { pvm: '11.08.2026', aika: '14:00', tuote: 'Maito', maara: '600', lampotila: '82', kesto: '55', operaattori: 'Antti Leinonen', huomiot: 'rasvainen erä' },
]

const inputClass = (error?: boolean) =>
  `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : ''}`
const inputStyle = (error?: boolean) => ({
  borderColor: error ? '#f87171' : '#d1dce5',
  background: error ? '#fef2f2' : '#f8fbfd',
})

export default function DataEntryKeitto({ onNavigate, userName }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const timeNow = new Date().toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    pvm: today, aika: timeNow, tuote: '', maara: '',
    lampotila: '', kesto: '', operaattori: userName, huomiot: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [rows, setRows] = useState<Row[]>(SAMPLE_ROWS)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: false }))
    setSaved(false)
  }

  const validate = () => {
    const required = ['pvm', 'aika', 'tuote', 'maara', 'lampotila', 'kesto', 'operaattori']
    const errs: Record<string, boolean> = {}
    required.forEach(k => { if (!form[k as keyof typeof form]) errs[k] = true })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const newRow: Row = {
      pvm: new Date(form.pvm).toLocaleDateString('fi-FI'),
      aika: form.aika, tuote: form.tuote, maara: form.maara,
      lampotila: form.lampotila, kesto: form.kesto,
      operaattori: form.operaattori, huomiot: form.huomiot,
    }
    setRows(r => [newRow, ...r])
    setSaved(true)
    setForm(f => ({ ...f, tuote: '', maara: '', lampotila: '', kesto: '', huomiot: '' }))
  }

  const LabeledInput = ({ label, field, type = 'text', placeholder = '', unit = '' }: {
    label: string; field: string; type?: string; placeholder?: string; unit?: string
  }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>
        {label}{unit && <span className="normal-case font-normal ml-1" style={{ color: '#8aa3b0' }}>({unit})</span>}
        <span style={{ color: '#dc2626' }} className="ml-0.5">*</span>
      </label>
      <input
        type={type}
        value={(form as any)[field]}
        onChange={e => set(field, e.target.value)}
        className={inputClass(errors[field])}
        style={inputStyle(errors[field])}
        onFocus={e => !errors[field] && (e.target.style.borderColor = '#0d6e8f')}
        onBlur={e => !errors[field] && (e.target.style.borderColor = '#d1dce5')}
        placeholder={placeholder}
      />
      {errors[field] && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Tietojensyöttö — Keitto</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Syötä keiton tuotantotiedot tietokantaan</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['entry-pakkaamo', 'entry-separointi'] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'entry-pakkaamo' ? 'Pakkaamo' : 'Separointi'}
            </button>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#e2eaf0' }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: '#1a2733' }}>Keiton tiedot</h2>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <LabeledInput label="Päivämäärä" field="pvm" type="date" />
            <LabeledInput label="Aika" field="aika" type="time" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>
                Tuote <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={form.tuote}
                onChange={e => set('tuote', e.target.value)}
                className={inputClass(errors.tuote)}
                style={inputStyle(errors.tuote)}
              >
                <option value="">Valitse...</option>
                {['Maito', 'Kerma', 'Piimä', 'Rasvaton maito', 'Täysmaito'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.tuote && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
            <LabeledInput label="Määrä" field="maara" type="number" placeholder="0" unit="l" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <LabeledInput label="Lämpötila" field="lampotila" type="number" placeholder="0" unit="°C" />
            <LabeledInput label="Kesto" field="kesto" type="number" placeholder="0" unit="min" />
            <LabeledInput label="Operaattori" field="operaattori" placeholder="Nimi" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Huomiot</label>
              <input
                type="text"
                value={form.huomiot}
                onChange={e => set('huomiot', e.target.value)}
                className={inputClass()}
                style={inputStyle()}
                onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => (e.target.style.borderColor = '#d1dce5')}
                placeholder="esim. laktoosi, rasvainen"
              />
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" />
              </svg>
              <span className="text-sm font-medium">Tiedot tallennettu tietokantaan onnistuneesti.</span>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-3.5 rounded-lg text-white font-semibold text-sm transition-colors w-full md:w-auto"
            style={{ background: '#0d4f6e' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0a3d56')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0d4f6e')}
          >
            Tallenna tiedot tietokantaan
          </button>
        </form>
      </div>

      {/* Preview table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Viimeisimmät keiton kirjaukset</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2eaf0' }}>
                {['Päivämäärä', 'Aika', 'Tuote', 'Määrä (l)', 'Lämpötila (°C)', 'Kesto (min)', 'Operaattori', 'Huomiot'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#8aa3b0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
