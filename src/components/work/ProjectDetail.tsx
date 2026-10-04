import { Modal } from '@/components/ui/Modal'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

interface ProjectDetailProps {
  project: Project | null
  onClose: () => void
  onOpenNext?: () => void
}

const META_LABELS = [
  { key: 'category', label: 'Category' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
] as const

export function ProjectDetail({ project, onClose, onOpenNext }: ProjectDetailProps) {
  const comingSoon = project?.status === 'coming-soon'

  return (
    <Modal
      open={Boolean(project)}
      onClose={onClose}
      title={project?.name ?? ''}
      eyebrow={project ? `${project.index} — ${project.category}` : undefined}
      className="sm:max-w-3xl"
      headerExtra={
        onOpenNext ? (
          <button
            type="button"
            onClick={onOpenNext}
            className="hidden items-center gap-2 border border-[var(--hairline)] px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider2 text-bone-mute transition hover:border-accent/50 hover:text-accent sm:flex"
          >
            Next <Icon name="arrow-right" size={13} />
          </button>
        ) : null
      }
    >
      {project && (
        <div className="space-y-8">
          <div className="overflow-hidden border border-[var(--hairline)]">
            <img
              src={project.image}
              alt={project.imageAlt}
              width={1365}
              height={646}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3">
            {META_LABELS.map(({ key, label }) => (
              <div key={key} className="bg-ink-880 px-4 py-4">
                <p className="label mb-2">{label}</p>
                <p
                  className={cn(
                    'text-sm text-bone',
                    key === 'status' && comingSoon && 'text-[#E9C46A]',
                    key === 'status' && !comingSoon && 'text-accent',
                  )}
                >
                  {key === 'status'
                    ? comingSoon
                      ? 'Coming soon'
                      : 'Live'
                    : String(project[key])}
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="label mb-3 text-accent/80">Overview</p>
            <p className="text-[15px] leading-relaxed text-bone-soft">{project.description}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-bone-mute">{project.tagline}.</p>
          </div>

          <div>
            <p className="label mb-4 text-accent/80">Notable features</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 border-b border-[var(--hairline)] px-4 py-3.5 last:border-b-0"
                >
                  <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-[13.5px] leading-relaxed text-bone-mute">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--hairline)] pt-6">
            {comingSoon ? (
              <span className="inline-flex h-12 items-center gap-2.5 border border-dashed border-[#E9C46A]/45 px-6 font-mono text-[11px] uppercase tracking-wider2 text-[#E9C46A]">
                <Icon name="lock" size={14} />
                Not launched yet
              </span>
            ) : (
              <ButtonLink href={project.url} variant="primary" size="lg" icon="arrow-up-right">
                Visit project
              </ButtonLink>
            )}

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] lowercase tracking-wide text-bone-faint underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
            >
              {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}
