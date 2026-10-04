import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TECH_CATEGORIES, TECHNOLOGIES, type TechCategory } from '@/lib/technologies'
import { SPRING_SOFT, VIEWPORT_ONCE, fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface Link {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

type Filter = 'All' | TechCategory

const CATEGORY_DOT: Record<TechCategory, string> = {
  Frontend: '#C8FF4D',
  Backend: '#7CF5D3',
  'App Development': '#4F6BFF',
  Database: '#E9C46A',
  Tools: '#EDEBE4',
  AI: '#FF8A5B',
  Design: '#C9A2E8',
}

export function Technologies() {
  const [filter, setFilter] = useState<Filter>('All')
  const [links, setLinks] = useState<Link[]>([])
  const fieldRef = useRef<HTMLDivElement>(null)

  const counts = useMemo(() => {
    const map = new Map<Filter, number>()
    map.set('All', TECHNOLOGIES.length)
    TECH_CATEGORIES.forEach((category) => {
      map.set(
        category,
        TECHNOLOGIES.filter((tech) => tech.category === category).length,
      )
    })
    return map
  }, [])

  const visible = useMemo(
    () => (filter === 'All' ? TECHNOLOGIES : TECHNOLOGIES.filter((t) => t.category === filter)),
    [filter],
  )

  // Draw proximity links between whatever chips are currently rendered.
  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    let frame = 0
    const compute = () => {
      const rect = field.getBoundingClientRect()
      if (rect.width === 0) return

      const nodes = Array.from(field.querySelectorAll<HTMLElement>('[data-node]')).map((el) => {
        const box = el.getBoundingClientRect()
        return {
          x: box.left - rect.left + box.width / 2,
          y: box.top - rect.top + box.height / 2,
        }
      })

      const seen = new Set<string>()
      const next: Link[] = []

      nodes.forEach((node, i) => {
        const nearest = nodes
          .map((other, j) => ({ j, d: Math.hypot(other.x - node.x, other.y - node.y) }))
          .filter((entry) => entry.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2)

        nearest.forEach(({ j, d }) => {
          if (d > 340) return
          const key = [i, j].sort((a, b) => a - b).join(':')
          if (seen.has(key)) return
          seen.add(key)
          next.push({
            key,
            x1: node.x,
            y1: node.y,
            x2: nodes[j].x,
            y2: nodes[j].y,
          })
        })
      })

      setLinks(next)
    }

    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(compute)

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(compute)
    })
    observer.observe(field)

    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(compute)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [filter])

  return (
    <Section id="stack" ruled rhythm="loose" aria-label="Technologies and tools">
      <Shell className="space-y-10 md:space-y-16">
        <SectionHeading
          index="03"
          eyebrow="Capabilities"
          title="TOOLS I BUILD WITH"
          lede="Filter by discipline. Every entry here is tied to work you can actually open — nothing padded for effect."
          accentLastWord
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
          {/* ---------------------------------------------------- filters */}
          <div className="flex flex-col gap-5 border-t-2 border-bone/80 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex shrink-0 items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <p className="label text-bone-mute tabular">
                {visible.length} of {TECHNOLOGIES.length} tools
              </p>
            </div>

            <div
              className="no-scrollbar -mx-1 flex gap-6 overflow-x-auto px-1 md:mx-0 md:flex-wrap md:justify-end md:px-0"
              role="tablist"
              aria-label="Filter technologies by category"
            >
              {(['All', ...TECH_CATEGORIES] as Filter[]).map((category) => {
                const isActive = filter === category
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(category)}
                    className={cn(
                      'relative shrink-0 whitespace-nowrap py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300',
                      isActive ? 'text-bone' : 'text-bone-faint hover:text-bone-mute',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {category}
                      <span
                        className={cn(
                          'tabular text-[9px]',
                          isActive ? 'text-accent' : 'text-bone-faint/70',
                        )}
                      >
                        {counts.get(category) ?? 0}
                      </span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="tech-filter-rule"
                        className="absolute inset-x-0 -bottom-px h-[2px] bg-accent"
                        transition={SPRING_SOFT}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ------------------------------------------------- node field */}
          <div
            ref={fieldRef}
            className="relative border-t border-[var(--hairline)] py-14 md:py-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(240,238,231,0.055) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <AnimatePresence initial={false}>
                {links.map((link) => (
                  <motion.line
                    key={link.key}
                    x1={link.x1}
                    y1={link.y1}
                    x2={link.x2}
                    y2={link.y2}
                    stroke="rgba(240,238,231,0.17)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
            </svg>

            <ul className="relative flex flex-wrap items-center justify-center gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((tech, i) => (
                  <motion.li
                    key={tech.name}
                    data-node=""
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ ...SPRING_SOFT, delay: Math.min(i * 0.02, 0.3) }}
                    className="group relative"
                  >
                    <div className="flex items-center gap-2.5 border border-[var(--hairline)] bg-ink-880/80 px-3.5 py-2.5 backdrop-blur-sm transition-colors duration-300 hover:border-bone/30">
                      <span
                        className="h-1.5 w-1.5 shrink-0 transition-transform duration-300 group-hover:scale-150"
                        style={{ backgroundColor: CATEGORY_DOT[tech.category] }}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[11.5px] tracking-wide text-bone transition-colors duration-300 md:text-[12.5px]">
                        {tech.name}
                      </span>
                      <span className="hidden font-mono text-[9px] uppercase tracking-wider2 text-bone-faint sm:inline">
                        {tech.category}
                      </span>
                    </div>

                    {/* provenance tooltip — desktop only */}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-56 -translate-x-1/2 border border-[var(--hairline-strong)] bg-ink-850 px-3 py-2 text-left text-[11px] leading-snug text-bone-mute opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 md:block"
                    >
                      <span className="label mb-1 block text-[9px] text-accent/80">Verified</span>
                      {tech.evidence}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] py-4">
            <p className="label text-bone-faint">Hover a tool to see where it was verified</p>
            <p className="label text-bone-faint">Sorted by discipline, not by hype</p>
          </div>
        </motion.div>
      </Shell>
    </Section>
  )
}
