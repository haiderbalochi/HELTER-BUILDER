export interface Service {
  id: string
  index: string
  title: string
  description: string
  deliverables: string[]
  icon: 'web' | 'app' | 'uiux' | 'fullstack' | 'ai' | 'custom'
}

export const SERVICES: Service[] = [
  {
    id: 'web-development',
    index: '01',
    title: 'Web Development',
    description:
      'Modern responsive websites, business sites, portfolios, landing pages, ecommerce stores and custom web applications — engineered to stay fast, accessible and easy to maintain.',
    deliverables: ['Landing pages', 'Business websites', 'Ecommerce stores', 'Web applications'],
    icon: 'web',
  },
  {
    id: 'app-development',
    index: '02',
    title: 'App Development',
    description:
      'Modern application experiences with polished interfaces and genuinely useful functionality — from first prototype through to a shippable product.',
    deliverables: ['Application UI', 'State & data flows', 'Cross-device builds', 'Release polish'],
    icon: 'app',
  },
  {
    id: 'ui-ux-design',
    index: '03',
    title: 'UI/UX Design',
    description:
      'Clean, modern interfaces built on strong visual hierarchy — typography, spacing, rhythm and interaction designed so the product feels obvious to use.',
    deliverables: ['Interface design', 'Design systems', 'Interaction design', 'Prototypes'],
    icon: 'uiux',
  },
  {
    id: 'full-stack',
    index: '04',
    title: 'Full-Stack Development',
    description:
      'Frontend, backend, databases, authentication, APIs and complete product development — one person owning the whole path from screen to storage.',
    deliverables: ['Frontend builds', 'APIs & services', 'Auth & roles', 'Data modelling'],
    icon: 'fullstack',
  },
  {
    id: 'ai-experiences',
    index: '05',
    title: 'AI-Powered Web Experiences',
    description:
      'Modern web experiences with AI integrations and intelligent features where they genuinely improve the product — not AI bolted on for the sake of it.',
    deliverables: ['AI feature integration', 'Intelligent workflows', 'Content automation', 'Smart interfaces'],
    icon: 'ai',
  },
  {
    id: 'custom-development',
    index: '06',
    title: 'Custom Development',
    description:
      'Turn a custom idea or a pile of project requirements into a complete, working digital product — scoped, structured, built and launched.',
    deliverables: ['Discovery & scoping', 'Technical direction', 'Build & integration', 'Launch support'],
    icon: 'custom',
  },
]
