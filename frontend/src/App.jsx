import { useState } from 'react'
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
import LinuxBootLoader from './components/LinuxBootLoader'
import { PortfolioContext, PortfolioProvider } from './context/PortfolioContext'

const SESSION_KEY = 'portfolio_initialized_v5'
const DATA_KEY = 'portfolio_data_v5'

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

  const handleBootComplete = (data) => {
    sessionStorage.setItem(SESSION_KEY, 'true')
    try {
      sessionStorage.setItem(DATA_KEY, JSON.stringify(data))
    } catch {}
    setPortfolioData(data)
    setBooted(true)
  }

  return (
    <PortfolioProvider portfolioData={portfolioData}>
      <AnimatePresence mode="wait">
        {!booted ? (
          <LinuxBootLoader key="boot" onComplete={handleBootComplete} />
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
