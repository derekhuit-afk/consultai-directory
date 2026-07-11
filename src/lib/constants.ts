export const SITE_NAME = 'ConsultAI'
export const SITE_DESCRIPTION = 'Find verified AI automation consultants. Filter by tools, industry, location, and availability.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://consultai.io'

export const CATEGORIES = [
  { slug: 'workflow-automation', name: 'Workflow Automation', icon: '⚡' },
  { slug: 'ai-integration', name: 'AI Integration', icon: '🤖' },
  { slug: 'data-analytics', name: 'Data & Analytics', icon: '📊' },
  { slug: 'ai-copywriting', name: 'AI Copywriting & Content', icon: '✍️' },
  { slug: 'ai-strategy', name: 'AI Strategy & Audits', icon: '🗺️' },
]

export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming'
]

export const PRICE_TIERS = ['$', '$$', '$$$', '$$$$']
export const AVAILABILITY_OPTIONS = ['accepting-clients', 'waitlist', 'unavailable']
export const SERVICE_DELIVERY_OPTIONS = ['remote-only', 'hybrid', 'on-site']

export const PRO_PRICE_MONTHLY = 79
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || ''
