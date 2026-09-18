import { useState, useEffect, useRef } from 'react'
import { Download, ArrowRight, Shield, Code2, ChevronDown } from 'lucide-react'
import avatarImg from '../assets/images/avatar.jpeg'

const ROLES = [
  'Full-Stack Developer',
  'backend Focused',
  'Aspiring Cybersecurity Professional',
  'CTF Player',
  'Co-Founder'
];

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const [roleIdx, setRoleIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const current = ROLES[roleIdx]

    const tick = () => {
      if (!isDeleting) {
        const next = current.slice(0, displayText.length + 1)
        setDisplayText(next)
        if (next === current) {
          timerRef.current = setTimeout(() => setIsDeleting(true), 2000)
          return
        }
        timerRef.current = setTimeout(tick, 80)
      } else {
        const next = current.slice(0, displayText.length - 1)
        setDisplayText(next)
        if (next === '') {
          setIsDeleting(false)
          setRoleIdx((i) => (i + 1) % ROLES.length)
          return
        }
        timerRef.current = setTimeout(tick, 45)
      }
    }

    timerRef.current = setTimeout(tick, 120)
    return () => clearTimeout(timerRef.current)
  }, [displayText, isDeleting, roleIdx])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-x-hidden"
      style={{ backgroundColor: '#090514' }}
    >
      <div className="absolute inset-0 z-0 flex justify-end">
        <img
          src={avatarImg}
          alt=""
          className="h-full w-full md:w-1/2 object-cover opacity-15 md:opacity-[0.18] brightness-50 animate-load-fade"
          style={{ objectPosition: 'center 80%', animationDelay: '0.2s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090514] via-[#090514] md:via-[#090514]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-transparent to-[#090514]/40" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: '10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(122,51,255,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            bottom: '10%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(180,51,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%237A33FF' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pb-16 flex items-center relative z-10 w-full">
        <div className="space-y-6 sm:space-y-8 max-w-2xl relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium animate-load-fade-up"
            style={{
              background: 'rgba(122, 51, 255, 0.1)',
              border: '1px solid rgba(122, 51, 255, 0.25)',
              color: '#9b6dff',
              animationDelay: '0.1s',
            }}
          >
            <span
              className="w-2 h-2 rounded-full bg-green-400 shrink-0"
              style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)' }}
            />
            Open to opportunities
          </div>

          <div>
            <p
              className="text-gray-400 text-base sm:text-lg mb-2 font-light animate-load-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              Hello, I&apos;m
            </p>
            <h1
              className="font-black leading-none mb-3 sm:mb-4 animate-load-fade-up"
              style={{
                fontSize: 'clamp(2.5rem, 12vw, 5.5rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #7A33FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animationDelay: '0.25s',
              }}
            >
              Drake
            </h1>

            <div
              className="flex flex-wrap items-center gap-0 min-h-9 animate-load-fade-up"
              style={{ animationDelay: '0.35s' }}
            >
              <span
                className="text-lg sm:text-xl md:text-2xl font-semibold break-words"
                style={{ color: '#9b6dff' }}
              >
                {displayText}
              </span>
              <span
                className="cursor-blink text-lg sm:text-xl md:text-2xl font-light ml-0.5"
                style={{ color: '#7A33FF' }}
              >
                |
              </span>
            </div>
          </div>

          <p
            className="text-gray-400 leading-relaxed max-w-md text-sm sm:text-base animate-load-fade-up"
            style={{ animationDelay: '0.45s' }}
          >
            BSIT student and Full-Stack Developer specializing in backend development and cybersecurity. I build secure, scalable web applications with clean user experiences, robust backend systems, and a security first mindset developed through Capture The Flag (CTF).
          </p>

          <div
            className="flex flex-wrap gap-3 sm:gap-4 animate-load-fade-up"
            style={{ animationDelay: '0.55s' }}
          >
            {[
              { icon: <Code2 size={14} />, label: '31 technologies' },
              { icon: <Shield size={14} />, label: '12 Security tools' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(122,51,255,0.15)',
                  color: '#a78bfa',
                }}
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-load-fade-up"
            style={{ animationDelay: '0.65s' }}
          >
            <a href="/images/Manguilimotan.pdf" download className="btn-primary justify-center w-full sm:w-auto">
              <Download size={16} />
              Download CV
            </a>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline justify-center w-full sm:w-auto"
            >
              Get in Touch
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors animate-load-fade"
        style={{ animationDelay: '1.2s' }}
        aria-label="Scroll to About section"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  )
}