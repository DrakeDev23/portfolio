import { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader'
import useScrollReveal from '../hooks/useScrollReveal'
import { usePortfolioData } from '../context/PortfolioContext'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const icons = (...pairs) => pairs.map(([name, label]) => ({ name, label }))

const FALLBACK = {
  categories: [
    {
      title: 'Languages', type: 'icons', items: icons(
        ['python', 'Python'], ['cpp', 'C++'], ['c', 'C'], ['cs', 'C#'], ['java', 'Java'],
        ['js', 'JavaScript'], ['ts', 'TypeScript'], ['php', 'PHP'], ['bash', 'Bash'],
      ),
    },
    {
      title: 'Frontend', type: 'icons', items: icons(
        ['html', 'HTML'], ['css', 'CSS'], ['react', 'React'], ['vue', 'Vue.js'],
        ['tailwind', 'Tailwind CSS'], ['bootstrap', 'Bootstrap'],
      ),
    },
    {
      title: 'Mobile', type: 'badges', items: [
        { name: 'react-native', label: 'React Native', color: '#20232A', text_color: '#61DAFB' },
        { name: 'expo', label: 'Expo', color: '#000020', text_color: '#FFFFFF' },
      ],
    },
    {
      title: 'Backend', type: 'icons', items: icons(
        ['fastapi', 'FastAPI'], ['django', 'Django'], ['flask', 'Flask'],
        ['laravel', 'Laravel'], ['dotnet', '.NET'],
      ),
    },
    {
      title: 'Databases', type: 'icons', items: icons(
        ['mysql', 'MySQL'], ['postgres', 'PostgreSQL'], ['sqlite', 'SQLite'],
        ['firebase', 'Firebase'], ['redis', 'Redis'], ['supabase', 'Supabase'],
      ),
    },
    { title: 'Infra and cloud', type: 'icons', items: icons(['docker', 'Docker'], ['aws', 'AWS']) },
    { title: 'Dev tools', type: 'icons', items: icons(['git', 'Git'], ['github', 'GitHub'], ['postman', 'Postman'], ['figma', 'Figma']) },
    {
      title: 'Operating systems', type: 'icons', items: icons(
        ['ubuntu', 'Ubuntu'], ['arch', 'Arch Linux'], ['kali', 'Kali Linux'],
      ),
    },
  ],
  security_tools: [
    { name: 'NMAP', color: '#004B87' },
    { name: 'ZENMAP', color: '#004B87' },
    { name: 'BURP SUITE', color: '#FF6633' },
    { name: 'OWASP ZAP', color: '#00549E' },
    { name: 'WIRESHARK', color: '#1679A7' },
    { name: 'HYDRA', color: '#000000' },
    { name: 'GOBUSTER', color: '#003B6F' },
    { name: 'FFUF', color: '#00457E' },
    { name: 'JOHN THE RIPPER', color: '#8B0000' },
    { name: 'METASPLOIT', color: '#2C2C2C' },
    { name: 'SQLMAP', color: '#CC0000' },
  ],
}

const LIGHT_TILE = new Set(['github', 'flask', 'bash', 'laravel'])

const HEX_RE = /^#[0-9A-Fa-f]{6}$/
const ICON_RE = /^[a-z0-9]+$/
const safeColor = (value, fallback) => (HEX_RE.test(value ?? '') ? value : fallback)

function isValidSkills(data) {
  return (
    Array.isArray(data?.categories) &&
    Array.isArray(data?.security_tools) &&
    data.categories.every(
      (c) =>
        typeof c.title === 'string' &&
        (c.type === 'icons' || c.type === 'badges') &&
        Array.isArray(c.items) &&
        c.items.every((item) => typeof item?.name === 'string'),
    ) &&
    data.security_tools.every((t) => typeof t?.name === 'string' && typeof t?.color === 'string')
  )
}

const ROW =
  'grid grid-cols-1 items-center gap-3 border-b border-purple-500/15 py-3 last:border-b-0 sm:grid-cols-[150px_1fr]'
const ROW_LABEL = 'text-left text-sm font-medium text-white'
const TILE = 'flex h-9 w-9 items-center justify-center rounded-lg border'
const BADGE =
  'inline-flex h-6 items-center rounded border border-white/10 px-2.5 text-[11px] font-medium uppercase tracking-wider'

function IconTile({ name, label }) {
  if (!ICON_RE.test(name)) return null
  const light = LIGHT_TILE.has(name)
  const title = label ?? name

  return (
    <div
      role="img"
      title={title}
      aria-label={title}
      className={`${TILE} transition-transform duration-200 hover:scale-110 hover:ring-2 hover:ring-purple-500/60 ${
        light ? 'border-white/20 bg-white/90' : 'border-white/10 bg-white/5'
      }`}
    >
      <img
        src={`https://skillicons.dev/icons?i=${name}${light ? '&theme=light' : ''}`}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        loading="lazy"
        decoding="async"
        className="h-6 w-6"
      />
    </div>
  )
}

function Badge({ text, color, textColor }) {
  return (
    <span
      className={BADGE}
      style={{
        backgroundColor: safeColor(color, '#2C2C2C'),
        color: safeColor(textColor, '#FFFFFF'),
      }}
    >
      {text}
    </span>
  )
}

function Row({ title, children }) {
  return (
    <div className={ROW}>
      <h3 className={ROW_LABEL}>{title}</h3>
      {children}
    </div>
  )
}

function SkeletonRows() {
  const badgeWidth = (text) => ({ width: `${text.length * 0.5 + 1.5}rem` })
  return (
    <div aria-hidden="true">
      {FALLBACK.categories.map(({ title, type, items }) => (
        <Row key={title} title={<span className="block h-4 w-24 animate-pulse rounded bg-white/10" />}>
          <div className={`flex flex-wrap ${type === 'badges' ? 'gap-1.5' : 'gap-2'}`}>
            {items.map((item) =>
              type === 'badges' ? (
                <div key={item.name} className="h-6 animate-pulse rounded bg-white/10" style={badgeWidth(item.label)} />
              ) : (
                <div key={item.name} className={`${TILE} animate-pulse border-white/10 bg-white/5`} />
              ),
            )}
          </div>
        </Row>
      ))}
      <Row title={<span className="block h-4 w-24 animate-pulse rounded bg-white/10" />}>
        <div className="flex flex-wrap gap-1.5">
          {FALLBACK.security_tools.map(({ name }) => (
            <div key={name} className="h-6 animate-pulse rounded bg-white/10" style={badgeWidth(name)} />
          ))}
        </div>
      </Row>
    </div>
  )
}

export default function Skills() {
  const prefetched = usePortfolioData()?.skills
  const hasPrefetched = isValidSkills(prefetched)

  const [skills, setSkills] = useState(hasPrefetched ? prefetched : null)
  const [status, setStatus] = useState(hasPrefetched ? 'ready' : 'loading')
  const [sectionRef, isVisible] = useScrollReveal()

  useEffect(() => {
    if (hasPrefetched) {
      setSkills(prefetched)
      setStatus('ready')
      return
    }

    const controller = new AbortController()

    fetch(`${API_URL}/api/skills`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GET /api/skills failed (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (!isValidSkills(data)) throw new Error('Unexpected /api/skills response shape')
        setSkills(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Skills fetch error:', err)
        setSkills(FALLBACK)
        setStatus('error')
      })

    return () => controller.abort()
  }, [hasPrefetched, prefetched])

  const techCount = skills?.categories.reduce((sum, c) => sum + c.items.length, 0) ?? 0
  const toolCount = skills?.security_tools.length ?? 0

  return (
    <section
      id="skills"
      className="py-20 relative"
      style={{ backgroundColor: '#090514' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)' }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(122,51,255,0.08) 0%, transparent 70%)' }}
      />

      <div
        ref={sectionRef}
        className={`mx-auto max-w-6xl px-6 relative z-10 reveal ${isVisible ? 'reveal-visible' : ''}`}
      >
        <SectionHeader eyebrow="Tech Stack" title="Skills & Tools" />

        {status === 'error' && (
          <p className="mb-3 text-center text-xs text-white/40" role="status">
            Couldn&apos;t load live data. Showing a saved copy.
          </p>
        )}

        <div className="mx-auto max-w-4xl rounded-2xl border border-purple-500/20 bg-[#0d0a1f]/70 px-5 md:px-6">
          {status === 'loading' ? (
            <SkeletonRows />
          ) : (
            <>
              {skills.categories.map(({ title, type, items }) => (
                <Row key={title} title={title}>
                  {type === 'badges' ? (
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(({ name, label, color, text_color }) => (
                        <Badge key={name} text={label ?? name} color={color} textColor={text_color} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {items.map(({ name, label }) => (
                        <IconTile key={name} name={name} label={label} />
                      ))}
                    </div>
                  )}
                </Row>
              ))}

              <Row title="Cybersecurity">
                <div className="flex flex-wrap gap-1.5">
                  {skills.security_tools.map(({ name, color }) => (
                    <Badge key={name} text={name} color={color} />
                  ))}
                </div>
              </Row>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/40" aria-hidden={status === 'loading'}>
          {status === 'loading' ? '\u00a0' : `${techCount} technologies · ${toolCount} security tools`}
        </p>
      </div>
    </section>
  )
}
