import { useState } from 'react'
import {
  GraduationCap,
  Code2,
  Shield,
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  Bug,
  Server,
  RotateCw,
} from 'lucide-react'
import SectionHeader from './SectionHeader'
import GlassCard from './GlassCard'
import GitHubContributions from './GitHubContributions'
import useScrollReveal from '../hooks/useScrollReveal'

const FOCUS_ITEMS = [
  {
    title: 'Web application security',
    icon: ShieldCheck,
    description:
      'Finding and analyzing vulnerabilities like injection, broken auth, and access control flaws in real applications.',
    tools: ['OWASP Top 10', 'Burp Suite', 'OWASP ZAP'],
  },
  {
    title: 'Penetration testing and remediation',
    icon: Bug,
    description:
      'Authorized, in-scope testing, then turning findings into practical fixes so systems end up more secure and reliable.',
    tools: ['Nmap', 'Metasploit', 'Burp Suite'],
  },
  {
    title: 'Backend development',
    icon: Server,
    description: 'Building APIs and services with security designed in from the start.',
    tools: ['FastAPI', 'Django', 'Laravel'],
  },
  {
    title: 'Hackathons and CTFs',
    icon: Trophy,
    description: [
      'Hackathons: Building fast under pressure, collaborating with teammates, and solving challenges against the clock.',
      'CTFs: Tackling cybersecurity challenges in web exploitation, cryptography, and forensics.',
    ],
    tools: ['Hackathons', 'CTFs', 'Teamwork'],
  },
]

const ACHIEVEMENTS = [
  {
    title: 'CHAMPION CTF @ CEC IT DAYS',
    event: 'Cebu Eastern College · Cybersecurity CTF',
    badge: 'Champion',
    type: 'gold',
  },
  {
    title: '1st Runner Up at Web Dev Design @ CEC',
    event: 'Cebu Eastern College · Web Development',
    badge: '1st Runner-Up',
    type: 'silver',
  },
  {
    title: 'Top 9 at HackForGov Regional CTF Competition',
    event: 'DICT Region 7 · Regional CTF Competition',
    badge: 'Top 9',
    type: 'purple',
  },
  {
    title: 'Hacktoberfest Champion Hackathon',
    event: 'Cebu Hacktoberfest · Open-Source Hackathon',
    badge: 'Champion',
    type: 'gold',
  },
  {
    title: 'IBPAP Hackathon Finalist',
    event: 'Developed an innovative solution with AI integration',
    badge: 'Finalist',
    type: 'purple',
  },
]

const FOCUS_BARS = [
  { label: 'Full-Stack Development', pct: 70 },
  { label: 'Computer Networking', pct: 65 },
  { label: 'Cybersecurity', pct: 79 },
  { label: 'Backend Development', pct: 80 },
  { label: 'Frontend Development', pct: 75 },
]

const COURSES = [
  'BSIT student',
  '2nd year Student',
  'AWSSBG membership Officer @ CEC',
]

