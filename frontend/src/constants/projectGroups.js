export const GROUP_ORDER = ['School projects', 'Hackathons / Competition', 'Personal', 'Org projects']

export const PROJECT_GROUPS = {
  realestate: 'School projects',
  bai: 'School projects',
  hulma: 'School projects',
  hapsay: 'School projects',
  airsiloy: 'Hackathons / Competition',
  agentica: 'Hackathons / Competition',
  publika: 'Hackathons / Competition',
  me: 'Personal',
  beauty: 'Personal',
  trustpulse: 'Personal',
  shopscout: 'Personal',
  museo: 'Personal',
  smp: 'Personal',
  worthout: 'Personal',
  'awscc-flurry': 'Org projects',
}

export const getGroup = (id) => PROJECT_GROUPS[id] ?? null
