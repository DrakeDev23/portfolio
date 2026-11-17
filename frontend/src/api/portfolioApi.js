const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function fetchJson(path, options = {}) {
  const res = await fetch(`${API}${path}`, options)
  if (!res.ok) {
    const error = new Error(`${path} failed (${res.status})`)
    error.status = res.status
    throw error
  }
  return res.json()
}

export const portfolioApi = {
  bootstrap: (options) => fetchJson('/api/bootstrap', options),
  health: (options) => fetchJson('/api/health', options),
  profile: (options) => fetchJson('/api/profile', options),
  projects: (options) => fetchJson('/api/projects', options),
  skills: (options) => fetchJson('/api/skills', options),
  events: (options) => fetchJson('/api/events', options),
  experience: (options) => fetchJson('/api/experience', options),
  certifications: (options) => fetchJson('/api/certifications', options),
  githubContributions: (options) => fetchJson('/api/github/contributions', options),
}

export { API }
