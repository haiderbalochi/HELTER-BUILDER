import { SITE } from './site'

export interface ContactFormData {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
}

export const PROJECT_TYPES = [
  'Website',
  'Web App',
  'Mobile App',
  'Ecommerce Store',
  'UI/UX Design',
  'Custom Development',
  'Other',
] as const

export const BUDGETS = [
  'Not sure yet',
  'Under $500',
  '$500 – $1,500',
  '$1,500 – $5,000',
  '$5,000+',
] as const

function encode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+')
}

export function buildSubject(): string {
  return 'New Project Inquiry — Haider Baloch'
}

export function buildBody(data: ContactFormData): string {
  const lines = [
    `Hi Haider,`,
    ``,
    `I'd like to discuss a project.`,
    ``,
    `Name: ${data.name.trim() || '—'}`,
    `Email: ${data.email.trim() || '—'}`,
    `Project type: ${data.projectType || '—'}`,
    `Budget: ${data.budget?.trim() ? data.budget : 'Not specified'}`,
    ``,
    `Project details:`,
    data.message.trim() || '—',
    ``,
    `—`,
    `Sent from haiderbaloch portfolio`,
  ]
  return lines.join('\r\n')
}

/** Gmail web compose — opens in a brand new tab, never replaces the portfolio. */
export function buildGmailComposeUrl(data: ContactFormData): string {
  const params = [
    'view=cm',
    'fs=1',
    'tf=1',
    `to=${encode(SITE.email)}`,
    `su=${encode(buildSubject())}`,
    `body=${encode(buildBody(data))}`,
  ].join('&')
  return `https://mail.google.com/mail/?${params}`
}

/** Universal fallback that hands the same payload to the OS mail client. */
export function buildMailtoUrl(data: ContactFormData): string {
  return `mailto:${SITE.email}?subject=${encode(buildSubject())}&body=${encode(buildBody(data))}`
}

/**
 * Opens Gmail compose in a brand-new tab.
 *
 * NOTE: `noopener` must NOT be passed inside the windowFeatures string — Chrome
 * then returns `null` for the new window, which would look like a blocked
 * popup and trigger the fallback even though the tab opened fine. We null out
 * `opener` manually instead.
 */
export function openComposeWindow(data: ContactFormData): boolean {
  try {
    const tab = window.open(buildGmailComposeUrl(data), '_blank', 'width=980,height=760')
    if (tab) {
      try {
        tab.opener = null
      } catch {
        /* cross-origin hardening — safe to ignore */
      }
      return true
    }
  } catch {
    /* fall through to the mailto hand-off */
  }
  return false
}

/**
 * Opens the pre-filled message. Returns which client was used so the UI can
 * tell the truth about what happened. Never navigates the portfolio away.
 */
export function openContactEmail(data: ContactFormData): 'gmail' | 'mailto' {
  if (openComposeWindow(data)) return 'gmail'
  window.open(buildMailtoUrl(data), '_blank')
  return 'mailto'
}

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function buildTelUrl(): string {
  return `tel:${SITE.phoneIntl}`
}

export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement('textarea')
    area.value = value
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}
