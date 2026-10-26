import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EventCard from './EventCard'
import EventModal from './EventModal'
import { EVENTS_DATA } from '../constants/eventsData'
import { usePortfolioData } from '../context/PortfolioContext'

export default function EventsCarousel({
  events = EVENTS_DATA,
  spinSpeed = 2.5, 
  autoplay = true,
  className = '',
}) {
  const total = events.length
  const step = 360 / (total || 1)

  const portfolioCtx = usePortfolioData()
  const {
    activeEventIndex = 0,
    setActiveEventIndex,
    setIsEventModalOpen,
    closeEventModalRef,
    centerCarouselRef,
  } = portfolioCtx || {}

  const [activeIndex, setActiveIndex] = useState(activeEventIndex || 0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedEventIndex, setSelectedEventIndex] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  const [stageWidth, setStageWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  const stageRef = useRef(null)
  const ringRef = useRef(null)

  const currentAngleRef = useRef((activeEventIndex || 0) * step)
  const targetAngleRef = useRef((activeEventIndex || 0) * step)
  const isAnimatingToTarget = useRef(false)
  const activeIndexRef = useRef(activeEventIndex || 0)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const hoveredIndexRef = useRef(null)
  const selectedEventIndexRef = useRef(null)
  selectedEventIndexRef.current = selectedEventIndex

  const isDraggingRef = useRef(false)
  const isPointerDownRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartAngleRef = useRef(0)
  const lastTimeRef = useRef(null)
  const rafIdRef = useRef(null)
  const isTabHiddenRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setStageWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (activeEventIndex !== undefined && activeEventIndex !== activeIndexRef.current) {
      setActiveIndex(activeEventIndex)
      activeIndexRef.current = activeEventIndex
      if (!isMobile) {
        currentAngleRef.current = activeEventIndex * step
        targetAngleRef.current = activeEventIndex * step
      }
    }
  }, [activeEventIndex, isMobile, step])

  const cardW = Math.min(340, Math.max(240, stageWidth * 0.34))
  const cardH = Math.round(cardW * 1.15)
  const stageHeight = cardH + 140

  const radius = useMemo(() => {
    if (total <= 1) return 0
    return Math.round((cardW * 1.08) / 2 / Math.tan(Math.PI / total))
  }, [cardW, total])

  const radiusRef = useRef(radius)
  radiusRef.current = radius

  const chord = useMemo(() => {
    if (total <= 1) return 120
    return Math.max(120, radius * Math.sin((2 * Math.PI) / total))
  }, [radius, total])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    reducedMotionRef.current = mediaQuery.matches

    const handleMotionChange = (e) => {
      setReducedMotion(e.matches)
      reducedMotionRef.current = e.matches
    }
    mediaQuery.addEventListener?.('change', handleMotionChange)
    return () => mediaQuery.removeEventListener?.('change', handleMotionChange)
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden'
      isTabHiddenRef.current = isHidden
      if (!isHidden) {
        lastTimeRef.current = null
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const getCircularOffset = useCallback((i, currentPos, count) => {
    let d = ((i - currentPos) % count + count) % count
    if (d > count / 2) d -= count
    return d
  }, [])

  const getShortestTargetAngle = useCallback((targetIndex, currentAngle, cardStep, count) => {
    const fullCircle = count * cardStep
    const baseTarget = targetIndex * cardStep
    const k = Math.round((currentAngle - baseTarget) / fullCircle)
    return baseTarget + k * fullCircle
  }, [])

  const centerCarouselOnActive = useCallback(() => {
    const targetIdx = activeIndexRef.current
    if (isMobile) {
      setActiveIndex(targetIdx)
      return
    }
    targetAngleRef.current = getShortestTargetAngle(
      targetIdx,
      currentAngleRef.current,
      step,
      total
    )
    isAnimatingToTarget.current = true
  }, [getShortestTargetAngle, step, total, isMobile])

  useEffect(() => {
    if (centerCarouselRef) {
      centerCarouselRef.current = centerCarouselOnActive
    }
  }, [centerCarouselRef, centerCarouselOnActive])

  const handleNext = useCallback(() => {
    if (isMobile) {
      const next = (activeIndexRef.current + 1) % total
      activeIndexRef.current = next
      setActiveIndex(next)
      if (setActiveEventIndex) setActiveEventIndex(next)
      return
    }
    const currentStep = Math.round(currentAngleRef.current / step)
    targetAngleRef.current = (currentStep + 1) * step
    isAnimatingToTarget.current = true
  }, [step, isMobile, total, setActiveEventIndex])

  const handlePrev = useCallback(() => {
    if (isMobile) {
      const next = (activeIndexRef.current - 1 + total) % total
      activeIndexRef.current = next
      setActiveIndex(next)
      if (setActiveEventIndex) setActiveEventIndex(next)
      return
    }
    const currentStep = Math.round(currentAngleRef.current / step)
    targetAngleRef.current = (currentStep - 1) * step
    isAnimatingToTarget.current = true
  }, [step, isMobile, total, setActiveEventIndex])

  const handleCardClick = useCallback((targetIndex) => {
    if (!isMobile) {
      targetAngleRef.current = getShortestTargetAngle(
        targetIndex,
        currentAngleRef.current,
        step,
        total
      )
      isAnimatingToTarget.current = true
    }
    setSelectedEventIndex(targetIndex)
    if (setActiveEventIndex) {
      setActiveEventIndex(targetIndex)
    }
    if (setIsEventModalOpen) {
      setIsEventModalOpen(true)
    }
  }, [getShortestTargetAngle, step, total, isMobile, setActiveEventIndex, setIsEventModalOpen])

  const handleModalClose = useCallback(() => {
    setSelectedEventIndex(null)
    if (setIsEventModalOpen) {
      setIsEventModalOpen(false)
    }
  }, [setIsEventModalOpen])

  useEffect(() => {
    if (closeEventModalRef) {
      closeEventModalRef.current = handleModalClose
    }
  }, [closeEventModalRef, handleModalClose])

  const handleCardMouseEnter = useCallback((index) => {
    hoveredIndexRef.current = index
    setHoveredIndex(index)
  }, [])

  const handleCardMouseLeave = useCallback((index) => {
    if (hoveredIndexRef.current === index) {
      hoveredIndexRef.current = null
      setHoveredIndex(null)
    }
  }, [])

  const handleKeyDown = (e) => {
    if (selectedEventIndex !== null) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    isPointerDownRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartAngleRef.current = currentAngleRef.current
    isAnimatingToTarget.current = false
  }

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return
    const dx = e.clientX - dragStartXRef.current

    if (!hasMovedRef.current && Math.abs(dx) > 6) {
      hasMovedRef.current = true
      setIsDragging(true)
      isDraggingRef.current = true
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch (_) {}
    }

    if (hasMovedRef.current) {
      const angleDelta = (dx / chord) * step
      currentAngleRef.current = dragStartAngleRef.current - angleDelta
    }
  }

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return
    isPointerDownRef.current = false

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (_) {}

    if (hasMovedRef.current) {
      setIsDragging(false)
      isDraggingRef.current = false
      const currentStep = Math.round(currentAngleRef.current / step)
      targetAngleRef.current = currentStep * step
      isAnimatingToTarget.current = true
    }
  }

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX
    touchEndXRef.current = null
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return
    const diff = touchStartXRef.current - touchEndXRef.current
    const minSwipeDistance = 40
    if (diff > minSwipeDistance) {
      handleNext()
    } else if (diff < -minSwipeDistance) {
      handlePrev()
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  useEffect(() => {
    if (!total || isMobile) return

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      if (isDraggingRef.current) {
      } else if (isAnimatingToTarget.current) {
        const diff = targetAngleRef.current - currentAngleRef.current
        if (Math.abs(diff) < 0.05) {
          currentAngleRef.current = targetAngleRef.current
          isAnimatingToTarget.current = false
        } else {
          currentAngleRef.current += diff * Math.min(delta * 9, 0.25)
        }
      } else if (
        hoveredIndexRef.current === null &&
        selectedEventIndexRef.current === null &&
        !reducedMotionRef.current &&
        !isTabHiddenRef.current &&
        autoplay &&
        total > 1
      ) {
        currentAngleRef.current += spinSpeed * delta
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${radiusRef.current}px) rotateY(${-currentAngleRef.current}deg)`
      }

      const currentStepIndex = Math.round(currentAngleRef.current / step)
      const normIndex = ((currentStepIndex % total) + total) % total
      if (normIndex !== activeIndexRef.current) {
        activeIndexRef.current = normIndex
        setActiveIndex(normIndex)
        if (setActiveEventIndex) {
          setActiveEventIndex(normIndex)
        }
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [total, step, spinSpeed, autoplay, isMobile, setActiveEventIndex])

  if (!total) return null

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Events and Conferences"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
      style={{
        overflowX: 'clip',
        overflowY: 'visible',
      }}
    >
      <div className="flex md:hidden flex-col items-center w-full px-2">
        <div
          className="relative w-full max-w-[340px] h-[430px] rounded-2xl select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 -z-10 rounded-2xl bg-purple-600/15 blur-2xl pointer-events-none" />

          <div key={activeIndex} className="w-full h-full animate-fadeIn">
            <EventCard
              event={events[activeIndex]}
              index={activeIndex}
              isActive={true}
              isHovered={false}
              overlayOpacity={0}
              onClick={() => handleCardClick(activeIndex)}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-5 z-20">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous event slide"
            className="h-12 w-12 rounded-full flex items-center justify-center text-white bg-[#130b29] border border-purple-500/30 hover:border-purple-400 active:scale-90 active:bg-purple-900/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 touch-manipulation select-none shadow-[0_0_15px_rgba(139,92,246,0.25)]"
          >
            <ChevronLeft className="w-6 h-6 text-purple-200" />
          </button>

          <div className="font-mono text-sm font-bold tracking-wider text-purple-300 bg-[#130b29] px-4 py-2 rounded-full border border-purple-500/25 shadow-inner">
            <span key={activeIndex} className="inline-block animate-load-pop">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>{' '}
            <span className="text-purple-500/50">/</span>{' '}
            <span className="text-gray-500">{String(total).padStart(2, '0')}</span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next event slide"
            className="h-12 w-12 rounded-full flex items-center justify-center text-white bg-[#130b29] border border-purple-500/30 hover:border-purple-400 active:scale-90 active:bg-purple-900/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 touch-manipulation select-none shadow-[0_0_15px_rgba(139,92,246,0.25)]"
          >
            <ChevronRight className="w-6 h-6 text-purple-200" />
          </button>
        </div>
      </div>

      <div className="hidden md:block relative w-full overflow-visible">
        <button
          type="button"
          onClick={handlePrev}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Previous event card"
          className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-6 h-12 w-12 rounded-full flex items-center justify-center text-white bg-[#130b29]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-110 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 z-[200] touch-manipulation select-none"
        >
          <ChevronLeft className="w-6 h-6 text-gray-200" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Next event card"
          className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-6 h-12 w-12 rounded-full flex items-center justify-center text-white bg-[#130b29]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-110 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 z-[200] touch-manipulation select-none"
        >
          <ChevronRight className="w-6 h-6 text-gray-200" />
        </button>

        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible select-none"
          style={{
            height: `${stageHeight}px`,
            perspective: '1800px',
            perspectiveOrigin: '50% 35%',
            touchAction: 'pan-y',
          }}
        >
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 h-16 rounded-full bg-purple-600/35 blur-3xl pointer-events-none opacity-40 z-0" />

          <div
            ref={ringRef}
            className="absolute left-1/2 top-1/2 w-0 h-0 will-change-transform [transform-style:preserve-3d] z-10"
            style={{
              transform: `translateZ(-${radius}px) rotateY(0deg)`,
            }}
          >
            {events.map((event, i) => {
              const cardAngle = i * step
              const offset = getCircularOffset(i, activeIndex, total)
              const angleFromFront = Math.abs(offset) * step
              const isFrontFacing = angleFromFront <= 85
              const isActive = i === activeIndex
              const isHovered = hoveredIndex === i
              const overlayOpacity = isActive ? 0 : Math.min((angleFromFront / 45) * 0.45, 0.75)

              return (
                <div
                  key={event.id ?? i}
                  className={`absolute will-change-transform [transform-style:preserve-3d] ${
                    isFrontFacing ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                  style={{
                    left: -cardW / 2,
                    top: -cardH / 2,
                    width: `${cardW}px`,
                    height: `${cardH}px`,
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <EventCard
                      event={event}
                      index={i}
                      isActive={isActive}
                      isHovered={isHovered}
                      overlayOpacity={overlayOpacity}
                      cardWidth={cardW}
                      cardHeight={cardH}
                      onMouseEnter={() => handleCardMouseEnter(i)}
                      onMouseLeave={() => handleCardMouseLeave(i)}
                      onClick={(e) => {
                        if (hasMovedRef.current) return
                        e.stopPropagation()
                        handleCardClick(i)
                      }}
                    />
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl border border-purple-500/25 flex flex-col items-center justify-center p-6 select-none pointer-events-none"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      backgroundColor: '#0b0618',
                      backgroundImage:
                        'radial-gradient(circle at 50% 50%, rgba(122, 51, 255, 0.18) 0%, #0b0618 85%)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mb-2 text-purple-400/50 font-mono text-sm shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                      #
                    </div>
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-purple-300/25">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] tracking-wider uppercase font-semibold text-purple-400/25 mt-1 font-mono">
                      Drake Events
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-3 z-[200]">
          <div className="flex items-center gap-2">
            <span
              key={activeIndex}
              className="inline-block font-mono text-xs sm:text-sm font-bold tracking-wider text-purple-300 animate-load-pop"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-purple-500/50">/</span>
            <span className="font-mono text-xs text-gray-500">
              {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEventIndex !== null ? events[selectedEventIndex] : null}
        isOpen={selectedEventIndex !== null}
        onClose={handleModalClose}
        currentIndex={selectedEventIndex ?? activeIndex}
        total={total}
      />
    </section>
  )
}
