// Rooli- ja osastotyypit sekä API:n vastausmallit.
export type UserRole = 'operaattori' | 'esimies'

export interface User {
  id: number
  username: string
  name: string
  role: UserRole
}

export type Department = 'keitto' | 'pakkaamo' | 'separointi'

// Backendin perusosoite. Voi ylikirjoittaa .env:ssä VITE_API_BASE_URL.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

// Yhteinen fetch-wrapper, joka parseeraa JSON:n ja heittää virheen backendin virheviestillä.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Pyyntö epäonnistui')
  }

  return data as T
}

// Kirjautuminen backendin /api/auth/login -reitille.
export async function login(username: string, password: string): Promise<{ user: User }> {
  return request<{ user: User }>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
}

// Hakee kaikki osastokohtaiset kirjauskerrat.
export async function fetchRecords(department: Department): Promise<{ department: string; data: Record<string, unknown>[] }> {
  return request<{ department: string; data: Record<string, unknown>[] }>(`/api/records/${department}`)
}

// Lähettää uuden tuotantokirjauksen backendin vakioreitille.
export async function saveRecord(department: Department, payload: Record<string, string | number | null>): Promise<{ message: string; record: Record<string, unknown> }> {
  return request<{ message: string; record: Record<string, unknown> }>(`/api/records/${department}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
