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
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2 group justify-self-start"
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

        <nav className="hidden md:flex items-center gap-7 lg:gap-9" role="navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              aria-current={activeSection === link ? 'page' : undefined}
              className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${activeSection === link
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <div
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm"
            style={{
              background: 'rgba(122, 51, 255, 0.1)',
              border: '1px solid rgba(122, 51, 255, 0.25)',
              color: '#9b6dff',
            }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-green-400"
              style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)' }}
            />
            <span className="sm:hidden">Open</span>
            <span className="hidden sm:inline">Open to opportunities</span>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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
          </nav>
        </div>
      )}
    </header>
  )
}
