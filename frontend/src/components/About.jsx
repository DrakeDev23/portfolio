import { GraduationCap, Dumbbell, Code2, BookOpen, Gamepad2 } from 'lucide-react'
import SectionHeader from './SectionHeader'
import GlassCard from './GlassCard'
import GitHubContributions from './GitHubContributions'
import useScrollReveal from '../hooks/useScrollReveal'

const HOBBIES = [
  {
    icon: <Dumbbell size={22} strokeWidth={1.5} />,
    label: 'Boxing',
    desc: 'Discipline and focus the same principles I apply to debugging hard bugs.',
  },
  {
    icon: <Code2 size={22} strokeWidth={1.5} />,
    label: 'Solving Math',
    desc: 'Solving math problems is like debugging code it requires logic, pattern recognition, and persistence.',
  },
  {
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    label: 'Reading',
    desc: 'Security whitepapers, technical essays, and the occasional novel.',
  },
  {
    icon: <Gamepad2 size={22} strokeWidth={1.5} />,
    label: 'Gaming',
    desc: 'Gaming is my meditation. It clears my head and helps me approach problems with a fresh perspective.',
  },
]

const FOCUS_BARS = [
  { label: 'Full-Stack Development', pct: 70 },
  { label: 'Computer Networking', pct: 60 },
  { label: 'Cybersecurity', pct: 65 },
  { label: 'Backend Development', pct: 75 },
  { label: 'Frontend Development', pct: 80 },
]

const COURSES = [
  'BSIT student',
  '2nd year Student',
  'AWSSBG membership Officer @ CEC',
  'Psite Officer @ CEC',
]

export default function About() {
  const [sectionRef, isVisible] = useScrollReveal()

  return (
    <section id="about" className="py-28 relative" style={{ backgroundColor: '#090514' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(122,51,255,0.3), transparent)' }} />

      <div ref={sectionRef} className={`max-w-6xl mx-auto px-6 reveal ${isVisible ? 'reveal-visible' : ''}`}>
        <SectionHeader eyebrow="Who I Am" title="About Me" />

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
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

            <GlassCard>
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
            <p className="section-eyebrow mb-5">When I&apos;m Not Coding</p>
            <div className="grid grid-cols-2 gap-4">
              {HOBBIES.map(({ icon, label, desc }, i) => (
                <div key={label} className={`reveal-scale ${isVisible ? 'reveal-visible' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <GlassCard className="group hover:-translate-y-1 hover:border-[rgba(122,51,255,0.3)] transition-all duration-300 h-full">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(122,51,255,0.12)', color: '#9b6dff' }}>
                      {icon}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{label}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t" style={{ borderColor: 'rgba(122,51,255,0.15)' }}>
          <GitHubContributions />
        </div>
      </div>
    </section>
  )
}
