import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Magnetic } from '@/components/ui/Magnetic'
import { useActiveSection, usePrefersReducedMotion, useScrollY } from '@/hooks'
import { scrollToId } from '@/hooks/useLenis'
import { NAV, SITE } from '@/lib/site'
import { EASE_OUT_EXPO, EASE_OUT_QUINT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const SECTION_IDS = NAV.map((item) => item.id)

/** Supplied identity mark — sourced from `ic.png` (black field keyed to alpha). */
const LOGO_MARK = '/brand/haider-baloch-mark.png'

export function Navbar() {
  const scrollY = useScrollY()
  const active = useActiveSection(SECTION_IDS)
  const reduce = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const solid = scrollY > 40

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 340 : 0)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-all duration-500 ease-out-expo',
          solid ? 'glass-strong hairline-b' : 'bg-transparent',
        )}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          {/* Identity */}
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault()
              setOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group relative flex items-center gap-3 sm:gap-4"
            aria-label={`${SITE.name} — back to top`}
          >
            <motion.span
              className="relative flex shrink-0 items-center justify-center"
              initial={reduce ? false : { opacity: 0, x: -14, scale: 0.9, filter: 'blur(7px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: reduce ? 0.15 : 2.02 }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[170%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(240,238,231,0.16),rgba(240,238,231,0)_72%)] opacity-0 blur-[6px] transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
              />
              <img
                src={LOGO_MARK}
                alt=""
                width={162}
                height={176}
                decoding="async"
                draggable={false}
                className="relative h-10 w-auto select-none transition-[transform,filter] duration-500 ease-out-expo group-hover:scale-[1.06] group-hover:brightness-[1.12] sm:h-11 lg:h-12"
              />
            </motion.span>

            <motion.span
              className="hidden items-center sm:flex"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: EASE_OUT_EXPO,
                delay: reduce ? 0.24 : 2.16,
              }}
            >
              <span className="-mr-[0.3em] font-display text-[12px] font-bold uppercase leading-none tracking-[0.3em] text-bone lg:text-[13px]">
                Haider
              </span>
              <span
                aria-hidden="true"
                className="mx-2 h-[3px] w-[3px] shrink-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-[1.9]"
              />
              <span className="font-display text-[12px] font-bold uppercase leading-none tracking-[0.3em] text-bone-faint transition-colors duration-300 group-hover:text-bone lg:text-[13px]">
                Baloch
              </span>
            </motion.span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group relative px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider2 transition-colors duration-300',
                    isActive ? 'text-accent' : 'text-bone-mute hover:text-bone',
                  )}
                >
                  <span className="tabular mr-1.5 text-[9px] text-bone-faint">{item.index}</span>
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-out-expo',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              href="#contact"
              variant="primary"
              size="md"
              icon="arrow-up-right"
              onClick={(event) => {
                event.preventDefault()
                go('contact')
              }}
              className="hidden sm:inline-flex"
            >
              Start a project
            </ButtonLink>

            <Magnetic strength={0.22}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="grid h-11 w-11 place-items-center border border-[var(--hairline-strong)] text-bone transition-colors duration-300 hover:border-accent/60 hover:text-accent lg:hidden"
              >
                <Icon name={open ? 'close' : 'menu'} size={18} />
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-[65] flex flex-col bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="h-[var(--nav-h)] shrink-0" />

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-8"
            >
              {NAV.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_QUINT, delay: 0.06 + i * 0.05 }}
                  className="group flex items-baseline justify-between border-b border-[var(--hairline)] py-4 text-left"
                >
                  <span className="display text-[clamp(2rem,10vw,3.2rem)] text-bone transition-colors duration-300 group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="label tabular text-bone-faint">{item.index}</span>
                </motion.button>
              ))}
            </nav>

            <div className="space-y-4 border-t border-[var(--hairline)] px-6 py-6">
              <ButtonLink
                href="#contact"
                variant="primary"
                size="lg"
                icon="arrow-up-right"
                className="w-full"
                onClick={(event) => {
                  event.preventDefault()
                  go('contact')
                }}
              >
                Start a project
              </ButtonLink>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-mono text-[11px] text-bone-mute underline decoration-dotted underline-offset-4 hover:text-accent"
                >
                  {SITE.email}
                </a>
                <span className="label">{SITE.location}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
