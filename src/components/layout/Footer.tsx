import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Marquee } from '@/components/ui/Marquee'
import { NAV, SITE } from '@/lib/site'
import { scrollToId } from '@/hooks/useLenis'

export function Footer() {
  const year = 2026

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <footer className="relative z-10 hairline-t">
      <div className="border-b border-[var(--hairline)] py-5">
        <Marquee
          label="Services"
          items={['Web Development', 'App Development', 'UI/UX', 'Full-Stack', 'Ecommerce', 'AI Experiences']}
          className="text-bone-faint"
        />
      </div>

      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="label mb-5 text-accent/70">(Portfolio)</p>
          <p className="display-x text-[clamp(2.4rem,6vw,4.5rem)] text-bone">
            Haider
            <br />
            Baloch
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-widest2 text-bone-mute">
            {SITE.role}
          </p>
          <p className="mt-2 text-sm text-bone-faint">{SITE.location}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className="label mb-5">Index</p>
          <ul className="space-y-3">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={goTo(item.id)}
                  className="group inline-flex items-baseline gap-3 text-sm text-bone-mute transition-colors duration-300 hover:text-accent"
                >
                  <span className="font-mono text-[10px] tabular text-bone-faint">
                    {item.index}
                  </span>
                  <span className="border-b border-transparent transition-colors duration-300 group-hover:border-accent/50">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8 lg:col-span-4">
          <div>
            <p className="label mb-4">Contact</p>
            <a
              href={`mailto:${SITE.email}`}
              className="block break-all text-sm text-bone transition-colors duration-300 hover:text-accent"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="mt-2 block font-mono text-sm tabular text-bone transition-colors duration-300 hover:text-accent"
            >
              {SITE.phoneDisplay}
            </a>
          </div>

          <div>
            <p className="label mb-4">Based in</p>
            <p className="text-sm text-bone">{SITE.location}</p>
            <p className="mt-1 font-mono text-[11px] text-bone-faint">PKT · UTC+5</p>
          </div>

          <ButtonLink
            href="#top"
            variant="ghost"
            size="md"
            icon="arrow-right"
            iconPosition="left"
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Back to top
          </ButtonLink>
        </div>
      </div>

      <div className="border-t border-[var(--hairline)]">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-wider2 text-bone-faint">
            {SITE.copyright}
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider2 text-bone-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Designed &amp; built by {SITE.name} · {year}
          </p>
          <a
            href="#contact"
            onClick={goTo('contact')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider2 text-bone-mute transition-colors hover:text-accent"
          >
            Available for work <Icon name="arrow-up-right" size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}
