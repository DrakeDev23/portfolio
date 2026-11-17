import { PROJECTS_DATA } from './projectsData'
import { EVENTS_DATA } from './eventsData'

export const FALLBACK_PROFILE = {
  name: 'Drake',
  hostname: 'DRAKE@ARCH',
  title: 'Cybersecurity Student & Full-Stack Developer',
  location: 'Cebu, Philippines',
  education: 'Bachelor of Science in Information Technology',
  roles: [
    'aspiring Cybersecurity professional',
    'Programmer',
    'CTF Player',
    'Full-Stack Developer',
    'Co-Founder',
  ],
  bio: 'BSIT student building secure, performant software. I bridge clean frontend experiences with hardened backend systems and break things professionally in CTFs.',
}

export const FALLBACK_EXPERIENCE = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    organization: 'Personal & Academic Projects',
    level: 75,
  },
  {
    id: 'pentest',
    title: 'Penetration Testing',
    organization: 'CTF & Security Labs',
    level: 65,
  },
  {
    id: 'backend',
    title: 'Backend Development',
    organization: 'FastAPI & PostgreSQL',
    level: 70,
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    organization: 'React & Modern UI',
    level: 80,
  },
]

export const FALLBACK_CERTIFICATIONS = [
  {
    id: 'bsit',
    name: 'BSIT — Information Technology',
    issuer: 'Currently Enrolled',
    status: 'in_progress',
  },
  {
    id: 'ctf',
    name: 'CTF Competitions',
    issuer: 'Various Events',
    status: 'active',
  },
  {
    id: 'security-labs',
    name: 'Network Security & Pentest Labs',
    issuer: 'Academic & Self-Directed',
    status: 'active',
  },
]

export const FALLBACK_PORTFOLIO_DATA = {
  profile: FALLBACK_PROFILE,
  projects: PROJECTS_DATA,
  events: EVENTS_DATA,
  experience: FALLBACK_EXPERIENCE,
  certifications: FALLBACK_CERTIFICATIONS,
}
