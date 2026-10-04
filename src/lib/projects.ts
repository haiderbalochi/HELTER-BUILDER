export type ProjectStatus = 'live' | 'coming-soon'

export interface Project {
  id: string
  index: string
  name: string
  tagline: string
  description: string
  category: string
  role: string
  features: string[]
  status: ProjectStatus
  url: string
  image: string
  imageAlt: string
  accent: string
}

/**
 * Descriptions are written from the live sites' own metadata and the supplied
 * screenshots — nothing here is invented. Mahrooj is intentionally marked
 * "coming soon": its URL returns 404 and it is not launched.
 */
export const PROJECTS: Project[] = [
  {
    id: 'tarkplace',
    index: '01',
    name: 'TarkPlace',
    tagline: 'Premium AirBuds & wireless audio online store',
    description:
      'A full ecommerce storefront for wireless airbuds, earbuds, charging cases and audio gear. Product discovery, live bag state and a checkout path built around free shipping, 30-day returns and cash on delivery.',
    category: 'Ecommerce',
    role: 'Design & Development',
    features: [
      'Product catalogue with search, categories and account flows',
      'Live bag counter and configurable product selection',
      'Floating dock navigation with theme and language controls',
      'Free shipping · 30-day returns · cash on delivery messaging',
      'Light + mono (dark) theme with no-flash boot script',
      'Structured OnlineStore schema and per-route SEO metadata',
    ],
    status: 'live',
    url: 'https://www.tarkplace.store/',
    image: '/projects/tarkplace-1365.webp',
    imageAlt: 'TarkPlace online store homepage showing a premium AirBuds hero',
    accent: '#4F6BFF',
  },
  {
    id: 'leox',
    index: '02',
    name: 'LeoX',
    tagline: 'Cinematic creator & animator brand site',
    description:
      'An immersive personal brand experience for a Minecraft content creator and animator. Full-bleed cinematic hero with About, Work, Channels, Social and Contact built as one continuous scroll.',
    category: 'Brand / Portfolio',
    role: 'Design & Development',
    features: [
      'Full-screen cinematic hero with animated backdrop',
      'Single-page flow: About · Work · Channels · Social · Contact',
      'Atmospheric motion and depth-of-field layering',
      'Responsive across desktop, tablet and mobile',
    ],
    status: 'live',
    url: 'https://leox.vercel.app',
    image: '/projects/leox-1365.webp',
    imageAlt: 'LeoX portfolio hero with the name LeoX over a misty forest scene',
    accent: '#FF3B30',
  },
  {
    id: 'aut0max',
    index: '03',
    name: 'Aut0max',
    tagline: 'AI video-automation product site',
    description:
      'Product site for AUT0MAX, an AI video-automation tool that turns one link into a high-retention video, a custom AI thumbnail and automated metadata — built on the Electrobun desktop framework.',
    category: 'AI Product',
    role: 'Design & Development',
    features: [
      'Terminal-inspired dark interface with pixel display typography',
      'Engine · Access · Labs product navigation',
      'Portable download and free-trial entry points',
      'SoftwareApplication JSON-LD with feature list and versioning',
      'Live system-status pill and layered reveal typography',
    ],
    status: 'live',
    url: 'https://aut0max.web.app/',
    image: '/projects/aut0max-1365.webp',
    imageAlt: 'AUT0MAX landing page reading Zero Effort. Pure Results.',
    accent: '#E63946',
  },
  {
    id: 'mahrooj',
    index: '04',
    name: 'Mahrooj',
    tagline: 'Contemporary women’s fashion storefront',
    description:
      'An editorial fashion experience — “The Art of Being Her” — built around quiet luxury typography, a Shop / Collections / About / Contact structure and a refined dark art direction.',
    category: 'Fashion Ecommerce',
    role: 'Design & Development',
    features: [
      'Editorial letter-spaced wordmark hero',
      'Shop · Collections · About · Contact navigation',
      'Search, wishlist, dark-mode and bag actions',
      'Responsive, mobile-first layout',
    ],
    status: 'coming-soon',
    url: 'https://mahrooj.vercel.app/',
    image: '/projects/mahrooj-1365.webp',
    imageAlt: 'Mahrooj fashion homepage showing the wordmark MAHROOJ on black',
    accent: '#C9A227',
  },
]
