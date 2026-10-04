import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { RoleRotator } from '@/components/hero/RoleRotator'
import { ButtonLink } from '@/components/ui/Button'
import { HeroCanvas } from '@/components/layout/HeroCanvas'
import { scrollToId } from '@/hooks/useLenis'
import { usePrefersReducedMotion } from '@/hooks'
import { EASE_OUT_EXPO, EASE_OUT_QUINT } from '@/lib/motion'
import { HERO_STATS, SITE } from '@/lib/site'
import { clamp } from '@/lib/utils'

/**
 * The identity plate.
 *
 * Composition, top to bottom — a magazine cover rather than a hero section:
 *
 *   meta rail ─ hairline
 *        kicker   WEB & APP DEVELOPER
 *        name     HAIDER            (solid, widest axis)
 *                 BALOCH.           (outlined, indented — reads as a lockup)
 *   hairline
 *        editorial pull-line + body copy        role / location
 *   hairline
 *        stats                                  scroll cue
 *
 * There is deliberately no "thing on the right". The type *is* the visual.
 * Depth comes from two layers drifting at different rates on scroll and a
 * ±10px pointer response, both of which stop for reduced-motion visitors.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  /* ---------------------------------------------- pointer parallax state */
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const px = useSpring(pointerX, { stiffness: 60, damping: 22, mass: 0.6 })
  const py = useSpring(pointerY, { stiffness: 60, damping: 22, mass: 0.6 })

  const lineOneX = useTransform(px, [-1, 1], [-14, 14])
  const lineTwoX = useTransform(px, [-1, 1], [18, -18])
  const lightX = useTransform(px, [-1, 1], [-60, 60])
  const lightY = useTransform(py, [-1, 1], [-40, 40])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reduce) return

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      pointerX.set(clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1))
      pointerY.set(clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1))
    }
    const onLeave = () => {
      pointerX.set(0)
      pointerY.set(0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [pointerX, pointerY, reduce])

  /* -------------------------------------------------- scroll depth */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const scrollY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 })
  const nameOneY = useTransform(scrollY, [0, 1], [0, -70])
  const nameTwoY = useTransform(scrollY, [0, 1], [0, -140])
  const copyY = useTransform(scrollY, [0, 1], [0, -36])
  const fade = useTransform(scrollY, [0, 0.75], [1, 0])

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ----------------------------------------------------- atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={reduce ? undefined : { x: lightX, y: lightY }}
          className="key-light absolute left-[16%] top-[6%] h-[72vh] w-[72vh]"
        />
        <HeroCanvas className="h-full w-full opacity-[0.42]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(96% 68% at 50% 40%, transparent 24%, rgba(4,4,5,0.74) 100%)',
          }}
        />
      </div>

      <div className="shell relative flex min-h-[100svh] flex-col pt-[var(--nav-h)]">
        {/* --------------------------------------------------- meta rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.1 }}
          className="hairline-b flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3"
        >
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-soft" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="label text-bone-mute">Available for new projects</span>
          </span>
          <span className="label hidden md:inline">Independent · Freelance · Contract</span>
          <span className="label tabular">Portfolio — 2026</span>
        </motion.div>

        {/* -------------------------------------------- the composition */}
        <div className="flex flex-1 flex-col justify-center py-5 md:py-6">
          {/* kicker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: reduce ? 0 : 0.15 }}
            className="mb-4 flex items-center gap-4 md:mb-5 md:gap-6"
          >
            <span className="h-px w-8 bg-accent md:w-14" aria-hidden="true" />
            <p className="font-display text-[clamp(0.72rem,1.35vw,1.05rem)] font-extrabold uppercase tracking-[0.34em] text-bone md:tracking-[0.42em]">
              Web &amp; App Developer
            </p>
            <span className="hidden h-px flex-1 bg-[var(--hairline)] sm:block" aria-hidden="true" />
          </motion.div>

          {/* name lockup */}
          <h1 className="display-x relative text-[clamp(3rem,13.8vw,13.5rem)] text-bone">
            <motion.span
              className="block will-change-transform"
              style={reduce ? undefined : { y: nameOneY }}
            >
              <span className="block overflow-hidden pb-[0.02em]">
                <motion.span
                  className="block will-change-transform"
                  style={reduce ? undefined : { x: lineOneX }}
                  initial={reduce ? false : { y: '104%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, ease: EASE_OUT_QUINT, delay: reduce ? 0 : 0.22 }}
                >
                  Haider
                </motion.span>
              </span>
            </motion.span>
            <motion.span
              className="block will-change-transform"
              style={reduce ? undefined : { y: nameTwoY }}
            >
              <span className="block overflow-hidden pb-[0.05em] pl-[5%] sm:pl-[9%] lg:pl-[13%]">
                <motion.span
                  className="block outline-text will-change-transform"
                  style={reduce ? undefined : { x: lineTwoX }}
                  initial={reduce ? false : { y: '104%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, ease: EASE_OUT_QUINT, delay: reduce ? 0 : 0.36 }}
                >
                  Baloch
                  <span className="text-accent [-webkit-text-stroke:0]" aria-hidden="true">
                    .
                  </span>
                </motion.span>
              </span>
            </motion.span>
          </h1>

          {/* copy rail */}
          <motion.div
            style={reduce ? undefined : { y: copyY, opacity: fade }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: reduce ? 0 : 0.62 }}
            className="hairline-t mt-5 grid gap-6 pt-4 md:mt-7 md:pt-5 lg:grid-cols-12 lg:gap-10"
          >
            <div className="lg:col-span-7">
              <p className="serif-accent text-[clamp(1.1rem,1.9vw,1.6rem)] leading-[1.28] text-bone">
                From a first conversation to something finished, working and worth
                putting your name on.
              </p>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-bone-mute md:text-base">
                I design and build modern websites, applications and ecommerce
                experiences — taking digital ideas from a blank page to a product
                people can actually use.
              </p>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end lg:text-right">
              <div className="flex flex-col gap-3 lg:items-end">
                <RoleRotator />
                <p className="label">
                  Based in <span className="text-bone-mute">{SITE.location}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <ButtonLink
                  href="#work"
                  variant="primary"
                  size="lg"
                  icon="arrow-down"
                  onClick={go('work')}
                >
                  View my work
                </ButtonLink>
                <ButtonLink
                  href="#contact"
                  variant="ghost"
                  size="lg"
                  icon="arrow-up-right"
                  onClick={go('contact')}
                >
                  Start a project
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </div>

        {/* -------------------------------------------------- bottom rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 1 }}
          className="hairline-t flex flex-wrap items-end justify-between gap-x-8 gap-y-5 py-4"
        >
          <ul className="flex flex-wrap items-end gap-x-10 gap-y-4">
            {HERO_STATS.map((stat) => (
              <li key={stat.label} className="min-w-[7rem]">
                <p className="font-display text-[1.7rem] font-extrabold leading-none tracking-tighter2 text-bone tabular md:text-[2.1rem]">
                  {stat.value}
                </p>
                <p className="label mt-2">{stat.label}</p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => scrollToId('about')}
            className="group flex items-center gap-3"
            aria-label="Scroll to the About section"
          >
            <span className="label transition-colors duration-300 group-hover:text-accent">
              Scroll
            </span>
            <span className="relative block h-8 w-px overflow-hidden bg-[var(--hairline-strong)]">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block h-3 bg-accent"
                animate={reduce ? undefined : { y: ['-100%', '300%'] }}
                transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
              />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
