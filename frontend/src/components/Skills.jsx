import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Terminal } from 'lucide-react'
import SkillsModal from './SkillsModal'
import {
  SiCplusplus, SiCss, SiDjango, SiDocker, SiFastapi, SiFigma, SiFirebase, SiFlask, SiGit, SiGithub,
  SiHtml5, SiJavascript, SiLaravel, SiMysql, SiPhp, SiPostgresql, SiPostman, SiPython, SiReact, SiRedis,
  SiSupabase, SiTailwindcss, SiTypescript, SiVuedotjs,
} from 'react-icons/si'

const ICONS = {
  Python: [SiPython, '#3776AB'], React: [SiReact, '#61DAFB'], Docker: [SiDocker, '#2496ED'],
  Git: [SiGit, '#F05032'], PostgreSQL: [SiPostgresql, '#4169E1'], Laravel: [SiLaravel, '#FF2D20'],
  JavaScript: [SiJavascript, '#F7DF1E'], TypeScript: [SiTypescript, '#3178C6'], Django: [SiDjango, '#44B78B'],
  Redis: [SiRedis, '#FF4438'], Figma: [SiFigma, '#F24E1E'], Vue: [SiVuedotjs, '#4FC08D'],
  PHP: [SiPhp, '#777BB4'], 'Tailwind CSS': [SiTailwindcss, '#06B6D4'], FastAPI: [SiFastapi, '#009688'],
  MySQL: [SiMysql, '#4479A1'], GitHub: [SiGithub, '#FFFFFF'], Flask: [SiFlask, '#FFFFFF'],
  'C++': [SiCplusplus, '#659AD2'], HTML5: [SiHtml5, '#E34F26'], CSS: [SiCss, '#1572B6'],
  Firebase: [SiFirebase, '#FFCA28'], Supabase: [SiSupabase, '#3FCF8E'], Postman: [SiPostman, '#FF6C37'],
}

const COLUMN_DATA = [
  ['Python', 'React', 'Docker', 'Git', 'PostgreSQL', 'Laravel'],
  ['JavaScript', 'TypeScript', 'Django', 'Redis', 'Figma', 'Vue'],
  ['PHP', 'Tailwind CSS', 'FastAPI', 'MySQL', 'GitHub', 'Flask'],
  ['C++', 'HTML5', 'CSS', 'Firebase', 'Supabase', 'Postman'],
]

const SECURITY_TOOLS = ["Nmap", "Zenmap", "Wireshark", "Burp Suite", "OWASP ZAP", "GoBuster", "FFUF", "SQLMap", "Metasploit", "Hydra", "John the Ripper"];

const UNIQUE_SECURITY_TOOLS = SECURITY_TOOLS.filter((tool, index, list) =>
  list.findIndex((other) => other.trim().toLowerCase() === tool.trim().toLowerCase()) === index)

const BASE_GAP = 14

function SecurityToolList({ hidden = false, listRef }) {
  return <ul ref={listRef} className="security-tools-copy" aria-hidden={hidden ? 'true' : undefined}>
    {UNIQUE_SECURITY_TOOLS.map((tool) => <li key={tool} className="security-tools-pill"><span aria-hidden="true" />{tool}</li>)}
  </ul>
}

function SecurityToolsCarousel() {
  const trackRef = useRef(null)
  const copyRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const copy = copyRef.current
    if (!track || !copy) return undefined
    const count = UNIQUE_SECURITY_TOOLS.length

    const fit = () => {
      const currentGap = parseFloat(getComputedStyle(copy).columnGap) || BASE_GAP
      const pillsWidth = copy.getBoundingClientRect().width - count * currentGap
      const screenWidth = window.innerWidth
      const gap = pillsWidth + count * BASE_GAP > screenWidth
        ? BASE_GAP
        : Math.ceil((screenWidth - pillsWidth) / count) + 1
      if (gap !== currentGap) track.style.setProperty('--security-gap', `${gap}px`)
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(copy)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  return <div className="security-tools" role="region" aria-labelledby="security-tools-label">
    <p id="security-tools-label" className="security-tools-label">SECURITY TOOLS</p>
    <div className="security-tools-row">
      <div ref={trackRef} className="security-tools-track">
        <SecurityToolList listRef={copyRef} />
        <SecurityToolList hidden />
      </div>
    </div>
  </div>
}

function LogoTile({ name, hidden = false }) {
  const [Icon, color] = ICONS[name] || [Terminal]
  return <span className="skills-logo-tile" role="img" aria-label={name} title={name} aria-hidden={hidden} style={color ? { color } : undefined}><Icon size={34} aria-hidden="true" /></span>
}

function LogoColumn({ items, index }) {
  const distance = `${items.length * 92}px`
  return <div className={`skills-logo-column skills-logo-column-${index + 1}`} style={{ '--skills-scroll-distance': distance }}>
    <div className="skills-logo-track">
      {items.map((name) => <LogoTile key={name} name={name} />)}
      {items.map((name) => <LogoTile key={`${name}-copy`} name={name} hidden />)}
    </div>
  </div>
}

export default function Skills() {
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <section id="skills" className="skills-showcase-section">
      <SecurityToolsCarousel />
      <div className="skills-showcase-shell">
        <div className="skills-showcase-copy">
          <span className="skills-showcase-pill"><i aria-hidden="true" />Tech Stack</span>
          <h2>Skills &amp; Tools</h2>
          <p>Languages, frameworks, databases and security tools I use to build and test real projects.</p>
          <button type="button" className="skills-showcase-button" aria-haspopup="dialog" onClick={() => setModalOpen(true)}>Explore all skills</button>
        </div>
        <div id="skills-panel" className="skills-logo-panel" aria-label="Technology skills">
          <div className="skills-logo-columns">
            {COLUMN_DATA.map((items, index) => <LogoColumn key={index} items={items} index={index} />)}
          </div>
        </div>
      </div>
      <SkillsModal isOpen={modalOpen} onClose={closeModal} />
    </section>
  )
}
