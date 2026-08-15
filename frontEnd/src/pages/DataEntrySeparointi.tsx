import { useState } from 'react'
import type { Page } from '../components/Layout'
import { saveRecord, type Department } from '../lib/api'

interface Props {
  onNavigate: (page: Page) => void
  userName: string
}

interface Row {
  pvm: string; aika: string; maara: string; rasvapitoisuus: string
  lampotila: string; laitteisto: string; operaattori: string; huomiot: string
}

const SAMPLE_ROWS: Row[] = [
  { pvm: '12.08.2026', aika: '10:12', maara: '800', rasvapitoisuus: '3.8', lampotila: '55', laitteisto: 'Separaattori 1', operaattori: 'Antti Leinonen', huomiot: '' },
  { pvm: '12.08.2026', aika: '08:30', maara: '650', rasvapitoisuus: '4.2', lampotila: '58', laitteisto: 'Separaattori 2', operaattori: 'Antti Leinonen', huomiot: 'rasvapitoisuus korkea' },
  { pvm: '11.08.2026', aika: '15:00', maara: '900', rasvapitoisuus: '3.6', lampotila: '54', laitteisto: 'Separaattori 1', operaattori: 'Matti Virtanen', huomiot: '' },
]

const inputStyle = (error?: boolean) => ({
  borderColor: error ? '#f87171' : '#d1dce5',
  background: error ? '#fef2f2' : '#f8fbfd',
})

export default function DataEntrySeparointi({ onNavigate, userName }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const timeNow = new Date().toTimeString().slice(0, 5)

  // Esitäyttö on sama kuin muiden osastojen: nykyinen päivä, nykyinen aika ja nykyinen käyttäjä.
  const [form, setForm] = useState({
    pvm: today, aika: timeNow, maara: '', rasvapitoisuus: '',
    lampotila: '', laitteisto: '', operaattori: userName, huomiot: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<Row[]>(SAMPLE_ROWS)

  // Yhtenäinen päivittäjä kaikkien kenttien hallintaan.
  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: false }))
    setSaved(false)
  }

  // Varmistaa, että pakolliset kentät täyttyvät ennen backend-lähetystä.
  const validate = () => {
    const required = ['pvm', 'aika', 'maara', 'rasvapitoisuus', 'lampotila', 'laitteisto', 'operaattori']
    const errs: Record<string, boolean> = {}
    required.forEach(k => { if (!form[k as keyof typeof form]) errs[k] = true })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Lähettää separointidatan backendille osastokohtaisella reitillä.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setSaving(true)
      setError('')
      const payload = {
        pvm: form.pvm,
        aika: form.aika,
        maara: Number(form.maara),
        rasvapitoisuus: Number(form.rasvapitoisuus),
        lampotila: Number(form.lampotila),
        laitteisto: form.laitteisto,
        operaattori: form.operaattori,
        huomiot: form.huomiot,
      }
      await saveRecord('separointi' as Department, payload)

      const newRow: Row = {
        pvm: new Date(form.pvm).toLocaleDateString('fi-FI'),
        aika: form.aika, maara: form.maara, rasvapitoisuus: form.rasvapitoisuus,
        lampotila: form.lampotila, laitteisto: form.laitteisto,
        operaattori: form.operaattori, huomiot: form.huomiot,
      }
      setRows(r => [newRow, ...r])
      setSaved(true)
      setForm(f => ({ ...f, maara: '', rasvapitoisuus: '', lampotila: '', laitteisto: '', huomiot: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tallennus epäonnistui')
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, field, type = 'text', placeholder = '', unit = '' }: {
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
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
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
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Tietojensyöttö — Separointi</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Syötä separoinnin tuotantotiedot tietokantaan</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['entry-keitto', 'entry-pakkaamo'] as Page[]).map(p => (
            <button key={p} onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'entry-keitto' ? 'Keitto' : 'Pakkaamo'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#e2eaf0' }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: '#1a2733' }}>Separoinnin tiedot</h2>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Field label="Päivämäärä" field="pvm" type="date" />
            <Field label="Aika" field="aika" type="time" />
            <Field label="Määrä" field="maara" type="number" placeholder="0" unit="l" />
            <Field label="Rasvapitoisuus" field="rasvapitoisuus" type="number" placeholder="0.0" unit="%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Field label="Lämpötila" field="lampotila" type="number" placeholder="0" unit="°C" />
            {/* Laitteisto */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>
                Laitteisto <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select value={form.laitteisto} onChange={e => set('laitteisto', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.laitteisto)}
              >
                <option value="">Valitse...</option>
                {['Separaattori 1', 'Separaattori 2', 'Separaattori 3'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {errors.laitteisto && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
            <Field label="Operaattori" field="operaattori" placeholder="Nimi" />
            {/* Huomiot */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Huomiot</label>
              <input type="text" value={form.huomiot} onChange={e => set('huomiot', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#d1dce5', background: '#f8fbfd' }} placeholder="vapaamuotoinen"
                onFocus={e => (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => (e.target.style.borderColor = '#d1dce5')}
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

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg border text-sm" style={{ background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}>
              {error}
            </div>
          )}

          <button type="submit"
            disabled={saving}
            className="px-6 py-3.5 rounded-lg text-white font-semibold text-sm transition-colors w-full md:w-auto disabled:opacity-70"
            style={{ background: '#0d4f6e' }}
            onMouseEnter={e => (!saving) && (e.currentTarget.style.background = '#0a3d56')}
            onMouseLeave={e => (!saving) && (e.currentTarget.style.background = '#0d4f6e')}
          >
            {saving ? 'Tallennetaan...' : 'Tallenna tiedot tietokantaan'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Viimeisimmät separoinnin kirjaukset</h2>
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
              {rows.map((r, i) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
