import { useCallback, useEffect, useState } from 'react'

const PING_INTERVAL_MS = 3000

const REQUEST_TIMEOUT_MS = 8000

const GIVE_UP_AFTER_MS = 90_000

export function useBackendWake(baseUrl) {
  const [status, setStatus] = useState('waking')
  const [attempts, setAttempts] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  const [runId, setRunId] = useState(0)

  useEffect(() => {
    const healthUrl = `${String(baseUrl ?? '').replace(/\/+$/, '')}/health`
    const startedAt = Date.now()
    let cancelled = false
    let pingTimer = null
    let giveUpTimer = null
    let inFlight = null

    setStatus('waking')
    setAttempts(0)
    setElapsed(0)

    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 250)

    const stop = () => {
      cancelled = true
      clearInterval(tick)
      clearTimeout(pingTimer)
      clearTimeout(giveUpTimer)
      inFlight?.abort()
    }

    giveUpTimer = setTimeout(() => {
      if (cancelled) return
      stop()
      setElapsed(Math.floor(GIVE_UP_AFTER_MS / 1000))
      setStatus('failed')
    }, GIVE_UP_AFTER_MS)

    const ping = async () => {
      if (cancelled) return
      setAttempts((n) => n + 1)

      const pingStartedAt = Date.now()
      const controller = new AbortController()
      inFlight = controller
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      let ok = false
      try {

        const res = await fetch(healthUrl, {
          signal: controller.signal,
          cache: 'no-store',
        })
        ok = res.ok
      } catch {
        ok = false
      } finally {
        clearTimeout(timeout)
        inFlight = null
      }

      if (cancelled) return

      if (ok) {
        stop()
        setElapsed(Math.floor((Date.now() - startedAt) / 1000))
        setStatus('ready')
        return
      }

      const wait = Math.max(0, PING_INTERVAL_MS - (Date.now() - pingStartedAt))
      pingTimer = setTimeout(ping, wait)
    }

    ping()
    return stop
  }, [baseUrl, runId])

  const retry = useCallback(() => setRunId((id) => id + 1), [])

  return { status, attempts, elapsed, retry }
}
