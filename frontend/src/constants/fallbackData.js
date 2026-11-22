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
    id: 1,
    title: 'Founding Software Engineer',
    company: 'Pterano',
    type: 'Startup',
    location: 'Cebu, Philippines',
    duration: 'Jun 21, 2026 – Present',
    description:
      'Helping establish the technical foundation of an early-stage startup through software architecture, backend engineering, full-stack development, and technical implementation.',
    highlights: [
      'Software Architecture',
      'Backend Engineering',
      'Full-Stack Development',
      'Database Design',
    ],
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    company: 'Freelance / Self-Employed',
    type: 'Freelance',
    location: 'Cebu, Philippines',
    duration: 'Present',
    description:
      'Developing full-stack applications with a focus on backend engineering, database architecture, API development, application integration, and deployment.',
    highlights: [
      'Full-Stack Development',
      'Backend Development',
      'API Development',
      'Database Design',
      'Application Deployment',
    ],
  },
  {
    id: 3,
    title: 'Student Security Researcher',
    company: 'Independent Research',
    type: 'Research',
    location: 'Cebu, Philippines',
    duration: 'Present',
    description:
      'Conducting authorized security assessments and application security research, focusing on identifying vulnerabilities, evaluating security controls, and assessing the security of web applications, APIs, and network infrastructure.',
    highlights: [
      'Web Application Penetration Testing',
      'API Penetration Testing',
      'Network Penetration Testing',
      'Application Security Research',
      'Vulnerability Assessment & Analysis',
      'Open-Source Intelligence (OSINT)',
    ],
  },
]

export const FALLBACK_CERTIFICATIONS = [
  {
    id: 'cyber-data-defense',
    name: 'Cybersecurity: Turning Data into Defense',
    issuer: 'Security Analytics & Threat Defense',
    type: 'Certificate',
    status: 'completed',
  },
  {
    id: 'beyond-the-firewall',
    name: 'Beyond the Firewall',
    issuer: 'RivanIT Cebu · Network Defense',
    type: 'Security Workshop',
    status: 'completed',
  },
  {
    id: 'intro-cyber',
    name: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    type: 'Course Certificate',
    status: 'completed',
  },
  {
    id: 'fcc-python',
    name: 'Python Developer Certification',
    issuer: 'freeCodeCamp',
    type: 'Course Certificate',
    status: 'completed',
  },
  {
    id: 'apex-appsec',
    name: 'APEX (AppSec Professionals EXchange)',
    issuer: 'Application Security Conference & Community',
    type: 'AppSec Summit',
    status: 'completed',
  },
  {
    id: 'into-cloud-aws',
    name: 'Into the Cloud: About AWS',
    issuer: 'Cloud Computing & AWS Architecture',
    type: 'Cloud Training',
    status: 'completed',
  },
  {
    id: 'ai-career',
    name: 'Exploring Career Paths in the AI Space',
    issuer: 'Artificial Intelligence & Career Summit',
    type: 'AI Seminar',
    status: 'completed',
  },
  {
    id: 'stupdt',
    name: 'MALFUNCTION Hackathon',
    issuer: 'MALFUNCTION Hackathon',
    type: 'Certificate of Participation',
    status: 'completed',
  },
]

export const FALLBACK_PORTFOLIO_DATA = {
  profile: FALLBACK_PROFILE,
  projects: PROJECTS_DATA,
  events: EVENTS_DATA,
  experience: FALLBACK_EXPERIENCE,
  certifications: FALLBACK_CERTIFICATIONS,
}
