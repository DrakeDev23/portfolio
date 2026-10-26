import { createContext, useContext, useState, useRef, useCallback } from 'react'

export const PortfolioContext = createContext(null)

export function usePortfolioData() {
  return useContext(PortfolioContext)
}

export function PortfolioProvider({ portfolioData, children }) {
  const [activeEventIndex, setActiveEventIndex] = useState(0)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const closeEventModalRef = useRef(null)
  const centerCarouselRef = useRef(null)

  const closeEventModal = useCallback(() => {
    try {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    } catch (_) {}

    if (closeEventModalRef.current) {
      closeEventModalRef.current()
    }
    setIsEventModalOpen(false)
  }, [])

  const centerCarouselOnActive = useCallback(() => {
    if (centerCarouselRef.current) {
      centerCarouselRef.current()
    }
  }, [])

  const value = {
    ...portfolioData,
    data: portfolioData,
    activeEventIndex,
    setActiveEventIndex,
    isEventModalOpen,
    setIsEventModalOpen,
    closeEventModal,
    closeEventModalRef,
    centerCarouselRef,
    centerCarouselOnActive,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
