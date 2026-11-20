import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const SKILL_GROUPS = [
  { id: 'programming', title: 'Programming', items: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'C++', 'SQL', 'Bash'] },
  { id: 'frontend', title: 'Frontend', items: ['React', 'Vue.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'BootStrap'] },
  { id: 'Mobile', title: 'Mobile', items: ['React Native', 'Expo']},
  { id: 'backend', title: 'Backend', items: ['Django', 'Flask', 'FastAPI', 'Laravel', 'ASP.NET'] },
  { id: 'databases', title: 'Databases', items: ['PostgreSQL', 'MySQL', 'Supabase', 'Firebase', 'Sqlite', 'Redis'] },
  { id: 'devops', title: 'DevOps & Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'AWS'] },
  { id: 'security', title: 'Security Tools', items: ['John the Ripper', 'Nmap', 'Zenmap', 'Wireshark', 'Burp Suite', 'OWASP ZAP', 'GoBuster', 'Ffuf', 'Hydra', 'Metasploit'] },
]

const TABS = [{ id: 'all', title: 'All' }, ...SKILL_GROUPS]
const TOTAL = SKILL_GROUPS.reduce((sum, group) => sum + group.items.length, 0)

export default function SkillsModal({ isOpen, onClose }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)
  const [active, setActive] = useState('all')

  useEffect(() => {
    if (isOpen) setActive('all')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev === 'hidden' ? '' : prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement
    const raf = requestAnimationFrame(() => dialogRef.current?.querySelector('[data-autofocus]')?.focus())
    return () => {
      cancelAnimationFrame(raf)
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const groups = active === 'all' ? SKILL_GROUPS : SKILL_GROUPS.filter((group) => group.id === active)

  return createPortal(
    <div className="skills-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className="skills-modal" role="dialog" aria-modal="true" aria-labelledby="skills-modal-title">
        <div className="skills-modal-header">
          <div>
            <h2 id="skills-modal-title">All Skills &amp; Tools</h2>
            <p>{TOTAL} skills across {SKILL_GROUPS.length} categories</p>
          </div>
          <button type="button" className="skills-modal-close" onClick={onClose} aria-label="Close" data-autofocus>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="skills-modal-tabs" role="group" aria-label="Filter skills by category">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`skills-modal-tab${active === tab.id ? ' is-active' : ''}`}
              aria-pressed={active === tab.id}
              onClick={() => setActive(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="skills-modal-body">
          {groups.map((group) => (
            <section key={group.id} className="skills-modal-group" aria-labelledby={`skills-modal-${group.id}`}>
              <h3 id={`skills-modal-${group.id}`}>{group.title}</h3>
              <ul className="skills-modal-chips">
                {group.items.map((item) => (
                  <li key={item} className="security-tools-pill"><span aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
