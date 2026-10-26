import { motion, AnimatePresence } from 'framer-motion'

function BootLine({ type, message }) {
  const prefix = type === 'error' ? '[ ERROR ]' : '[  OK  ]'
  const color = type === 'error' ? '#ef4444' : '#22C55E'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="font-mono text-xs sm:text-sm leading-relaxed"
    >
      <span style={{ color }} className="mr-2">
        {prefix}
      </span>
      <span className="text-gray-300">{message}</span>
    </motion.div>
  )
}

export default function TerminalBoot({ logs }) {
  return (
    <div
      className="w-full max-w-lg overflow-hidden"
      style={{
        background: '#0d0f12',
        border: '1px solid #2a2e34',
      }}
    >
      {/* */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{ background: '#1a1d21', borderColor: '#2a2e34' }}
      >
        <span className="font-mono text-[10px] text-gray-400 tracking-wide">
          drake@archlinux:~$ boot.log
        </span>
        <div className="flex items-center gap-3 font-mono text-[11px] text-gray-500">
          <span className="hover:text-gray-300 cursor-pointer">_</span>
          <span className="hover:text-gray-300 cursor-pointer">□</span>
          <span className="hover:text-red-400 cursor-pointer">×</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-1 max-h-44 overflow-y-auto">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => (
            <BootLine
              key={log.id || `boot-line-${index}`}
              type={log.type}
              message={log.message}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}