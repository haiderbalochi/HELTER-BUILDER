import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'
import { Shell } from '@/components/ui/Section'
import { scrollToId } from '@/hooks/useLenis'
import { usePrefersReducedMotion } from '@/hooks'
import { EASE_OUT_QUINT, VIEWPORT_ONCE } from '@/lib/motion'
import { SITE } from '@/lib/site'

const WORDS = ['LET’S', 'BUILD', 'SOMETHING', 'GREAT.']

export function FinalCTA() {
  const reduce = usePrefersReducedMotion()

  return (
    <section
      id="cta"
      aria-label="Start a project"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden border-t border-[var(--hairline)] pt-24 md:pt-32"
    >
      {/* single cool light source, top-left — not a green wash */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-[10%] -top-[10%] h-[80vh] w-[80vh] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(240,238,231,0.09), rgba(240,238,231,0.02) 52%, transparent 74%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(240,238,231,0.045) 0 1px, transparent 1px 88px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 50%, transparent 30%, rgba(4,4,5,0.9) 100%)',
          }}
        />
      </div>

      <Shell className="w-full py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.7 }}
          className="label mb-8 flex items-center gap-4 text-accent"
        >
          <span className="h-px w-10 bg-accent" aria-hidden="true" />
          Next step
        </motion.p>

        <h2
          aria-label={WORDS.join(' ')}
          className="display-x max-w-[14ch] text-[clamp(3rem,13vw,11.5rem)] leading-[0.84]"
        >
          {WORDS.map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${
                  i === WORDS.length - 1
                    ? 'text-accent'
                    : i % 2 === 1
                      ? 'outline-text'
                      : 'text-bone'
                }`}
                initial={reduce ? false : { y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 1, ease: EASE_OUT_QUINT, delay: i * 0.08 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="max-w-[46ch] text-[15.5px] leading-relaxed text-bone-mute lg:col-span-5 md:text-[17px]"
          >
            Have an idea, website, app or digital product in mind? Send the rough version — I will
            come back with how I would build it, what it would take, and what I would leave out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end"
          >
            <ButtonLink
              href="#contact"
              variant="primary"
              size="lg"
              icon="arrow-up-right"
              onClick={(event) => {
                event.preventDefault()
                scrollToId('contact')
              }}
            >
              Start a project
            </ButtonLink>

            <ButtonLink href={`mailto:${SITE.email}`} variant="ghost" size="lg" icon="mail">
              Email Haider
            </ButtonLink>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 border-t border-[var(--hairline)] pt-6 font-mono text-[11px] lowercase tracking-wide text-bone-faint"
        >
          {SITE.email} · {SITE.phoneDisplay}
        </motion.p>
      </Shell>

      {/* Curtain: hairlines that draw upward as the footer arrives */}
      <div aria-hidden="true" className="flex h-24 items-end gap-[3px] px-3 md:h-32 md:gap-[5px]">
        {Array.from({ length: 64 }).map((_, i) => (
          <motion.span
            key={i}
            className="block flex-1 origin-bottom bg-gradient-to-t from-accent/45 to-transparent"
            initial={{ scaleY: 0.15, opacity: 0.25 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.9,
              ease: EASE_OUT_QUINT,
              delay: reduce ? 0 : (i / 64) * 0.55,
            }}
            style={{ height: `${28 + ((i * 37) % 70)}%` }}
          />
        ))}
      </div>
    </section>
  )
}
