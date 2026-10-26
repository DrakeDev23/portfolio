import { useState, useEffect, useMemo } from 'react'
import SectionHeader from './SectionHeader'
import useScrollReveal from '../hooks/useScrollReveal'
import { usePortfolioData } from '../context/PortfolioContext'
import EventsCarousel from './EventsCarousel'
import { EVENTS_DATA } from '../constants/eventsData'

const IMAGE_MAP = {
  ai: '/assets/images/events/ai.jpeg',
  capstone: '/assets/images/events/capstone.jpeg',
  ctf: '/assets/images/events/ctf.jpeg',
  ict: '/assets/images/events/ict.jpeg',
  launch: '/assets/images/events/launch.jpeg',
  networksec: '/assets/images/events/networksec.jpeg',
  webdev: '/assets/images/events/webdev.jpeg',
  devcon: '/assets/images/events/devcon.jpeg',
  hackathon: '/assets/images/events/hackit.jpeg',
  firewall: '/assets/images/events/firewall.jpeg',
  aws: '/assets/images/events/aws.jpeg',
  comday: '/assets/images/events/comday.png',
  startup: '/assets/images/events/startup.jpg',
  aipinas: '/assets/images/events/AIPinas.jpeg',
  commit: '/assets/images/events/commit.jpeg',
  cloud: '/assets/images/events/cloud.jpeg',
  hackforgov: '/assets/images/events/hack4gov.jpeg',
  javacapstone: '/assets/images/events/oop.jpeg',
  owasp: '/assets/images/events/owasp.jpeg',
  hacktoberfest: '/assets/images/events/hacktoberfest.jpeg'
}

export default function Events() {
  const prefetched = usePortfolioData()
  const [events, setEvents] = useState(prefetched?.events ?? [])
  const [loading, setLoading] = useState(!prefetched?.events)
  const [sectionRef, isVisible] = useScrollReveal()

  useEffect(() => {
    if (prefetched?.events && prefetched.events.length > 0) {
      setEvents(prefetched.events)
      setLoading(false)
      return
    }

    fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`)
      .then((r) => {
        if (!r.ok) throw new Error('Network error')
        return r.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data)
        } else {
          setEvents(EVENTS_DATA)
        }
        setLoading(false)
      })
      .catch(() => {
        setEvents(EVENTS_DATA)
        setLoading(false)
      })
  }, [prefetched?.events])

  const formattedEvents = useMemo(() => {
    const source = events.length > 0 ? events : EVENTS_DATA
    return source.map((ev, index) => {
      const idKey = String(ev.id || '').replace(/\s/g, '').toLowerCase()
      return {
        ...ev,
        id: ev.id || index,
        title: ev.title || ev.name || 'Untitled Event',
        badge: ev.badge || ev.role || 'Attendee',
        rank: ev.rank || (ev.achievement ? String(ev.achievement).toUpperCase() : null),
        description: ev.description || ev.desc || '',
        location: ev.location || 'Cebu City',
        date: ev.date || '',
        image: ev.image || IMAGE_MAP[idKey] || null,
      }
    })
  }, [events])

  return (
    <section
      id="events"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: '#090514' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.35), transparent)',
        }}
      />

      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(122,51,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div
        ref={sectionRef}
        className={`max-w-6xl mx-auto px-4 sm:px-6 relative z-10 reveal ${
          isVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="mb-8 text-center md:text-left">
          <SectionHeader eyebrow="Conference Journey" title="Events & Conferences" />
        </div>

        {loading ? (
          <div
            className="rounded-2xl flex items-center justify-center min-h-[400px]"
            style={{
              background: 'rgba(122,51,255,0.04)',
              border: '1px solid rgba(122,51,255,0.12)',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border-2 animate-spin"
                style={{
                  borderColor: 'rgba(122,51,255,0.6)',
                  borderTopColor: 'transparent',
                }}
              />
              <p className="text-gray-400 text-sm font-mono">Initializing Events...</p>
            </div>
          </div>
        ) : (
          <EventsCarousel
            events={formattedEvents}
            spinSpeed={2.5}
            autoplay={true}
          />
        )}
      </div>
    </section>
  )
}
