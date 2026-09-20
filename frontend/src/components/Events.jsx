import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeader from './SectionHeader'
import useScrollReveal from '../hooks/useScrollReveal'
import { usePortfolioData } from '../context/PortfolioContext'

const IMAGE_MAP = {
  ai: "/assets/images/events/ai.jpeg",
  capstone: "/assets/images/events/capstone.jpeg",
  ctf: "/assets/images/events/ctf.jpeg",
  ict: "/assets/images/events/ict.jpeg",
  launch: "/assets/images/events/launch.jpeg",
  networksec: "/assets/images/events/networksec.jpeg",
  webdev: "/assets/images/events/webdev.jpeg",
  devcon: "/assets/images/events/devcon.jpeg",
  hackathon: "/assets/images/events/hackit.jpeg",
  firewall: "/assets/images/events/firewall.jpeg",
  aws: "/assets/images/events/aws.jpeg",
  comday: "/assets/images/events/comday.png",
  startup: "/assets/images/events/startup.jpg",
  aipinas: "/assets/images/events/AIPinas.jpeg",
}

const ACCENT = '#7A33FF'
const INTERVAL = 4500

export default function Events() {
  const prefetched = usePortfolioData()
  const [events, setEvents] = useState(prefetched?.events ?? [])
  const [loading, setLoading] = useState(!prefetched?.events)
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)
  const [sectionRef, isVisible] = useScrollReveal()

  useEffect(() => {
    if (prefetched?.events) {
      setEvents(prefetched.events)
      setLoading(false)
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [prefetched?.events])

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % events.length)
    }, INTERVAL)
  }, [events.length])

  useEffect(() => {
    if (events.length === 0) return
    resetTimer()
    return () => clearInterval(intervalRef.current)
  }, [resetTimer, events.length])

  const go = (dir) => {
    setCurrent((c) => (c + dir + events.length) % events.length)
    resetTimer()
  }

  const goTo = (i) => {
    setCurrent(i)
    resetTimer()
  }

  const ev = events[current]
  const evImage = ev ? IMAGE_MAP[ev.id?.replace(/\s/g, '').toLowerCase()] : null
  const isWin = ev?.achievement === 'champion'
  const isRunnerUp = ev?.achievement === 'runner-up'
  const accent = isWin ? '#FFD700' : isRunnerUp ? '#C0C0C0' : ACCENT

  return (
    <section
      id="events"
      className="py-28 relative"
      style={{ backgroundColor: '#090514' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)' }}
      />
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(122,51,255,0.05) 0%, transparent 70%)' }}
      />

      <div
        ref={sectionRef}
        className={`max-w-6xl mx-auto px-6 relative z-10 reveal ${isVisible ? 'reveal-visible' : ''}`}
      >
        <SectionHeader eyebrow="Conference Journey" title="Events & Conferences" />

        {loading ? (
          <div
            className="rounded-2xl flex items-center justify-center"
            style={{
              minHeight: '340px',
              background: 'rgba(122,51,255,0.05)',
              border: '1px solid rgba(122,51,255,0.12)',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(122,51,255,0.5)', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500 text-sm">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? null : (
          <>
            <div
              key={ev.id}
              className="relative rounded-2xl overflow-hidden mb-4"
              style={{
                background: `linear-gradient(135deg, ${accent}18, ${accent}08, #130e2a)`,
                border: `1px solid ${accent}30`,
                minHeight: '340px',
              }}
            >
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
                  transform: 'translate(30%, -30%)',
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
                  transform: 'translate(-30%, 30%)',
                }}
              />

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                <div
                  className="w-full md:w-80 flex-shrink-0 rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: '16/9',
                    background: `linear-gradient(135deg, ${accent}20, #0f0c22)`,
                    border: `1px solid ${accent}20`,
                  }}
                >
                  {evImage && (
                    <img
                      src={evImage}
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: accent + 'cc' }}
                      >
                        {ev.role}
                      </p>
                      {(isWin || isRunnerUp) && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: isWin ? 'rgba(255,215,0,0.15)' : 'rgba(192,192,192,0.12)',
                            border: isWin ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(192,192,192,0.35)',
                            color: isWin ? '#ffd700' : '#d0d0d0',
                          }}
                        >
                          {isWin ? 'Champion' : 'Runner Up'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white text-3xl font-black mb-3">{ev.name}</h3>
                    <p className="text-gray-400 leading-relaxed">{ev.desc}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} strokeWidth={1.5} style={{ color: accent + '90', flexShrink: 0 }} />
                      <span className="text-gray-400 text-sm">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} strokeWidth={1.5} style={{ color: accent + '90', flexShrink: 0 }} />
                      <span className="text-gray-400 text-sm">{ev.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 px-8 md:px-12 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {events.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to event ${i + 1}`}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === current ? '24px' : '8px',
                        height: '8px',
                        background: i === current ? accent : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous event"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next event"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {events.map((e, i) => {
                const c = e.achievement === 'champion' ? '#FFD700' : e.achievement === 'runner-up' ? '#C0C0C0' : ACCENT
                return (
                  <button
                    key={e.id}
                    onClick={() => goTo(i)}
                    className="relative rounded-xl overflow-hidden transition-all duration-200 text-left"
                    style={{
                      background: `linear-gradient(135deg, ${c}18, #0f0c22)`,
                      border: i === current ? `1px solid ${c}60` : '1px solid rgba(122,51,255,0.12)',
                      padding: '10px 12px',
                      opacity: i === current ? 1 : 0.6,
                      transform: i === current ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: i === current ? `0 4px 20px ${c}25` : 'none',
                    }}
                  >
                    <p
                      className="text-xs font-bold truncate"
                      style={{ color: i === current ? 'white' : '#9ca3af' }}
                    >
                      {e.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 truncate"
                      style={{ color: c + '80', fontSize: '10px' }}
                    >
                      {e.role}
                    </p>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}