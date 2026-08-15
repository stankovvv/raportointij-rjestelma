import { useState } from 'react'
import type { Page } from '../components/Layout'
import { saveRecord, type Department } from '../lib/api'

interface Props {
  onNavigate: (page: Page) => void
  userName: string
}

interface Row {
  pvm: string; aika: string; tuote: string; pakkaukset: string
  paino: string; linja: string; operaattori: string; huomiot: string
}

const SAMPLE_ROWS: Row[] = [
  { pvm: '12.08.2026', aika: '10:30', tuote: 'Jogurtti', pakkaukset: '840', paino: '420', linja: 'Linja 1', operaattori: 'Liisa Mäkinen', huomiot: 'nopea erä' },
  { pvm: '12.08.2026', aika: '09:00', tuote: 'Rahka', pakkaukset: '600', paino: '300', linja: 'Linja 2', operaattori: 'Liisa Mäkinen', huomiot: '' },
  { pvm: '11.08.2026', aika: '13:45', tuote: 'Jogurtti', pakkaukset: '1200', paino: '600', linja: 'Linja 1', operaattori: 'Pekka Saari', huomiot: 'ylitys 5%' },
]

const inputStyle = (error?: boolean) => ({
  borderColor: error ? '#f87171' : '#d1dce5',
  background: error ? '#fef2f2' : '#f8fbfd',
})

export default function DataEntryPakkaamo({ onNavigate, userName }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const timeNow = new Date().toTimeString().slice(0, 5)

  // Lähtöarvot vastaavat pakkaamon lomakkeen vaatimuksia: päivä, aika, tuote, kappalemäärä ja paino.
  const [form, setForm] = useState({
    pvm: today, aika: timeNow, tuote: '', pakkaukset: '',
    paino: '', linja: '', operaattori: userName, huomiot: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<Row[]>(SAMPLE_ROWS)

  // Yksi funktio kaikkien lomakekenttien päivittämiseen.
  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: false }))
    setSaved(false)
  }

  // Tarkistaa pakolliset tiedot ennen tallennusta.
  const validate = () => {
    const required = ['pvm', 'aika', 'tuote', 'pakkaukset', 'paino', 'linja', 'operaattori']
    const errs: Record<string, boolean> = {}
    required.forEach(k => { if (!form[k as keyof typeof form]) errs[k] = true })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Lähettää pakkaamon tiedot backendin /api/records/pakkaamo -reitille.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setSaving(true)
      setError('')
      const payload = {
        pvm: form.pvm,
        aika: form.aika,
        tuote: form.tuote,
        pakkaukset: Number(form.pakkaukset),
        paino: Number(form.paino),
        linja: form.linja,
        operaattori: form.operaattori,
        huomiot: form.huomiot,
      }
      await saveRecord('pakkaamo' as Department, payload)

      const newRow: Row = {
        pvm: new Date(form.pvm).toLocaleDateString('fi-FI'),
        aika: form.aika, tuote: form.tuote, pakkaukset: form.pakkaukset,
        paino: form.paino, linja: form.linja,
        operaattori: form.operaattori, huomiot: form.huomiot,
      }
      setRows(r => [newRow, ...r])
      setSaved(true)
      setForm(f => ({ ...f, tuote: '', pakkaukset: '', paino: '', linja: '', huomiot: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tallennus epäonnistui')
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2733' }}>Tietojensyöttö — Pakkaamo</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>Syötä pakkaamon tuotantotiedot tietokantaan</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['entry-keitto', 'entry-separointi'] as Page[]).map(p => (
            <button key={p} onClick={() => onNavigate(p)}
              className="px-4 py-2 text-sm rounded-lg border transition-colors"
              style={{ borderColor: '#d1dce5', color: '#5a7080', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4f7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {p === 'entry-keitto' ? 'Keitto' : 'Separointi'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#e2eaf0' }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: '#1a2733' }}>Pakkaamon tiedot</h2>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Päivämäärä */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Päivämäärä <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" value={form.pvm} onChange={e => set('pvm', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.pvm)}
                onFocus={e => !errors.pvm && (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => !errors.pvm && (e.target.style.borderColor = '#d1dce5')}
              />
            </div>
            {/* Aika */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Aika <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="time" value={form.aika} onChange={e => set('aika', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.aika)}
                onFocus={e => !errors.aika && (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => !errors.aika && (e.target.style.borderColor = '#d1dce5')}
              />
            </div>
            {/* Tuote */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Tuote <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.tuote} onChange={e => set('tuote', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.tuote)}
              >
                <option value="">Valitse...</option>
                {['Jogurtti', 'Rahka', 'Kermaviili', 'Smetana', 'Maitojuoma'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.tuote && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
            {/* Pakkaukset */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Pakkaukset <span style={{ color: '#5a7080' }}>(kpl)</span> <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="number" value={form.pakkaukset} onChange={e => set('pakkaukset', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.pakkaukset)} placeholder="0"
                onFocus={e => !errors.pakkaukset && (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => !errors.pakkaukset && (e.target.style.borderColor = '#d1dce5')}
              />
              {errors.pakkaukset && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Paino */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Paino <span style={{ color: '#5a7080' }}>(kg)</span> <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="number" value={form.paino} onChange={e => set('paino', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.paino)} placeholder="0"
                onFocus={e => !errors.paino && (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => !errors.paino && (e.target.style.borderColor = '#d1dce5')}
              />
              {errors.paino && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
            {/* Linja */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Linja <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.linja} onChange={e => set('linja', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.linja)}
              >
                <option value="">Valitse...</option>
                {['Linja 1', 'Linja 2', 'Linja 3'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {errors.linja && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Pakollinen kenttä</p>}
            </div>
            {/* Operaattori */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Operaattori <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" value={form.operaattori} onChange={e => set('operaattori', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(errors.operaattori)} placeholder="Nimi"
                onFocus={e => !errors.operaattori && (e.target.style.borderColor = '#0d6e8f')}
                onBlur={e => !errors.operaattori && (e.target.style.borderColor = '#d1dce5')}
              />
            </div>
            {/* Huomiot */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a7080' }}>Huomiot</label>
              <input type="text" value={form.huomiot} onChange={e => set('huomiot', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#d1dce5', background: '#f8fbfd' }} placeholder="esim. nopea erä"
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

      {/* Preview table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e2eaf0' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e2eaf0' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#1a2733' }}>Viimeisimmät pakkaamon kirjaukset</h2>
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
              {rows.map((r, i) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
