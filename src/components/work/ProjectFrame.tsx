import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { usePrefersReducedMotion } from '@/hooks'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

function srcSetFor(image: string): string {
  return `${image.replace('-1365', '-960')} 960w, ${image} 1365w`
}

interface ProjectFrameProps {
  project: Project
  onOpen: () => void
  priority?: boolean
}

/**
 * The screenshot as a *plate*, not a browser mockup — mockup chrome is the
 * single most generic thing in portfolio design.
 *
 * Depth: the image sits oversized inside its clip and drifts against the
 * pointer, scaling back on hover. A hairline bracket frame tightens in on
 * hover. All of it is decoration only; the button remains the full surface so
 * keyboard and touch users get the same affordance.
 */
export function ProjectFrame({ project, onOpen, priority = false }: ProjectFrameProps) {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const imageX = useSpring(useTransform(px, [-0.5, 0.5], [22, -22]), {
    stiffness: 90,
    damping: 24,
  })
  const imageY = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), {
    stiffness: 90,
    damping: 24,
  })
  const imageScale = useTransform(px, [-0.5, 0.5], [1.09, 1.03])

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
  }

  const comingSoon = project.status === 'coming-soon'

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor-label="Open"
      aria-label={`Open case study for ${project.name}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
    >
      <div
        className={cn(
          'relative overflow-hidden border border-[var(--hairline-strong)] bg-ink-850',
          'transition-[border-color] duration-700 group-hover:border-bone/25',
        )}
      >
        {/* screenshot */}
        <div className="relative aspect-[1365/700] overflow-hidden bg-ink-900">
          <motion.img
            src={project.image}
            srcSet={srcSetFor(project.image)}
            sizes="(max-width: 1024px) 94vw, 62vw"
            alt={project.imageAlt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={1365}
            height={646}
            style={
              reduce ? undefined : { x: imageX, y: imageY, scale: imageScale }
            }
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full origin-center object-cover object-top transition-[filter] duration-1000 group-hover:brightness-105"
          />

          {/* depth scrim — also guarantees the overlapping title stays legible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background:
                'linear-gradient(to top, rgba(4,4,5,0.94) 0%, rgba(4,4,5,0.55) 18%, rgba(4,4,5,0.10) 46%, rgba(4,4,5,0) 68%)',
            }}
          />

          {/* lateral falloff so the plate reads as lit, not pasted on */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(100deg, rgba(4,4,5,0.55) 0%, rgba(4,4,5,0) 34%, rgba(4,4,5,0) 66%, rgba(4,4,5,0.35) 100%)',
            }}
          />

          {comingSoon && (
            <div className="absolute inset-0 grid place-items-center bg-ink-950/55 backdrop-blur-[2px]">
              <span className="rounded-full border border-[#E9C46A]/50 bg-ink-950/70 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-[#E9C46A]">
                Coming soon
              </span>
            </div>
          )}
        </div>

        {/* bracket frame — tightens on hover */}
        {(['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-b border-l', 'right-3 bottom-3 border-b border-r'] as const).map(
          (position) => (
            <span
              key={position}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute h-5 w-5 border-bone/25 transition-all duration-700 ease-out-expo group-hover:border-accent/70',
                position,
                'group-hover:h-7 group-hover:w-7',
                position.includes('left') ? 'group-hover:left-5' : 'group-hover:right-5',
                position.includes('top') ? 'group-hover:top-5' : 'group-hover:bottom-5',
              )}
            />
          ),
        )}

        {/* hover affordance */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 grid h-12 w-12 translate-y-4 place-items-center rounded-full bg-accent text-ink opacity-0 transition-all duration-700 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Icon name="arrow-up-right" size={18} />
        </span>
      </div>
    </motion.button>
  )
}
