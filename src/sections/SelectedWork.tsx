import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProjectDetail } from '@/components/work/ProjectDetail'
import { ProjectFrame } from '@/components/work/ProjectFrame'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Marquee } from '@/components/ui/Marquee'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROJECTS, type Project } from '@/lib/projects'
import { VIEWPORT_ONCE, fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

function Meta({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="label mb-1.5">{label}</p>
      <p className={cn('text-[13px] text-bone', accent && 'text-accent')}>{value}</p>
    </div>
  )
}

export function SelectedWork() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIndex = PROJECTS.findIndex((project) => project.id === activeId)
  const active: Project | null = activeIndex >= 0 ? PROJECTS[activeIndex] : null
  const next: Project | undefined =
    activeIndex >= 0 ? PROJECTS[(activeIndex + 1) % PROJECTS.length] : undefined

  return (
    <>
      <Section id="work" ruled rhythm="loose">
        <Shell className="space-y-16 md:space-y-24">
          <SectionHeading
            index="04"
            eyebrow="Portfolio"
            title="SELECTED WORK"
            lede="Four builds, each with a different problem to solve — a storefront, a creator brand, an AI product and a fashion label."
            accentLastWord
          />

          <div className="space-y-24 md:space-y-32 lg:space-y-40">
            {PROJECTS.map((project, i) => {
              const mediaFirst = i % 2 === 0
              const comingSoon = project.status === 'coming-soon'

              return (
                <motion.article
                  key={project.id}
                  id={`work-${project.id}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                  className="relative pb-16 md:pb-20 lg:pb-24"
                >
                  {/* status rail */}
                  <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-[var(--hairline)] pb-4 md:mb-12">
                    <span className="label tabular text-accent/80">Project {project.index}</span>
                    <span className="label text-bone-faint">{project.category}</span>
                    <span className="ml-auto">
                      <span
                        className={cn(
                          'label flex items-center gap-2',
                          comingSoon ? 'text-[#E9C46A]' : 'text-bone-faint',
                        )}
                      >
                        <span
                          className={cn(
                            'h-1 w-1 rounded-full',
                            comingSoon ? 'bg-[#E9C46A]' : 'bg-accent',
                          )}
                          aria-hidden="true"
                        />
                        {comingSoon ? 'Coming soon' : 'Live'}
                      </span>
                    </span>
                  </div>

                  <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
                    {/* ------------------------------------------------ plate */}
                    <div
                      className={cn(
                        'relative z-10 mt-6 lg:col-span-8 lg:mt-0',
                        mediaFirst
                          ? 'lg:-ml-12 xl:-ml-16'
                          : 'lg:order-2 lg:-mr-12 xl:-mr-16',
                      )}
                    >
                      {/* stamped numeral, sitting over the plate edge */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none absolute -top-[0.1em] z-20 font-display text-[clamp(4.5rem,13vw,10.5rem)] font-extrabold leading-none tracking-tighter2 text-transparent',
                          mediaFirst ? '-left-[0.04em]' : 'right-0',
                        )}
                        style={{ WebkitTextStroke: '1.5px rgba(240,238,231,0.5)' }}
                      >
                        {project.index}
                      </span>

                      <ProjectFrame
                        project={project}
                        priority={i === 0}
                        onOpen={() => setActiveId(project.id)}
                      />

                      {/* title crossing the bottom edge of the plate */}
                      <h3
                        className={cn(
                          'display-x pointer-events-none absolute bottom-0 z-30 text-[clamp(2.4rem,7.5vw,6.5rem)] text-bone',
                          mediaFirst ? 'left-3 translate-y-[46%]' : 'left-3 translate-y-[46%]',
                          'sm:left-6',
                        )}
                        style={{ textShadow: '0 22px 60px rgba(4,4,5,0.75)' }}
                      >
                        {project.name}
                      </h3>
                    </div>

                    {/* ------------------------------------------------ copy */}
                    <div className={cn('lg:col-span-4', !mediaFirst && 'lg:order-1')}>
                      <p className="font-mono text-[12px] uppercase tracking-wider2 text-accent/85">
                        {project.tagline}
                      </p>

                      <p className="mt-5 text-[15px] leading-relaxed text-bone-mute md:text-[15.5px]">
                        {project.description}
                      </p>

                      <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-[var(--hairline)] pt-6 sm:grid-cols-3">
                        <Meta label="Category" value={project.category} />
                        <Meta label="Role" value={project.role} />
                        <Meta
                          label="Status"
                          value={comingSoon ? 'Coming soon' : 'Live'}
                          accent={!comingSoon}
                        />
                      </dl>

                      <ul className="mt-7 space-y-3 border-t border-[var(--hairline)] pt-6">
                        {project.features.slice(0, 3).map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-3 text-[13.5px] leading-relaxed text-bone-mute"
                          >
                            <Icon
                              name="check"
                              size={13}
                              className="mt-1 shrink-0 text-accent/80"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-9 flex flex-wrap items-center gap-3">
                        {comingSoon ? (
                          <span className="inline-flex h-12 items-center gap-2.5 rounded-full border border-dashed border-[#E9C46A]/45 px-6 font-mono text-[11px] uppercase tracking-wider2 text-[#E9C46A]">
                            <Icon name="lock" size={14} />
                            Not launched yet
                          </span>
                        ) : (
                          <ButtonLink
                            href={project.url}
                            variant="primary"
                            size="md"
                            icon="arrow-up-right"
                          >
                            Visit project
                          </ButtonLink>
                        )}

                        <ButtonLink
                          href={`#work-${project.id}`}
                          variant="ghost"
                          size="md"
                          icon="plus"
                          onClick={(event) => {
                            event.preventDefault()
                            setActiveId(project.id)
                          }}
                        >
                          Case study
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </Shell>
      </Section>

      <div className="border-y border-[var(--hairline)] bg-white/[0.012] py-5">
        <Marquee
          reverse
          label="Selected work"
          items={['TarkPlace', 'LeoX', 'Aut0max', 'Mahrooj', 'From idea to launch']}
          className="text-bone-faint"
        />
      </div>

      <ProjectDetail
        project={active}
        onClose={() => setActiveId(null)}
        onOpenNext={next ? () => setActiveId(next.id) : undefined}
      />
    </>
  )
}
