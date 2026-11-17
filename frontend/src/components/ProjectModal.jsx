import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Heart } from 'lucide-react'

function getLinks(project) {
  if (!project) return { live: null, github: null }
  const links = project.links || {}
  const live =
    project.liveUrl || project.demo || project.demoUrl || project.live || project.url || links.live || links.demo || null
  const github =
    project.github || project.githubUrl || project.repo || project.repoUrl || links.github || links.repo || null
  return { live, github }
}

export default function ProjectModal({
  project,
  image,
  isOpen,
  onClose,
  onPrev,
  onNext,
  index = 0,
  total = 0,
  isLiked = false,
  onLike,
}) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev === 'hidden' ? '' : prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement
    const raf = requestAnimationFrame(() => {
      const el = dialogRef.current?.querySelector('[data-autofocus]') || dialogRef.current
      el?.focus()
    })
    return () => {
      cancelAnimationFrame(raf)
      const prev = previouslyFocused.current
      if (prev && typeof prev.focus === 'function') prev.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrev?.()
      } else if (e.key === 'ArrowRight') {
        onNext?.()
      } else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        )
        if (!nodes || nodes.length === 0) return
        const focusable = Array.from(nodes).filter(
          (n) => !n.disabled && n.offsetParent !== null
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, onPrev, onNext])

  if (typeof document === 'undefined') return null

  const { live, github } = getLinks(project)
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
      }

  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            {...panelMotion}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0821] text-gray-100 focus:outline-none"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
              <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
                {project.subtitle}
              </span>
              <div className="flex items-center gap-2">
                {onLike && (
                  <button
                    type="button"
                    onClick={onLike}
                    aria-label={isLiked ? `Liked ${project.title}` : `Like ${project.title}`}
                    aria-pressed={isLiked}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold backdrop-blur-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                      isLiked
                        ? 'bg-rose-950/90 border border-rose-500/80 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                        : 'bg-white/5 border border-white/20 text-white hover:border-rose-400/60 hover:text-rose-300 hover:scale-105 active:scale-95'
                    }`}
                    style={{ cursor: isLiked ? 'default' : 'pointer' }}
                  >
                    <Heart
                      size={14}
                      strokeWidth={2}
                      fill={isLiked ? '#f43f5e' : 'none'}
                      color={isLiked ? '#f43f5e' : '#fb7185'}
                      style={{
                        filter: isLiked ? 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.75))' : 'none',
                      }}
                    />
                    <span>{Number(project.likes ?? 0)}</span>
                  </button>
                )}
                {total > 1 && (
                  <span className="mr-1 font-mono text-[11px] text-gray-500">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous project"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-[#7A33FF]/50 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next project"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-[#7A33FF]/50 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-[#7A33FF]/50 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:h-72">
                {image ? (
                  <img
                    src={image}
                    alt={`${project.title} screenshot`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div
                    className="h-full w-full bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div>
                <h2 className="text-xl font-medium leading-snug text-gray-100">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm font-normal leading-relaxed text-gray-400">
                  {project.desc}
                </p>
              </div>

              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] font-normal text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {(live || github) && (
              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-4">
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]"
                    style={{ backgroundColor: '#7A33FF' }}
                  >
                    <ExternalLink size={15} />
                    Live demo
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-[#7A33FF]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]"
                  >
                    <Github size={15} />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
