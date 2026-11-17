import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import CyberLoader from './CyberLoader'
import TerminalBoot from './TerminalBoot'
import { usePortfolioLoader } from '../hooks/usePortfolioLoader'

const SYS_INFO = [
  { label: 'OS', value: 'Arch Linux' },
  { label: 'Kernel', value: 'Linux' },
  { label: 'Shell', value: 'bash' },
  { label: 'Theme', value: 'Cyber Security' },
]

export default function LinuxBootLoader({ onComplete }) {
  const { progress, logs, status, error, data, phase, isSlow, run, skipWithFallback } = usePortfolioLoader()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    run()
  }, [run])

  useEffect(() => {
    if (phase !== 'ready') return

    const timer = setTimeout(() => {
      onComplete(data)
    }, 450)

    return () => clearTimeout(timer)
  }, [phase, onComplete, data])

  const handleSkip = () => {
    const fallback = skipWithFallback()
    onComplete(fallback)
  }

  const isReady = phase === 'ready'
  const isError = phase === 'error'

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #030014 0%, #120024 45%, #2D0B59 100%)',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-xl">
        <CyberLoader progress={progress} expanded={isReady} />

        <div className="text-center space-y-2">
          <motion.h1 className="font-mono font-bold text-xl sm:text-2xl tracking-widest" style={{ color: '#FFFFF' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            DRAKE@ARCHLINUX
          </motion.h1>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] sm:text-xs text-gray-500">
            {SYS_INFO.map(({ label, value }) => (
              <span key={label}>
                <span className="text-[#A855F7]/70">{label}:</span> {value}
              </span>
            ))}
          </div>
        </div>

        <TerminalBoot logs={logs} />

        <div className="text-center space-y-2 w-full">
          <AnimatePresence mode="wait">
            {isReady ? (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-1 font-mono"
              >
                <p className="text-[#22C55E] text-sm font-semibold tracking-widest">
                  SYSTEM READY
                </p>
                <p className="text-[#C084FC] text-xs tracking-wider">DATABASE ONLINE</p>
                <p className="text-[#A855F7] text-xs tracking-wider">ACCESS GRANTED</p>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="font-mono text-red-400 text-sm font-semibold tracking-widest">
                  SYSTEM ERROR
                </p>
                <p className="font-mono text-gray-400 text-xs">
                  {error?.includes('Database') ? 'Database unavailable' : 'Backend connection failed'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={run}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      background: 'rgba(168,85,247,0.15)',
                      border: '1px solid rgba(168,85,247,0.4)',
                      color: '#C084FC',
                    }}
                  >
                    <RefreshCw size={13} />
                    Retry Connection
                  </button>
                  <button
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 bg-white/5"
                  >
                    View Offline Snapshot →
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <p className="font-mono text-gray-400 text-xs sm:text-sm">{status}</p>
                <p className="font-mono text-[#A855F7] text-xs">
                  Progress: {progress}%
                </p>
                {isSlow && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2"
                  >
                    <button
                      onClick={handleSkip}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[11px] text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-400 bg-purple-950/40 hover:bg-purple-900/50 transition-all cursor-pointer"
                    >
                      Skip Waiting (Open Snapshot) →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}