export interface ProcessStep {
  index: string
  title: string
  summary: string
  detail: string
}

export const PROCESS: ProcessStep[] = [
  {
    index: '01',
    title: 'Discuss',
    summary: 'Understand the idea, goals and requirements.',
    detail:
      'We talk through what you are building, who it is for, what success looks like and what is genuinely non-negotiable. Ambiguity gets caught here, not in week three.',
  },
  {
    index: '02',
    title: 'Plan',
    summary: 'Define structure, experience and technical direction.',
    detail:
      'Sitemap, user flow, data model and the technical approach get decided up front — so the build has a spine instead of growing by accident.',
  },
  {
    index: '03',
    title: 'Design',
    summary: 'Create the interface and visual system.',
    detail:
      'Typography, spacing, colour, hierarchy and motion are designed as one system. Layouts are reviewed at real content sizes, not placeholder lorem ipsum.',
  },
  {
    index: '04',
    title: 'Build',
    summary: 'Develop the frontend, backend and required functionality.',
    detail:
      'Interfaces, state, APIs, databases and authentication are built as clean, reusable modules — reviewed for performance and maintainability as they land.',
  },
  {
    index: '05',
    title: 'Test',
    summary: 'Check responsiveness, interactions and functionality.',
    detail:
      'Every breakpoint, every interaction, every form and edge case. Reduced-motion, keyboard access and load times are checked before anything ships.',
  },
  {
    index: '06',
    title: 'Launch',
    summary: 'Deploy the finished product.',
    detail:
      'Domain, hosting, analytics, SEO metadata and monitoring go live together — followed by a handover so you can actually run the thing.',
  },
]
