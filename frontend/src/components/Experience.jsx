import { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { usePortfolioData } from '../context/PortfolioContext'

export const EXPERIENCES_DATA = [
  {
    id: 1,
    title: 'Founding Software Engineer',
    company: 'Pterano',
    type: 'Startup',
    location: 'Cebu, Philippines',
    duration: 'Jun 21, 2026 – Present',
    description:
      'Helping establish the technical foundation of an early-stage startup through software architecture, backend engineering, full-stack development, and technical implementation.',
    highlights: [
      'Software Architecture',
      'Backend Engineering',
      'Full-Stack Development',
      'Database Design',
    ],
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    company: 'Freelance / Self-Employed',
    type: 'Freelance',
    location: 'Cebu, Philippines',
    duration: 'Present',
    description:
      'Developing full-stack applications with a focus on backend engineering, database architecture, API development, application integration, and deployment.',
    highlights: [
      'Full-Stack Development',
      'Backend Development',
      'API Development',
      'Database Design',
      'Application Deployment',
    ],
  },
  {
    id: 3,
    title: 'Student Security Researcher',
    company: 'Independent Research',
    type: 'Research',
    location: 'Cebu, Philippines',
    duration: 'Present',
    description:
      'Conducting authorized security assessments and application security research, focusing on identifying vulnerabilities, evaluating security controls, and assessing the security of web applications, APIs, and network infrastructure.',
    highlights: [
      'Web Application Penetration Testing',
      'API Penetration Testing',
      'Network Penetration Testing',
      'Application Security Research',
      'Vulnerability Assessment & Analysis',
      'Open-Source Intelligence (OSINT)',
    ],
  },
]

export default function Experience() {
  const portfolioData = usePortfolioData()

  const rawExperiences = portfolioData?.experience
  const isValid =
    Array.isArray(rawExperiences) &&
    rawExperiences.length === 3 &&
    rawExperiences.every((item) => item?.company && item?.description)

  const experiences = isValid ? rawExperiences : EXPERIENCES_DATA

  const [activeStep, setActiveStep] = useState(0)
  const [visibleEntries, setVisibleEntries] = useState({ 0: true })
  const itemRefs = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisibleEntries({ 0: true, 1: true, 2: true })
      return
    }

    const observers = []
    itemRefs.current.forEach((el, index) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep((prev) => Math.max(prev, index))
            setVisibleEntries((prev) => ({ ...prev, [index]: true }))
          }
        },
        { rootMargin: '0px 0px -15% 0px', threshold: 0.2 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [experiences.length])

  const progressPct =
    experiences.length > 1
      ? Math.min(100, (activeStep / (experiences.length - 1)) * 100)
      : 100

  return (
    <section
      id="experience"
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: '#090514' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeader eyebrow="Career & Journey" title="Experience" />

        <div className="relative mt-16 max-w-4xl mx-auto">
          <div
            aria-hidden="true"
            className="absolute top-4 bottom-4 w-[1px] -translate-x-1/2 left-4 md:left-1/2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />

          <div
            aria-hidden="true"
            className="absolute top-4 w-[1px] -translate-x-1/2 left-4 md:left-1/2 transition-all duration-500 ease-out"
            style={{
              height: `calc(${progressPct}% - 8px)`,
              backgroundColor: '#7A33FF',
            }}
          />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((item, index) => {
              const isEven = index % 2 === 0
              const isActive = index <= activeStep
              const isVisible = visibleEntries[index] || false

              const companyAndType = [item.company, item.type]
                .filter(Boolean)
                .join(' · ')

              return (
                <div
                  key={item.id || index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="relative flex flex-col md:flex-row items-start md:items-center"
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 md:top-2 z-20">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                        isActive
                          ? 'border-[#a78bfa] bg-[#7A33FF]'
                          : 'border-white/20 bg-[#090514]'
                      }`}
                    />
                  </div>

                  <div
                    aria-hidden="true"
                    className={`hidden md:block absolute top-3.5 h-[1px] w-6 transition-all duration-300 ${
                      isEven
                        ? 'right-1/2 translate-x-0'
                        : 'left-1/2 translate-x-0'
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? '#7A33FF'
                        : 'rgba(255, 255, 255, 0.1)',
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="block md:hidden absolute left-4 top-3 h-[1px] w-5 transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? '#7A33FF'
                        : 'rgba(255, 255, 255, 0.1)',
                    }}
                  />

                  <div
                    className={`w-full pl-10 md:pl-0 md:w-1/2 transition-all duration-500 ease-out ${
                      isEven ? 'md:pr-10 md:text-left' : 'md:pl-10 md:ml-auto md:text-left'
                    } ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <h3
                      className="text-[17px] sm:text-[18px] font-medium leading-snug"
                      style={{ color: '#f4f4f5' }}
                    >
                      {item.title}
                    </h3>

                    {companyAndType && (
                      <p
                        className="text-[14px] font-normal mt-0.5"
                        style={{ color: '#a1a1aa' }}
                      >
                        {companyAndType}
                      </p>
                    )}

                    {(item.duration || item.location) && (
                      <div
                        className="text-[12px] sm:text-[13px] font-normal mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"
                        style={{ color: '#a1a1aa' }}
                      >
                        {item.duration && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} className="text-zinc-500" />
                            <span>{item.duration}</span>
                          </span>
                        )}
                        {item.duration && item.location && <span>·</span>}
                        {item.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-zinc-500" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {item.description && (
                      <p
                        className="text-[14px] font-normal leading-relaxed mt-3"
                        style={{ color: '#d4d4d8' }}
                      >
                        {item.description}
                      </p>
                    )}

                    {(() => {
                      const highlights = Array.isArray(item.highlights)
                        ? item.highlights.filter(
                            (tag) =>
                              typeof tag === 'string' &&
                              !tag.toLowerCase().includes('erd')
                          )
                        : []

                      return highlights.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {highlights.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono px-2 py-0.5 rounded border"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                borderColor: 'rgba(255, 255, 255, 0.08)',
                                color: '#d4d4d8',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null
                    })()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
