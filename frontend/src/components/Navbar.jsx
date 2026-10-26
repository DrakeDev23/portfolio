import { useState, useEffect } from 'react'
import { Menu, X, Terminal } from 'lucide-react'
import { NAV_LINKS } from '../constants/data'
import { usePortfolioData } from '../context/PortfolioContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  const { isEventModalOpen, closeEventModal, centerCarouselOnActive } = usePortfolioData() || {}

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48)

      for (const link of [...NAV_LINKS].reverse()) {
        const el = document.getElementById(link.toLowerCase())
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveSection(link)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    if (isEventModalOpen && closeEventModal) {
      closeEventModal()
    }

    const targetId = id.toLowerCase()
    const el = document.getElementById(targetId)

    setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: 'smooth' })

      if (targetId === 'events' && centerCarouselOnActive) {
        centerCarouselOnActive()
      }
    }, 20)

    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-load-slide-down ${scrolled
        ? 'bg-[#090514]/90 backdrop-blur-xl border-b border-[rgba(122,51,255,0.15)]'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2 group"
          aria-label="Scroll to top"
        >
          <div className="w-8 h-8 rounded-lg bg-[rgba(122,51,255,0.15)] border border-[rgba(122,51,255,0.3)] flex items-center justify-center group-hover:bg-[rgba(122,51,255,0.25)] transition-colors">
            <Terminal size={14} color="#9b6dff" />
          </div>
          <span
            className="text-lg font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #9b6dff, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Drake
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === link
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
            >
              {activeSection === link && (
                <span
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'rgba(122, 51, 255, 0.12)',
                    border: '1px solid rgba(122, 51, 255, 0.25)',
                  }}
                />
              )}
              <span className="relative z-10">{link}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollTo('contact')}
          className="hidden md:flex btn-primary text-xs py-2 px-4"
        >
          Hire me
        </button>

        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t absolute top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto"
          style={{
            background: 'rgba(9, 5, 20, 0.97)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(122, 51, 255, 0.15)',
          }}
        >
          <nav className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeSection === link
                  ? 'text-white bg-[rgba(122,51,255,0.12)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary mt-2 justify-center text-sm"
            >
              Hire me
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
