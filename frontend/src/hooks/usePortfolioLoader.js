import { useCallback, useRef, useState } from 'react'
import { portfolioApi } from '../api/portfolioApi'

const TASKS = [
  {
    id: 'health',
    label: 'Connecting FastAPI Backend',
    progress: 20,
    okMessage: 'FastAPI server connected',
    run: async () => {
      const health = await portfolioApi.health()
      if (health.status !== 'online') {
        throw new Error('FastAPI offline')
      }
      return { health }
    },
  },
  {
    id: 'database',
    label: 'Connecting Database',
    progress: 35,
    okMessage: 'PostgreSQL database online',
    run: async (ctx) => {
      if (ctx.health?.database !== 'connected') {
        throw new Error('Database unavailable')
      }
      return {}
    },
  },
  {
    id: 'profile',
    label: 'Loading Profile Data',
    progress: 45,
    okMessage: 'Profile loaded',
    run: async () => ({ profile: await portfolioApi.profile() }),
  },
  {
    id: 'projects',
    label: 'Loading Portfolio Data',
    progress: 60,
    okMessage: 'Projects loaded',
    run: async () => ({ projects: await portfolioApi.projects() }),
  },
  {
    id: 'skills',
    label: 'Loading Skills',
    progress: 70,
    okMessage: 'Skills loaded',
    run: async () => ({ skills: await portfolioApi.skills() }),
  },
  {
    id: 'events',
    label: 'Loading Events',
    progress: 78,
    okMessage: 'Events loaded',
    run: async () => ({ events: await portfolioApi.events() }),
  },
  {
    id: 'experience',
    label: 'Loading Experience',
    progress: 88,
    okMessage: 'Experience loaded',
    run: async () => ({ experience: await portfolioApi.experience() }),
  },
  {
    id: 'certifications',
    label: 'Checking System Integrity',
    progress: 100,
    okMessage: 'Portfolio verified',
    run: async () => ({ certifications: await portfolioApi.certifications() }),
  },
]

const STATIC_LOGS = [
  { id: 'static-init-kernel', type: 'ok', message: 'Initializing Kernel' },
  { id: 'static-load-security', type: 'ok', message: 'Loading Security Modules' },
]

export function usePortfolioLoader() {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState(STATIC_LOGS)
  const [status, setStatus] = useState('Initializing Secure Environment...')
  const [error, setError] = useState(null)
  const [data, setData] = useState({})
  const [phase, setPhase] = useState('idle')
  const ctxRef = useRef({})
  const logCounterRef = useRef(0)

  const addLog = useCallback((type, message) => {
    logCounterRef.current += 1
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `log-${logCounterRef.current}-${Date.now()}`
    setLogs((prev) => [...prev, { id, type, message }])
  }, [])

  const run = useCallback(async () => {
    setError(null)
    setPhase('loading')
    setProgress(0)
    setLogs(STATIC_LOGS)
    setStatus('Initializing Secure Environment...')
    ctxRef.current = {}

    try {
      for (const task of TASKS) {
        setStatus(`${task.label}...`)

        const result = await task.run(ctxRef.current)
        Object.assign(ctxRef.current, result)
        setData({ ...ctxRef.current })
        addLog('ok', task.okMessage)
        setProgress(task.progress)
      }

      setStatus('SYSTEM READY')
      setPhase('ready')
      return ctxRef.current
    } catch (err) {
      const message = err.message || 'Connection failed'
      const isDb = message.toLowerCase().includes('database')
      addLog('error', isDb ? 'Database unreachable' : 'FastAPI offline')
      setError(message)
      setStatus('SYSTEM ERROR')
      setPhase('error')
      return null
    }
  }, [addLog])

  return { progress, logs, status, error, data, phase, run }
}
