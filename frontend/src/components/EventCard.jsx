import React from 'react'
import { MapPin, Calendar, Award } from 'lucide-react'


export default function EventCard({
  event,
  index,
  isActive,
  isHovered = false,
  overlayOpacity = 0,
  cardWidth,
  cardHeight,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
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

  let badgeClasses = 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  let dotColor = 'bg-purple-400'

  if (isChampion) {
    badgeClasses = 'bg-amber-400/20 text-amber-300 border-amber-400/50'
    dotColor = 'bg-amber-400'
  } else if (isRunnerUp) {
    badgeClasses = 'bg-slate-300/20 text-slate-200 border-slate-300/50'
    dotColor = 'bg-slate-300'
  }

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1}: ${title}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative select-none rounded-2xl overflow-hidden will-change-transform touch-manipulation w-full h-full flex flex-col transition-all duration-300 ${
        isHovered
          ? 'border-2 border-purple-400 ring-2 ring-purple-400/40 shadow-[0_0_45px_rgba(168,85,247,0.55)] scale-[1.02] cursor-pointer'
          : isActive
          ? 'border border-purple-500/60 shadow-[0_0_50px_rgba(139,92,246,0.4)] animate-glow-pulse cursor-default'
          : 'border border-purple-500/25 hover:border-purple-500/45 cursor-pointer'
      }`}
      style={{
        backgroundColor: '#0f0a1f', 
        backgroundImage: 'linear-gradient(165deg, #180f33 0%, #0d0822 100%)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="relative w-full h-[44%] overflow-hidden bg-[#090514] flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform ease-out ${
              isHovered || isActive ? 'scale-105 duration-500' : 'scale-100 duration-700'
            }`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1d123d] to-[#0a0518]">
            <Award className="w-12 h-12 text-purple-400/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#180f33] via-[#180f33]/30 to-transparent pointer-events-none" />

        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 transition-all duration-500 ease-out ${
            isHovered || isActive ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'
          }`}
        >
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${badgeClasses}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {badgeText}
          </span>
          {rank && rank !== badgeText.toUpperCase() && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-black text-purple-200/90 border border-purple-500/30">
              {rank}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#120a27] overflow-hidden">
        <div>
          <h3
            className={`text-base sm:text-lg font-bold tracking-tight truncate transition-all duration-500 ease-out delay-[70ms] ${
              isHovered || isActive ? 'opacity-100 translate-y-0 text-white' : 'opacity-85 translate-y-1 text-gray-200'
            }`}
            title={title}
          >
            {title}
          </h3>

          <p
            className={`mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 transition-all duration-500 ease-out delay-[140ms] ${
              isHovered || isActive ? 'opacity-100 translate-y-0' : 'opacity-65 translate-y-2'
            }`}
          >
            {description}
          </p>
        </div>

        <div className="pt-2 sm:pt-3 border-t border-purple-500/15 flex flex-col gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-400 flex-shrink-0">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-500 ease-out delay-[210ms] ${
              isHovered || isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-500 ease-out delay-[280ms] ${
              isHovered || isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 bg-[#05020f] rounded-2xl pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 0 : overlayOpacity,
        }}
      />
    </article>
  )
}
