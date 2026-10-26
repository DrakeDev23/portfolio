import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './styles/animations.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LinuxBootLoader from './components/LinuxBootLoader'
import { PortfolioContext, PortfolioProvider } from './context/PortfolioContext'

const SESSION_KEY = 'portfolio_initialized'

function Portfolio() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#090514' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
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
  const [portfolioData, setPortfolioData] = useState(null)

  const handleBootComplete = (data) => {
    sessionStorage.setItem(SESSION_KEY, 'true')
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
