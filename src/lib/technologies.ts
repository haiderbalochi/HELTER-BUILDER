export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'App Development'
  | 'Database'
  | 'Tools'
  | 'AI'
  | 'Design'

export interface Technology {
  name: string
  category: TechCategory
  /** Short provenance note — how this entry was verified. Not rendered publicly. */
  evidence: string
}

/**
 * ⚠️ OWNER CONFIRMATION REQUIRED — see README § "Technology list".
 *
 * The brief asked for a technologies section but supplied no skills list, and
 * also required that nothing be invented. Every entry below is therefore
 * derived from verifiable evidence only:
 *
 *   • this repository's own stack          → React, TypeScript, Vite, Tailwind…
 *   • the supplied live project sites      → Electrobun, JSON-LD/SEO, Firebase
 *     Hosting, Vercel, Google Analytics, Next.js, React SPA architecture
 *   • capabilities demonstrated by those   → ecommerce, auth, cart state,
 *     responsive design, AI-assisted pipelines
 *
 * Edit this single file to match the owner's confirmed skill set.
 */
export const TECHNOLOGIES: Technology[] = [
  // ---- Frontend -----------------------------------------------------------
  { name: 'React', category: 'Frontend', evidence: 'This site + TarkPlace/LeoX SPA architecture' },
  { name: 'TypeScript', category: 'Frontend', evidence: 'This repository' },
  { name: 'JavaScript', category: 'Frontend', evidence: 'All four projects' },
  { name: 'HTML5', category: 'Frontend', evidence: 'All four projects' },
  { name: 'CSS3', category: 'Frontend', evidence: 'All four projects' },
  { name: 'Tailwind CSS', category: 'Frontend', evidence: 'This repository' },
  { name: 'Framer Motion', category: 'Frontend', evidence: 'This repository' },
  { name: 'Next.js', category: 'Frontend', evidence: 'Mahrooj screenshot (Next.js badge)' },
  { name: 'Responsive Design', category: 'Frontend', evidence: 'All four projects' },

  // ---- Backend ------------------------------------------------------------
  { name: 'Firebase', category: 'Backend', evidence: 'aut0max.web.app Firebase Hosting + supplied project' },
  { name: 'Firebase Auth', category: 'Backend', evidence: 'This repository /hideadmin' },
  { name: 'REST APIs', category: 'Backend', evidence: 'Store & product integrations' },
  { name: 'SEO & JSON-LD', category: 'Backend', evidence: 'Structured data in TarkPlace + Aut0max' },

  // ---- App development ----------------------------------------------------
  { name: 'Electrobun', category: 'App Development', evidence: 'Aut0max: "System Live: Electrobun 1.0.0"' },
  { name: 'Desktop Apps', category: 'App Development', evidence: 'Aut0max Windows portable build' },
  { name: 'Web Applications', category: 'App Development', evidence: 'TarkPlace, Aut0max, this site' },

  // ---- Database -----------------------------------------------------------
  { name: 'Cloud Firestore', category: 'Database', evidence: 'This repository /hideadmin review store' },
  { name: 'Firebase Storage', category: 'Database', evidence: 'Supplied Firebase project' },

  // ---- Tools --------------------------------------------------------------
  { name: 'Vite', category: 'Tools', evidence: 'This repository' },
  { name: 'Git', category: 'Tools', evidence: 'Standard deployment on Vercel/Firebase' },
  { name: 'Vercel', category: 'Tools', evidence: 'leox.vercel.app, mahrooj.vercel.app' },
  { name: 'Firebase Hosting', category: 'Tools', evidence: 'aut0max.web.app' },
  { name: 'Google Analytics', category: 'Tools', evidence: 'G-42R1LFDMLR on tarkplace.store' },

  // ---- AI -----------------------------------------------------------------
  { name: 'AI Integrations', category: 'AI', evidence: 'Aut0max AI video/thumbnail pipeline' },
  { name: 'AI Content Pipelines', category: 'AI', evidence: 'Aut0max auto-edit / auto-export flow' },
  { name: 'SEO Metadata Automation', category: 'AI', evidence: 'Aut0max feature list' },

  // ---- Design -------------------------------------------------------------
  { name: 'UI/UX Design', category: 'Design', evidence: 'Four distinct art directions shipped' },
  { name: 'Interaction Design', category: 'Design', evidence: 'Motion + hover systems across projects' },
  { name: 'Design Systems', category: 'Design', evidence: 'Consistent tokens per project' },
  { name: 'Typography Direction', category: 'Design', evidence: 'Bowlby One / Syne / pixel display usage' },
]

export const TECH_CATEGORIES: TechCategory[] = [
  'Frontend',
  'Backend',
  'App Development',
  'Database',
  'Tools',
  'AI',
  'Design',
]
