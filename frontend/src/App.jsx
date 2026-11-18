import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './styles/animations.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LoadingScreen from './components/LoadingScreen'
import { PortfolioProvider } from './context/PortfolioContext'
import { portfolioApi } from './api/portfolioApi'
import { FALLBACK_PORTFOLIO_DATA } from './constants/fallbackData'

const SESSION_KEY = 'portfolio_initialized_v5'
const DATA_KEY = 'portfolio_data_v5'
const BOOTSTRAP_TIMEOUT_MS = 10000

async function fetchPortfolioData() {
  try {
    const d = await portfolioApi.bootstrap({ signal: AbortSignal.timeout(BOOTSTRAP_TIMEOUT_MS) })
    return {
      profile: d.profile,
      projects: d.projects,
      skills: d.skills,
      events: d.events,
      experience: d.experience,
      certifications: d.certifications,
      health: { status: d.status, database: d.database },
    }
  } catch {
    return { ...FALLBACK_PORTFOLIO_DATA }
  }
}

function Portfolio() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#090514' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Events />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default function App() {
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true',
  )
  const [portfolioData, setPortfolioData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(DATA_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [introDone, setIntroDone] = useState(() => booted && portfolioData != null)
  const fetchStartedRef = useRef(false)

  const handleServerReady = useCallback(() => {
    if (fetchStartedRef.current) return
    fetchStartedRef.current = true
    fetchPortfolioData().then((data) => {
      sessionStorage.setItem(SESSION_KEY, 'true')
      try {
        sessionStorage.setItem(DATA_KEY, JSON.stringify(data))
      } catch {}
      setPortfolioData(data)
      setBooted(true)
    })
  }, [])

  const showPortfolio = introDone && booted && portfolioData

  return (
    <PortfolioProvider portfolioData={portfolioData}>
      <AnimatePresence mode="wait">
        {!introDone ? (
          <LoadingScreen
            key="boot"
            apiUrl={import.meta.env.VITE_API_URL}
            onReady={handleServerReady}
            onDone={() => setIntroDone(true)}
          />
        ) : !showPortfolio ? (
          <div key="waiting" className="fixed inset-0 bg-black" />
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Portfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </PortfolioProvider>
  )
}
