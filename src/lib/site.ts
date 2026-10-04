export const SITE = {
  name: 'Haider Baloch',
  brand: 'Haider Baloch',
  role: 'Web & App Developer',
  location: 'Lahore, Pakistan',
  email: 'haider.dev.leads@gmail.com',
  /** Displayed exactly as supplied by the owner. */
  phoneDisplay: '03257944372',
  /** E.164 international format used for tel: / wa.me links. */
  phoneIntl: '+923257944372',
  /** wa.me accepts digits only. NOTE: this is the number supplied by the owner. */
  whatsappNumber: '923257944372',
  copyright: '© 2026 Haider Baloch',
  title: 'Haider Baloch — Web & App Developer',
  description:
    'Haider Baloch is a web and app developer based in Lahore, Pakistan, building modern websites, applications, ecommerce experiences and custom digital products.',
  experience: '3–4+',
  experienceLabel: 'Years of hands-on development',
} as const

export const NAV = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'expertise', label: 'Expertise', index: '02' },
  { id: 'stack', label: 'Stack', index: '03' },
  { id: 'work', label: 'Work', index: '04' },
  { id: 'process', label: 'Process', index: '05' },
  { id: 'reviews', label: 'Reviews', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
] as const

export const ROLES = [
  'Web Developer',
  'App Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'UI/UX Designer',
  'AI-Powered Web Developer',
  'Digital Product Builder',
] as const

export const HERO_STATS = [
  { value: '3–4+', label: 'Years Experience' },
  { value: '4', label: 'Selected Projects', numeric: true },
  { value: '6', label: 'Service Disciplines', numeric: true },
] as const

export const MARQUEE_BANDS = {
  top: ['Web Development', 'App Development', 'UI/UX Design', 'Full-Stack', 'Ecommerce', 'AI Experiences'],
  mid: ['Lahore · Pakistan', 'Available for new projects', 'Idea → Prototype → Launch'],
} as const