function FlipCard({ title, icon: Icon, description, tools }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setFlipped((prev) => !prev)}
      aria-pressed={flipped}
      aria-label={`${title}, flip card`}
      className="group relative h-72 w-full text-left [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 rounded-2xl"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 motion-reduce:transition-none motion-reduce:transform-none [transform-style:preserve-3d] lg:group-hover:[transform:rotateY(180deg)] lg:group-hover:motion-reduce:transform-none ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-[#0d0a1f]/70 p-5 [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-300 ${
            flipped ? 'motion-reduce:opacity-0 motion-reduce:pointer-events-none' : 'motion-reduce:opacity-100'
          } lg:group-hover:motion-reduce:opacity-0`}
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
        >
          <div>
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'rgba(122,51,255,0.12)', color: '#9b6dff' }}
            >
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-medium text-white">{title}</h4>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <RotateCw size={12} className="shrink-0" />
            <span className="hidden lg:inline">Hover to flip</span>
            <span className="inline lg:hidden">Tap to flip</span>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-[#0d0a1f] p-5 shadow-[0_0_24px_rgba(168,85,247,0.15)] [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:transform-none motion-reduce:transition-opacity motion-reduce:duration-300 ${
            flipped ? 'motion-reduce:opacity-100' : 'motion-reduce:opacity-0 motion-reduce:pointer-events-none'
          } lg:group-hover:motion-reduce:opacity-100 lg:group-hover:motion-reduce:pointer-events-auto`}
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
        >
          <div>
            <h4 className="mb-2 text-sm font-medium text-purple-300">{title}</h4>
            {Array.isArray(description) ? (
              <div className="space-y-2 text-xs leading-relaxed text-white/75">
                {description.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed text-white/75">{description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-purple-200"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function About() {
  const [sectionRef, isVisible] = useScrollReveal()

  return (
    <section id="about" className="py-28 relative" style={{ backgroundColor: '#090514' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)' }} />

      <div ref={sectionRef} className={`max-w-6xl mx-auto px-6 reveal ${isVisible ? 'reveal-visible' : ''}`}>
        <SectionHeader eyebrow="Who I Am" title="About Me" />

        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="leading-relaxed text-white/70">
            I am a Full-stack Developer and Student Security Researcher focused on discovering and analyzing security vulnerabilities, conducting authorized penetration testing, and developing effective remediation strategies. With a strong interest in backend development, I focus on understanding application security at its core and building more secure, reliable systems.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { icon: <Trophy size={14} />, label: '5 Achievements' },
              { icon: <Code2 size={14} />, label: '31 technologies' },
              { icon: <Shield size={14} />, label: '12 Security tools' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(122,51,255,0.15)',
                  color: '#a78bfa',
                }}
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch mb-10">
          <div className="space-y-6 flex flex-col justify-between">
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(122,51,255,0.15)', color: '#9b6dff' }}>
                  <GraduationCap size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="section-eyebrow mb-1">Education</p>
                  <h3 className="text-white font-bold text-base mb-0.5">
                    Bachelor of Science in Information Technology
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Currently enrolled · Cebu Eastern College
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COURSES.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(122,51,255,0.08)', border: '1px solid rgba(122,51,255,0.18)', color: '#a78bfa' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex-1 flex flex-col justify-center">
              <p className="section-eyebrow mb-5">Focus Areas</p>
              <div className="space-y-4">
                {FOCUS_BARS.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300 font-medium">{label}</span>
                      <span className="text-xs font-mono" style={{ color: '#9b6dff' }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7A33FF, #c084fc)', boxShadow: '0 0 8px rgba(122,51,255,0.4)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(122,51,255,0.15)', color: '#9b6dff' }}
                    >
                      <Trophy size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="section-eyebrow mb-0.5">Recognition</p>
                      <h3 className="text-white font-bold text-base">Key Achievements</h3>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                    style={{
                      background: 'rgba(122,51,255,0.1)',
                      border: '1px solid rgba(122,51,255,0.25)',
                      color: '#c084fc',
                    }}
                  >
                    5 Honors
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ACHIEVEMENTS.map((item) => {
                    const isGold = item.type === 'gold'
                    const isSilver = item.type === 'silver'

                    const iconBg = isGold
                      ? 'rgba(234, 179, 8, 0.12)'
                      : isSilver
                      ? 'rgba(147, 197, 253, 0.12)'
                      : 'rgba(122, 51, 255, 0.15)'
                    const iconColor = isGold ? '#fbbf24' : isSilver ? '#93c5fd' : '#c084fc'
                    const badgeStyle = isGold
                      ? { background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.25)', color: '#fde047' }
                      : isSilver
                      ? { background: 'rgba(147, 197, 253, 0.1)', borderColor: 'rgba(147, 197, 253, 0.25)', color: '#93c5fd' }
                      : { background: 'rgba(122, 51, 255, 0.1)', borderColor: 'rgba(122, 51, 255, 0.25)', color: '#c084fc' }

                    const IconComponent = isGold ? Trophy : isSilver ? Medal : Award

                    return (
                      <div
                        key={item.title}
                        className="flex items-start sm:items-center justify-between gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.03] border border-transparent hover:border-purple-500/20"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                            style={{ background: iconBg, color: iconColor }}
                          >
                            <IconComponent size={16} strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white text-xs sm:text-sm font-semibold leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-gray-400 text-[11px] sm:text-xs">
                              {item.event}
                            </p>
                          </div>
                        </div>
                        <span
                          className="flex-shrink-0 text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-md border whitespace-nowrap self-start sm:self-center"
                          style={badgeStyle}
                        >
                          {item.badge}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mt-12">
          <p className="section-eyebrow mb-5">What I Focus On</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FOCUS_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`reveal-scale ${isVisible ? 'reveal-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <FlipCard {...item} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-10 border-t" style={{ borderColor: 'rgba(122,51,255,0.15)' }}>
          <GitHubContributions />
        </div>
      </div>
    </section>
  )
}
