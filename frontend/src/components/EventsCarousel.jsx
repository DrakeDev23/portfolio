import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EventCard from './EventCard'
import { EVENTS_DATA } from '../constants/eventsData'

export default function EventsCarousel({
  events = EVENTS_DATA,
  spinSpeed = 7.5, // degrees per second
  autoplay = true,
  className = '',
}) {
  const total = events.length
  const step = 360 / (total || 1)

  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [stageWidth, setStageWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  const stageRef = useRef(null)
  const ringRef = useRef(null)

  // Animation & interaction refs to allow 60fps RAF loop without React re-render overhead
  const currentAngleRef = useRef(0)
  const targetAngleRef = useRef(0)
  const isAnimatingToTargetRef = useRef(false)
  const activeIndexRef = useRef(0)
  const hoveredIndexRef = useRef(null)
  const isDraggingRef = useRef(false)
  const isPointerDownRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartAngleRef = useRef(0)
  const lastTimeRef = useRef(null)
  const rafIdRef = useRef(null)
  const isTabHiddenRef = useRef(false)
  const reducedMotionRef = useRef(false)

  // Track responsive container width
  useEffect(() => {
    if (!stageRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setStageWidth(entry.contentRect.width)
        }
      }
    })
    ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  const isMobile = stageWidth < 768
  const cardW = Math.round(
    isMobile
      ? Math.min(300, Math.max(220, stageWidth * 0.66))
      : Math.min(340, Math.max(240, stageWidth * 0.34))
  )
  const cardH = Math.round(cardW * (isMobile ? 1.3 : 1.15))
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

  // Reduced motion preference
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

  // Tab visibility
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

  // Calculate circular offset between card i and active card
  const getCircularOffset = useCallback((i, currentPos, count) => {
    let d = ((i - currentPos) % count + count) % count
    if (d > count / 2) d -= count
    return d
  }, [])

  // Find shortest rotation angle to bring target card index to the front
  const getShortestTargetAngle = useCallback((targetIndex, currentAngle, cardStep, count) => {
    const fullCircle = count * cardStep
    const baseTarget = targetIndex * cardStep
    const k = Math.round((currentAngle - baseTarget) / fullCircle)
    return baseTarget + k * fullCircle
  }, [])

  // Navigation handlers
  const handleNext = useCallback(() => {
    const currentStep = Math.round(currentAngleRef.current / step)
    targetAngleRef.current = (currentStep + 1) * step
    isAnimatingToTargetRef.current = true
  }, [step])

  const handlePrev = useCallback(() => {
    const currentStep = Math.round(currentAngleRef.current / step)
    targetAngleRef.current = (currentStep - 1) * step
    isAnimatingToTargetRef.current = true
  }, [step])

  const handleCardClick = useCallback((targetIndex) => {
    targetAngleRef.current = getShortestTargetAngle(
      targetIndex,
      currentAngleRef.current,
      step,
      total
    )
    isAnimatingToTargetRef.current = true
  }, [getShortestTargetAngle, step, total])

  // Hover handlers on specific event cards: stops rotation on hover, resumes on leave
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

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  // Pointer drag gestures
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    isPointerDownRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartAngleRef.current = currentAngleRef.current
    isAnimatingToTargetRef.current = false
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
      isAnimatingToTargetRef.current = true
    }
  }

  // Main 60fps RAF Animation Loop
  useEffect(() => {
    if (!total) return

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      if (isDraggingRef.current) {
        // Position directly controlled by pointer move
      } else if (isAnimatingToTargetRef.current) {
        // Smooth ease-out interpolation toward target angle
        const diff = targetAngleRef.current - currentAngleRef.current
        if (Math.abs(diff) < 0.05) {
          currentAngleRef.current = targetAngleRef.current
          isAnimatingToTargetRef.current = false
        } else {
          currentAngleRef.current += diff * Math.min(delta * 9, 0.25)
        }
      } else if (
        hoveredIndexRef.current === null &&
        !reducedMotionRef.current &&
        !isTabHiddenRef.current &&
        autoplay &&
        total > 1
      ) {
        // Continuous smooth spinning! Halts when a specific event card is hovered
        currentAngleRef.current += spinSpeed * delta
      }

      // Apply transform directly to GPU-accelerated 3D ring container
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${radiusRef.current}px) rotateY(${-currentAngleRef.current}deg)`
      }

      // Update active front-facing card index only when crossing card thresholds
      const currentStepIndex = Math.round(currentAngleRef.current / step)
      const normIndex = ((currentStepIndex % total) + total) % total
      if (normIndex !== activeIndexRef.current) {
        activeIndexRef.current = normIndex
        setActiveIndex(normIndex)
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [total, step, spinSpeed, autoplay])

  if (!total) return null

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Events and Conferences 3D Ring Carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
      style={{
        overflowX: 'clip',
        overflowY: 'visible',
      }}
    >
      <div className="relative w-full overflow-visible">
        {/* Navigation Left Button */}
        <button
          type="button"
          onClick={handlePrev}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Previous event card"
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-2 lg:left-6 h-12 w-12 rounded-full items-center justify-center text-white bg-[#130b29]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-110 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 z-[200] touch-manipulation select-none disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-6 h-6 text-gray-200" />
        </button>

        {/* Navigation Right Button */}
        <button
          type="button"
          onClick={handleNext}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Next event card"
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-2 lg:right-6 h-12 w-12 rounded-full items-center justify-center text-white bg-[#130b29]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-110 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 z-[200] touch-manipulation select-none disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight className="w-6 h-6 text-gray-200" />
        </button>

        {/* 3D Carousel Stage */}
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

          {/* 3D Rotating Cylinder Ring */}
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
                  } ${isHovered ? 'z-30' : isActive ? 'z-20' : 'z-10'}`}
                  style={{
                    left: -cardW / 2,
                    top: -cardH / 2,
                    width: `${cardW}px`,
                    height: `${cardH}px`,
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  }}
                >
                  {/* Front Card Face */}
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

                  {/* Back Card Face (Decorated Cylinder Interior) */}
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
      </div>

      {/* Desktop Counter Indicator */}
      <div className="hidden md:flex justify-center mt-3 z-[200]">
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

      {/* Mobile Controls */}
      <div className="flex md:hidden items-center justify-center gap-6 mt-4 z-[200]">
        <button
          type="button"
          onClick={handlePrev}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Previous event card"
          className="h-11 w-11 rounded-full flex items-center justify-center text-white bg-[#130b29]/90 border border-purple-500/30 hover:border-purple-400 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 touch-manipulation select-none shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          <ChevronLeft className="w-5 h-5 text-gray-200" />
        </button>

        <div className="font-mono text-sm font-bold tracking-wider text-purple-300">
          <span key={activeIndex} className="inline-block animate-load-pop">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>{' '}
          <span className="text-purple-500/50">/</span>{' '}
          <span className="text-gray-500">{String(total).padStart(2, '0')}</span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Next event card"
          className="h-11 w-11 rounded-full flex items-center justify-center text-white bg-[#130b29]/90 border border-purple-500/30 hover:border-purple-400 active:scale-90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 touch-manipulation select-none shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          <ChevronRight className="w-5 h-5 text-gray-200" />
        </button>
      </div>
    </section>
  )
}
