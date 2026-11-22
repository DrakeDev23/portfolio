import { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { usePortfolioData } from '../context/PortfolioContext'
import { PROJECTS_DATA } from '../constants/projectsData'
import { getProjectImage } from '../constants/projectImages'
import { getGroup, GROUP_ORDER } from '../constants/projectGroups'
import FilterTabs from './FilterTabs'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

const INITIAL_VISIBLE = 6
const LIKED_KEY = 'likedProjects'
const ALL = 'All'

const getLikedSet = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY)) || [])
  } catch {
    return new Set()
  }
}

const prioritizeProjects = (items) => {
  if (!Array.isArray(items)) return items
  const list = [...items]
  const idx = list.findIndex((p) => p.id === 'stupdt')
  if (idx > 0) {
    const [target] = list.splice(idx, 1)
    list.unshift(target)
  }
  return list
}

export default function ProjectsSection() {
  const prefetched = usePortfolioData()
  const initialProjects = prefetched?.projects?.length ? prioritizeProjects(prefetched.projects) : PROJECTS_DATA

  const [projects, setProjects] = useState(initialProjects)
  const [activeFilter, setActiveFilter] = useState(ALL)
  const [expanded, setExpanded] = useState(false)
  const [likedIds, setLikedIds] = useState(getLikedSet)
  const [modalIndex, setModalIndex] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

  useEffect(() => {
    if (prefetched?.projects?.length) {
      setProjects(prioritizeProjects(prefetched.projects))
      return
    }
    let cancelled = false
    fetch(`${apiUrl}/api/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setProjects(prioritizeProjects(data))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [prefetched?.projects, apiUrl])

  const tabs = useMemo(() => {
    const counts = {}
    for (const p of projects) {
      const g = getGroup(p.id)
      counts[g] = (counts[g] || 0) + 1
    }
    const groupTabs = GROUP_ORDER.filter((g) => counts[g] > 0).map((g) => ({
      key: g,
      label: g,
    }))
    return [{ key: ALL, label: ALL, count: projects.length }, ...groupTabs]
  }, [projects])

  const filtered = useMemo(() => {
    if (activeFilter === ALL) return projects
    return projects.filter((p) => getGroup(p.id) === activeFilter)
  }, [projects, activeFilter])

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE)
  const hasMore = filtered.length > INITIAL_VISIBLE

  const toggleRef = useRef(null)
  const toggleTopBefore = useRef(null)

  const handleToggle = useCallback(() => {
    if (expanded) toggleTopBefore.current = toggleRef.current?.getBoundingClientRect().top ?? null
    setExpanded((v) => !v)
  }, [expanded])

  useLayoutEffect(() => {
    if (expanded || toggleTopBefore.current == null || !toggleRef.current) return
    const shift = toggleRef.current.getBoundingClientRect().top - toggleTopBefore.current
    toggleTopBefore.current = null
    if (shift) window.scrollBy({ top: shift, behavior: 'instant' })
  }, [expanded])

  const handleFilter = useCallback((key) => {
    setActiveFilter(key)
    setExpanded(false)
  }, [])

  const handleLike = useCallback(
    async (projectId) => {
      if (likedIds.has(projectId)) return

      const nextLiked = new Set(likedIds)
      nextLiked.add(projectId)
      setLikedIds(nextLiked)
      localStorage.setItem(LIKED_KEY, JSON.stringify([...nextLiked]))

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, likes: Number(p.likes ?? 0) + 1 } : p
        )
      )

      try {
        const res = await fetch(`${apiUrl}/api/projects/${projectId}/like`, {
          method: 'PATCH',
        })
        if (!res.ok) throw new Error('Like request failed')
        const updated = await res.json()
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, likes: updated.likes } : p))
        )
      } catch {
        const rollback = new Set(nextLiked)
        rollback.delete(projectId)
        setLikedIds(rollback)
        localStorage.setItem(LIKED_KEY, JSON.stringify([...rollback]))
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, likes: Math.max(0, Number(p.likes ?? 1) - 1) } : p
          )
        )
      }
    },
    [likedIds, apiUrl]
  )

  const openModal = useCallback((idx) => setModalIndex(idx), [])
  const closeModal = useCallback(() => setModalIndex(null), [])
  const goPrev = useCallback(
    () => setModalIndex((i) => (i == null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  )
  const goNext = useCallback(
    () => setModalIndex((i) => (i == null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  )

  const modalProject = modalIndex != null ? filtered[modalIndex] : null

  return (
    <section id="projects" className="relative py-16 sm:py-28" style={{ backgroundColor: '#090514' }}>
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p
            className="text-xs font-medium uppercase"
            style={{ color: '#7A33FF', letterSpacing: '0.2em' }}
          >
            Selected work
          </p>
          <h2 className="mt-3 text-3xl font-medium text-gray-100 sm:text-4xl">
            Featured projects
          </h2>
        </div>

        <FilterTabs tabs={tabs} active={activeFilter} onChange={handleFilter} />

        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              image={getProjectImage(project.id)}
              isLiked={likedIds.has(project.id)}
              onOpen={() => openModal(i)}
              onLike={() => handleLike(project.id)}
            />
          ))}
        </motion.div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={expanded}
              onClick={handleToggle}
              className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-[#7A33FF]/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090514]"
            >
              {expanded ? 'Show less' : `Show all ${filtered.length} projects`}
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        project={modalProject}
        image={modalProject ? getProjectImage(modalProject.id) : null}
        isOpen={modalProject != null}
        onClose={closeModal}
        onPrev={goPrev}
        onNext={goNext}
        index={modalIndex ?? 0}
        total={filtered.length}
        isLiked={modalProject ? likedIds.has(modalProject.id) : false}
        onLike={() => modalProject && handleLike(modalProject.id)}
      />
    </section>
  )
}
