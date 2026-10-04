import { useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SERVICES, type Service } from '@/lib/services'
import { VIEWPORT_ONCE, fadeUp } from '@/lib/motion'

const SERVICE_ICON: Record<Service['icon'], IconName> = {
  web: 'browser',
  app: 'mobile',
  uiux: 'pen',
  fullstack: 'layers',
  ai: 'spark',
  custom: 'blocks',
}

/** Line-art discipline glyph — draws itself when the row is hovered. */
function ServiceGlyph({ icon }: { icon: Service['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 }

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-full w-full text-bone-faint transition-colors duration-700 group-hover:text-accent/60"
      aria-hidden="true"
    >
      <g className="[stroke-dasharray:460] [stroke-dashoffset:460] transition-[stroke-dashoffset] duration-[1400ms] ease-out-expo group-hover:[stroke-dashoffset:0]">
        {icon === 'web' && (
          <>
            <rect x="12" y="20" width="96" height="76" rx="2" {...common} />
            <path d="M12 40h96M26 30h.01M36 30h.01M46 30h.01" {...common} />
            <path d="M30 56h34M30 68h52M30 80h24" {...common} />
          </>
        )}
        {icon === 'app' && (
          <>
            <rect x="34" y="10" width="52" height="100" rx="6" {...common} />
            <path d="M52 24h16M54 96h12" {...common} />
            <path d="M46 44h28M46 58h28M46 72h18" {...common} />
          </>
        )}
        {icon === 'uiux' && (
          <>
            <rect x="14" y="16" width="40" height="40" rx="2" {...common} />
            <rect x="66" y="16" width="40" height="24" rx="2" {...common} />
            <rect x="66" y="50" width="40" height="54" rx="2" {...common} />
            <rect x="14" y="66" width="40" height="38" rx="2" {...common} />
          </>
        )}
        {icon === 'fullstack' && (
          <>
            <path d="M60 12 108 36 60 60 12 36 60 12Z" {...common} />
            <path d="M12 60l48 24 48-24" {...common} />
            <path d="M12 84l48 24 48-24" {...common} />
          </>
        )}
        {icon === 'ai' && (
          <>
            <circle cx="60" cy="60" r="16" {...common} />
            <path
              d="M60 8v20M60 92v20M8 60h20M92 60h20M23 23l14 14M83 83l14 14M97 23 83 37M37 83 23 97"
              {...common}
            />
            <circle cx="60" cy="60" r="38" {...common} strokeDasharray="4 8" />
          </>
        )}
        {icon === 'custom' && (
          <>
            <rect x="14" y="14" width="40" height="40" rx="4" {...common} />
            <rect x="66" y="14" width="40" height="40" rx="4" {...common} />
            <rect x="14" y="66" width="40" height="40" rx="4" {...common} />
            <path d="M86 66v40M66 86h40" {...common} />
          </>
        )}
      </g>
    </svg>
  )
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLElement>(null)

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      onMouseMove={onMove}
      className="group relative hairline-b"
    >
      {/* pointer lamp */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(240,238,231,0.05), transparent 65%)',
        }}
      />

      {/* ghost glyph, right edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 hidden h-36 w-36 -translate-y-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-100 xl:block"
      >
        <ServiceGlyph icon={service.icon} />
      </span>

      <div className="relative grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-11 lg:py-14">
        <div className="flex items-start gap-4 md:col-span-1 md:block">
          <span className="label tabular text-bone-faint transition-colors duration-500 group-hover:text-accent">
            {service.index}
          </span>
        </div>

        <div className="md:col-span-5">
          <h3 className="display-head text-[clamp(1.7rem,4vw,3.4rem)] text-bone transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
            {service.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-4 block h-px w-10 origin-left scale-x-100 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-[7]"
          />
        </div>

        <div className="md:col-span-5 xl:col-span-5">
          <p className="max-w-[54ch] text-[15px] leading-relaxed text-bone-mute md:text-[15.5px]">
            {service.description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-faint transition-colors duration-500 group-hover:text-bone-mute"
              >
                <span
                  className="h-1 w-1 rounded-full bg-current opacity-60"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden justify-end md:col-span-1 md:flex">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--hairline)] text-bone-mute transition-all duration-500 group-hover:rotate-[45deg] group-hover:border-accent/60 group-hover:text-accent">
            <Icon name={SERVICE_ICON[service.icon]} size={16} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function Expertise() {
  return (
    <Section id="expertise" ruled rhythm="loose" aria-label="Expertise and services">
      <Shell className="space-y-12 md:space-y-16">
        <SectionHeading
          index="02"
          eyebrow="Expertise"
          title="WHAT I DO"
          lede="Six disciplines, one person. Pick the one you need — or the combination that gets your project shipped."
          accentLastWord
        />

        <div className="hairline-t">
          {SERVICES.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>
      </Shell>
    </Section>
  )
}
