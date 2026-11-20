import { useCallback, useRef, useState, useEffect } from 'react'
import { portfolioApi } from '../api/portfolioApi'
import { FALLBACK_PORTFOLIO_DATA } from '../constants/fallbackData'

const STATIC_LOGS = [
  { id: 'static-init-kernel', type: 'ok', message: 'Initializing Kernel' },
  { id: 'static-load-security', type: 'ok', message: 'Loading Security Modules' },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function usePortfolioLoader() {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState(STATIC_LOGS)
  const [status, setStatus] = useState('Initializing Secure Environment...')
  const [error, setError] = useState(null)
  const [data, setData] = useState({})
  const [phase, setPhase] = useState('idle')
  const [isSlow, setIsSlow] = useState(false)

  const ctxRef = useRef({})
  const logCounterRef = useRef(0)
  const slowTimerRef = useRef(null)

  const addLog = useCallback((type, message) => {
    logCounterRef.current += 1
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `log-${logCounterRef.current}-${Date.now()}`
    setLogs((prev) => [...prev, { id, type, message }])
  }, [])

  const skipWithFallback = useCallback(() => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
    const combined = { ...FALLBACK_PORTFOLIO_DATA, ...ctxRef.current }
    setData(combined)
    ctxRef.current = combined
    addLog('ok', 'Loaded cached offline profile')
    addLog('ok', 'Portfolio verified (cached mode)')
    setProgress(100)
    setStatus('SYSTEM READY')
    setPhase('ready')
    return combined
  }, [addLog])

  const run = useCallback(async () => {
    setError(null)
    setPhase('loading')
    setProgress(15)
    setLogs(STATIC_LOGS)
    setStatus('Connecting to Services...')
    setIsSlow(false)
    ctxRef.current = {}

    if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
    slowTimerRef.current = setTimeout(() => {
      setIsSlow(true)
      setStatus('Waking up server instance from sleep mode...')
    }, 3500)

    try {
      let bootstrapData = null
      try {
        bootstrapData = await portfolioApi.bootstrap()
      } catch {
      }

      if (bootstrapData && bootstrapData.status) {
        if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
        setIsSlow(false)

        addLog('ok', 'FastAPI server connected')
        setProgress(35)
        await delay(50)

        const dbOnline = bootstrapData.database === 'connected'
        addLog(dbOnline ? 'ok' : 'error', dbOnline ? 'PostgreSQL database online' : 'Database in degraded mode')
        setProgress(50)
        await delay(50)

        addLog('ok', 'Profile loaded')
        setProgress(65)
        await delay(50)

        addLog('ok', 'Projects & Skills loaded')
        setProgress(85)
        await delay(50)

        addLog('ok', 'Events & Experience loaded')
        addLog('ok', 'Portfolio verified')
        setProgress(100)

        const finalData = {
          profile: bootstrapData.profile,
          projects: bootstrapData.projects,
          skills: bootstrapData.skills,
          events: bootstrapData.events,
          experience: bootstrapData.experience,
          certifications: bootstrapData.certifications,
          health: { status: bootstrapData.status, database: bootstrapData.database },
        }

        ctxRef.current = finalData
        setData(finalData)
        setStatus('SYSTEM READY')
        setPhase('ready')
        return finalData
      }

      setStatus('Fetching portfolio modules in parallel...')
      setProgress(25)

      const [healthRes, profileRes, projectsRes, skillsRes, eventsRes, expRes, certsRes] =
        await Promise.allSettled([
          portfolioApi.health(),
          portfolioApi.profile(),
          portfolioApi.projects(),
          portfolioApi.skills(),
          portfolioApi.events(),
          portfolioApi.experience(),
          portfolioApi.certifications(),
        ])

      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
      setIsSlow(false)

      const health = healthRes.status === 'fulfilled' ? healthRes.value : null
      if (health && health.status === 'online') {
        addLog('ok', 'FastAPI server connected')
        addLog(health.database === 'connected' ? 'ok' : 'error', health.database === 'connected' ? 'PostgreSQL database online' : 'Database disconnected')
      } else {
        addLog('error', 'FastAPI offline, using cached snapshot')
      }
      setProgress(45)
      await delay(50)

      const profile = profileRes.status === 'fulfilled' ? profileRes.value : FALLBACK_PORTFOLIO_DATA.profile
      addLog('ok', 'Profile loaded')
      setProgress(60)
      await delay(50)

      const projects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value) ? projectsRes.value : FALLBACK_PORTFOLIO_DATA.projects
      addLog('ok', 'Projects loaded')
      setProgress(75)
      await delay(50)

      const skills = skillsRes.status === 'fulfilled' ? skillsRes.value : null
      addLog('ok', 'Skills loaded')
      setProgress(85)
      await delay(50)

      const events = eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value) ? eventsRes.value : FALLBACK_PORTFOLIO_DATA.events
      const experience = expRes.status === 'fulfilled' ? expRes.value : FALLBACK_PORTFOLIO_DATA.experience
      const certifications = certsRes.status === 'fulfilled' ? certsRes.value : FALLBACK_PORTFOLIO_DATA.certifications

      addLog('ok', 'Events & Experience loaded')
      addLog('ok', 'Portfolio verified')
      setProgress(100)

      const finalData = {
        profile,
        projects,
        skills,
        events,
        experience,
        certifications,
        health,
      }

      ctxRef.current = finalData
      setData(finalData)
      setStatus('SYSTEM READY')
      setPhase('ready')
      return finalData
    } catch (err) {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
      const message = err.message || 'Connection failed'
      addLog('error', 'Using fallback cached portfolio')
      return skipWithFallback()
    }
  }, [addLog, skipWithFallback])

  useEffect(() => {
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
    }
  }, [])

  return { progress, logs, status, error, data, phase, isSlow, run, skipWithFallback }
}
