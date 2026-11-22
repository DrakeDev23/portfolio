import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EventCard from './EventCard'
import EventModal from './EventModal'
import { EVENTS_DATA } from '../constants/eventsData'
import { usePortfolioData } from '../context/PortfolioContext'

export default function EventsCarousel({ events = EVENTS_DATA, className = '' }) {
  const portfolioCtx = usePortfolioData() || {}
  const { activeEventIndex = 0, setActiveEventIndex, setIsEventModalOpen, closeEventModalRef, centerCarouselRef } = portfolioCtx
  const total = events.length
  const [activeIndex, setActiveIndex] = useState(activeEventIndex || 0)
  const [selectedEventIndex, setSelectedEventIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768)
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (activeEventIndex !== undefined && activeEventIndex !== activeIndex) {
      setActiveIndex(activeEventIndex)
    }
  }, [activeEventIndex])

  useEffect(() => {
    setActiveEventIndex?.(activeIndex)
  }, [activeIndex, setActiveEventIndex])

  const changeActive = useCallback((index) => {
    const next = (index + total) % total
    setActiveIndex(next)
  }, [total])
  const handleNext = useCallback(() => changeActive(activeIndex + 1), [activeIndex, changeActive])
  const handlePrev = useCallback(() => changeActive(activeIndex - 1), [activeIndex, changeActive])

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (isPaused || reducedMotion || total < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [isPaused, total])
  const handleCardClick = (index) => {
    if (index !== activeIndex) return changeActive(index)
    setSelectedEventIndex(index)
    setIsEventModalOpen?.(true)
  }
  const closeModal = useCallback(() => {
    setSelectedEventIndex(null)
    setIsEventModalOpen?.(false)
  }, [setIsEventModalOpen])

  useEffect(() => {
    if (closeEventModalRef) closeEventModalRef.current = closeModal
    if (centerCarouselRef) centerCarouselRef.current = () => changeActive(activeIndex)
  }, [activeIndex, centerCarouselRef, changeActive, closeEventModalRef, closeModal])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); handlePrev() }
    if (event.key === 'ArrowRight') { event.preventDefault(); handleNext() }
  }
  const visibleOffset = isMobile ? 1 : 2
  const translateStep = isMobile ? 150 : 330
  if (!total) return null

  return (
    <section className={`events-carousel ${className}`} role="region" aria-roledescription="carousel" aria-label="Events and Conferences" tabIndex={0} onKeyDown={handleKeyDown} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false) }}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const distance = touchStartX.current - event.changedTouches[0].clientX
        if (Math.abs(distance) > 40) (distance > 0 ? handleNext : handlePrev)()
        touchStartX.current = null
      }}
    >
      <div className="events-carousel-viewport"><div className="events-carousel-track">
        {events.map((event, index) => {
          let offset = index - activeIndex
          if (offset > total / 2) offset -= total
          if (offset < -total / 2) offset += total
          if (Math.abs(offset) > visibleOffset) return null
          const isActive = offset === 0
          return <div key={event.id ?? index} className={`events-carousel-slide ${isActive ? 'is-active' : 'is-inactive'}`} style={{ transform: `translateX(calc(-50% + ${offset * translateStep}px)) scale(${isActive ? 1 : 0.9})`, zIndex: isActive ? 10 : 5 - Math.abs(offset) }}>
            <EventCard event={event} index={index} isActive={isActive} onClick={() => handleCardClick(index)} />
          </div>
        })}
      </div></div>
      <div className="events-carousel-controls">
        <button type="button" className="events-carousel-arrow" onClick={handlePrev} aria-label="Previous event"><ChevronLeft aria-hidden="true" /></button>
        <div className="events-carousel-progress" aria-live="polite">
          <div className="events-carousel-counter">{String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
          <div className="events-carousel-progress-track" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / total) * 100}%` }} /></div>
        </div>
        <button type="button" className="events-carousel-arrow" onClick={handleNext} aria-label="Next event"><ChevronRight aria-hidden="true" /></button>
      </div>
      <EventModal event={selectedEventIndex !== null ? events[selectedEventIndex] : null} isOpen={selectedEventIndex !== null} onClose={closeModal} currentIndex={selectedEventIndex ?? activeIndex} total={total} />
    </section>
  )
}
