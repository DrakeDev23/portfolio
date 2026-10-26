import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Award, Sparkles } from 'lucide-react'

export default function EventModal({
  event,
  isOpen,
  onClose,
  currentIndex = 0,
  total = 0,
}) {
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow === 'hidden' ? '' : prevOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null
  if (typeof document === 'undefined') return null

  const title = event.title || event.name || 'Untitled Event'
  const description = event.description || event.desc || ''
  const badgeText = event.badge || event.role || 'Attendee'
  const rank = event.rank || (event.achievement ? String(event.achievement).toUpperCase() : null)
  const image = event.image || event.img || null
  const location = event.location || 'Cebu City'
  const date = event.date || ''

  const isChampion =
    event.achievement === 'champion' ||
    /champion|1st place/i.test(badgeText) ||
    /champion/i.test(rank || '')
  const isRunnerUp =
    event.achievement === 'runner-up' ||
    /runner[- ]?up|2nd place/i.test(badgeText) ||
    /runner[- ]?up/i.test(rank || '')

  let badgeBorder = 'border-purple-500/50 bg-purple-500/20 text-purple-300'
  let modalBorder = 'border-purple-500/40 shadow-[0_0_60px_rgba(139,92,246,0.35)]'
  let dotColor = 'bg-purple-400'

  if (isChampion) {
    badgeBorder = 'border-amber-400/60 bg-amber-400/20 text-amber-300'
    modalBorder = 'border-amber-400/50 shadow-[0_0_60px_rgba(251,191,36,0.3)]'
    dotColor = 'bg-amber-400'
  } else if (isRunnerUp) {
    badgeBorder = 'border-slate-300/60 bg-slate-300/20 text-slate-200'
    modalBorder = 'border-slate-300/50 shadow-[0_0_60px_rgba(203,213,225,0.25)]'
    dotColor = 'bg-slate-300'
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden border ${modalBorder} bg-[#0e0821] text-gray-100 z-10 shadow-2xl`}
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(122, 51, 255, 0.15) 0%, #0e0821 75%)',
            }}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-purple-500/20 bg-[#120a2a]/80 backdrop-blur-sm z-20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Event Preview
                </span>
                {total > 1 && (
                  <span className="font-mono text-xs text-gray-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-[#070312] border border-purple-500/20 group">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1d123d] to-[#090514]">
                    <Award className="w-16 h-16 text-purple-400/40 mb-2" />
                    <span className="font-mono text-xs text-purple-300/50">Conference & Hackathon</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0821] via-transparent to-black/30 pointer-events-none" />

                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${badgeBorder}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    {badgeText}
                  </span>
                  {rank && rank !== badgeText.toUpperCase() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-black/85 backdrop-blur-md text-purple-200 border border-purple-500/40">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {rank}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/25">
                    <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{location}</span>
                  </div>

                  {date && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/25">
                      <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{date}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300/80 mb-2">
                  About this Event
                </h3>
                <p className="break-normal [overflow-wrap:break-word] leading-relaxed text-sm sm:text-base text-gray-200">
                  {description}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-purple-500/20 bg-[#120a2a]/60 backdrop-blur-sm flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Close Preview
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
