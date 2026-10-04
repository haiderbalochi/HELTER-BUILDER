import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Spinner } from '@/components/ui/Spinner'
import { useCopyToClipboard } from '@/hooks'
import { useToast } from '@/components/ui/Toast'
import {
  BUDGETS,
  PROJECT_TYPES,
  buildWhatsAppUrl,
  openContactEmail,
} from '@/lib/contact'
import { SITE } from '@/lib/site'
import { VIEWPORT_ONCE, fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface FormState {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
}

const EMPTY: FormState = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please tell me your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = 'Please enter a valid email address.'
  if (!form.projectType) errors.projectType = 'Pick the closest project type.'
  if (form.message.trim().length < 12)
    errors.message = 'A sentence or two about the project, please.'
  return errors
}

const WHATSAPP_MESSAGE = `Hi Haider — I'd like to discuss a project.`

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  const toast = useToast()

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      toast.push('Please complete the highlighted fields.', 'error')
      return
    }

    setSending(true)
    // Opens a NEW tab with the Gmail compose window fully pre-filled.
    // Nothing is sent silently — the visitor always reviews before sending.
    const via = openContactEmail(form)
    toast.push(
      via === 'gmail'
        ? 'Gmail compose opened in a new tab — review it and hit send.'
        : 'Your mail app was opened with the message pre-filled.',
      'success',
    )
    window.setTimeout(() => {
      setSending(false)
      setForm(EMPTY)
    }, 700)
  }

  const onCopyNumber = async () => {
    const ok = await copy(SITE.phoneDisplay)
    if (ok) toast.push(`Copied ${SITE.phoneDisplay} to clipboard.`, 'success')
    else toast.push('Could not copy — please copy it manually.', 'error')
  }

  return (
    <Section id="contact" ruled rhythm="loose">
      <Shell className="space-y-12 md:space-y-16">
        <SectionHeading
          index="07"
          eyebrow="Contact"
          title="HAVE A PROJECT IN MIND?"
          lede="Websites, web apps, mobile apps, ecommerce, UI/UX and custom development — tell me what you are building and I will tell you how I would approach it."
          accentLastWord
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* -------------------------------------------------- channels */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="space-y-8 lg:col-span-5"
          >
            <p className="text-[1.15rem] leading-[1.55] text-bone md:text-[1.35rem]">
              Send a brief, a half-formed idea, or a link to something you want rebuilt. I reply
              personally — no account managers, no ticket queues.
            </p>

            <ul className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group flex items-center gap-4 py-5 transition-colors duration-300"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--hairline)] text-bone-mute transition-all duration-500 group-hover:border-accent/50 group-hover:text-accent">
                    <Icon name="mail" size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block">Email</span>
                    <span className="mt-1 block truncate text-sm text-bone transition-colors duration-300 group-hover:text-accent">
                      {SITE.email}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={16}
                    className="shrink-0 text-bone-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </a>
              </li>

              <li>
                <a
                  href={`tel:${SITE.phoneIntl}`}
                  className="group flex items-center gap-4 py-5 transition-colors duration-300"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--hairline)] text-bone-mute transition-all duration-500 group-hover:border-accent/50 group-hover:text-accent">
                    <Icon name="phone" size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block">Phone</span>
                    <span className="mt-1 block font-mono text-sm tabular text-bone transition-colors duration-300 group-hover:text-accent">
                      {SITE.phoneDisplay}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={16}
                    className="shrink-0 text-bone-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </a>
              </li>

              <li className="flex items-center gap-4 py-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--hairline)] text-bone-mute">
                  <Icon name="blocks" size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label block">Based in</span>
                  <span className="mt-1 block text-sm text-bone">{SITE.location}</span>
                </span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
                variant="primary"
                size="lg"
                icon="whatsapp"
              >
                Chat on WhatsApp
              </ButtonLink>

              <Button
                variant="ghost"
                size="lg"
                icon={copied ? 'check' : 'copy'}
                onClick={() => void onCopyNumber()}
                aria-live="polite"
              >
                {copied ? 'Number copied' : 'Copy number'}
              </Button>
            </div>

            <p className="label text-bone-faint">
              {copied
                ? `${SITE.phoneDisplay} copied to your clipboard`
                : 'No social media — just email and WhatsApp'}
            </p>
          </motion.div>

          {/* ----------------------------------------------------- form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7"
          >
            <form onSubmit={onSubmit} noValidate className="border-t-2 border-bone/80 pt-7 md:pt-9">
              <div className="mb-8 flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5">
                <div>
                  <p className="label mb-2 text-accent/80">Project request</p>
                  <h3 className="display text-2xl text-bone md:text-3xl">Tell me about it</h3>
                </div>
                <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider2 text-bone-faint sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Opens Gmail
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  id="contact-name"
                  label="Name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => set('name', v)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
                <TextField
                  id="contact-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => set('email', v)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
                <SelectField
                  id="contact-type"
                  label="Project type"
                  value={form.projectType}
                  error={errors.projectType}
                  onChange={(v) => set('projectType', v)}
                  options={[...PROJECT_TYPES]}
                  placeholder="Select a type"
                  required
                />
                <SelectField
                  id="contact-budget"
                  label="Budget"
                  value={form.budget}
                  error={errors.budget}
                  onChange={(v) => set('budget', v)}
                  options={[...BUDGETS]}
                  placeholder="Optional"
                />
              </div>

              <div className="mt-6 space-y-2">
                <label htmlFor="contact-message" className="label block text-bone-mute">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(event) => set('message', event.target.value)}
                  placeholder="What are you building, who is it for, and when do you need it?"
                  aria-invalid={Boolean(errors.message)}
                  className={cn('field resize-none', errors.message && 'field-error')}
                />
                {errors.message && (
                  <p className="text-[12px] text-[#ff6b57]">{errors.message}</p>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={sending ? undefined : 'send'}
                  disabled={sending}
                >
                  {sending ? (
                    <span className="flex items-center gap-2.5">
                      <Spinner size={14} /> Opening…
                    </span>
                  ) : (
                    'Send project request'
                  )}
                </Button>
                <p className="label max-w-[16rem] text-bone-faint">
                  Opens a pre-filled compose window — you review before sending.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </Shell>
    </Section>
  )
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="label block text-bone-mute">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={cn('field', error && 'field-error')}
      />
      {error && <p className="text-[12px] text-[#ff6b57]">{error}</p>}
    </div>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  options: string[]
  placeholder: string
  required?: boolean
}

function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
  required,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="label block text-bone-mute">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn('field appearance-none pr-8', error && 'field-error', !value && 'text-bone-faint')}
        >
          <option value="" className="bg-ink-850">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-ink-850 text-bone">
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={15}
          className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-bone-faint"
        />
      </div>
      {error && <p className="text-[12px] text-[#ff6b57]">{error}</p>}
    </div>
  )
}
