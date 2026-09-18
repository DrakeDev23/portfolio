const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function fetchJson(path) {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) {
    const error = new Error(`${path} failed (${res.status})`)
    error.status = res.status
    throw error
  }
  return res.json()
}

export const portfolioApi = {
  health: () => fetchJson('/api/health'),
  profile: () => fetchJson('/api/profile'),
  projects: () => fetchJson('/api/projects'),
  skills: () => fetchJson('/api/skills'),
  events: () => fetchJson('/api/events'),
  experience: () => fetchJson('/api/experience'),
  certifications: () => fetchJson('/api/certifications'),
  githubContributions: () => fetchJson('/api/github/contributions'),
}

export { API }
