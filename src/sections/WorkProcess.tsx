import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROCESS } from '@/lib/process'
import { VIEWPORT_ONCE, fadeUp } from '@/lib/motion'
import { scrollToId } from '@/hooks/useLenis'
import { cn } from '@/lib/utils'

export function WorkProcess() {
  const listRef = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 75%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.5 })

  useEffect(() => {
    const list = listRef.current
    if (!list || typeof IntersectionObserver === 'undefined') return

    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-step]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number((entry.target as HTMLElement).dataset.step)
          if (!Number.isNaN(index)) setActive(index)
        })
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    )
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [])

  return (
    <Section id="process" ruled rhythm="loose">
      <Shell className="space-y-12 md:space-y-20">
        <SectionHeading
          index="05"
          eyebrow="Process"
          title="FROM IDEA TO LAUNCH"
          lede="A predictable six-step path. No mystery, no surprises — you always know what happens next."
          accentLastWord
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------------------------ sticky rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="border-t-2 border-bone/80 pb-8 pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="label text-accent/80">Current phase</p>
                  <p className="label tabular text-bone-faint">
                    {PROCESS[active].index} / {PROCESS[PROCESS.length - 1].index}
                  </p>
                </div>

                <p
                  className="mt-6 font-display text-[clamp(4.5rem,12vw,9rem)] font-extrabold leading-[0.78] tracking-tighter2 text-transparent tabular"
                  style={{ WebkitTextStroke: '1.5px rgba(240,238,231,0.55)' }}
                >
                  {PROCESS[active].index}
                </p>

                <p className="mt-4 font-display text-[clamp(1.35rem,2.6vw,2rem)] font-extrabold uppercase leading-none tracking-tighter2 text-bone">
                  {PROCESS[active].title}
                </p>

                <p className="mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-bone-mute">
                  {PROCESS[active].summary}
                </p>
              </div>

              <nav aria-label="Process steps" className="mt-2 border-b border-[var(--hairline)]">
                <ol className="flex flex-col">
                  {PROCESS.map((step, i) => (
                    <li key={step.index} className="border-t border-[var(--hairline)]">
                      <button
                        type="button"
                        onClick={() => scrollToId(`step-${step.index}`, -110)}
                        aria-current={active === i ? 'step' : undefined}
                        className={cn(
                          'group flex w-full items-center gap-3 py-3 text-left transition-colors duration-300',
                          active === i
                            ? 'text-bone'
                            : 'text-bone-faint hover:text-bone-mute',
                        )}
                      >
                        <span
                          className={cn(
                            'h-px transition-all duration-500 ease-out-expo',
                            active === i ? 'w-8 bg-accent' : 'w-3 bg-current',
                          )}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-[10px] tabular">{step.index}</span>
                        <span className="font-mono text-[11px] uppercase tracking-wider2">
                          {step.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="mt-6 hidden items-center gap-3 lg:flex">
                <span className="label text-bone-faint">Scroll to advance</span>
                <span className="h-px flex-1 bg-[var(--hairline)]">
                  <motion.span
                    className="block h-px origin-left bg-accent"
                    style={{ scaleX: scaleY }}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------- step list */}
          <ol ref={listRef} className="relative lg:col-span-7 lg:col-start-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 hidden h-full w-px bg-[var(--hairline)] sm:block"
            >
              <motion.span
                className="block w-px origin-top bg-accent"
                style={{ scaleY, height: '100%' }}
              />
            </span>

            <div className="sm:pl-8">
              {PROCESS.map((step, i) => (
                <motion.li
                  key={step.index}
                  id={`step-${step.index}`}
                  data-step={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                  className={cn(
                    'group relative scroll-mt-32 border-t border-[var(--hairline)] py-8 last:border-b md:py-11',
                    'transition-colors duration-500',
                    active === i ? 'bg-white/[0.014]' : '',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-8 top-11 hidden h-px transition-all duration-500 sm:block',
                      active === i ? 'w-6 bg-accent' : 'w-3 bg-[var(--hairline-strong)]',
                    )}
                  />

                  <div className="flex items-start gap-5 md:gap-8">
                    <span
                      className={cn(
                        'font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-none tracking-tighter2 transition-colors duration-500',
                        active === i ? 'text-accent' : 'text-transparent',
                      )}
                      style={
                        active === i ? undefined : { WebkitTextStroke: '1px rgba(240,238,231,0.26)' }
                      }
                    >
                      {step.index}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[clamp(1.45rem,3.4vw,2.5rem)] font-extrabold uppercase leading-[0.92] tracking-tighter2 text-bone">
                        {step.title}
                      </h3>
                      <p className="mt-3.5 max-w-[56ch] text-[15px] leading-relaxed text-bone-mute">
                        {step.summary}
                      </p>
                      <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-bone-faint">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent/60 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                </motion.li>
              ))}
            </div>
          </ol>
        </div>
      </Shell>
    </Section>
  )
}
