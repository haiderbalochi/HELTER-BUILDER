import { motion } from 'framer-motion'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fadeUp, VIEWPORT_ONCE } from '@/lib/motion'

const FACTS = [
  { value: '3–4+', label: 'Years hands-on', caption: 'Shipping real products, not tutorials' },
  { value: '04', label: 'Selected builds', caption: 'Storefront, brand, AI tool, fashion' },
  { value: '06', label: 'Disciplines', caption: 'One person, whole path' },
  { value: 'PK', label: 'Based in Lahore', caption: 'Working locally and remotely' },
]

const PRINCIPLES = [
  {
    label: 'Structure first',
    text: 'A clear information architecture and technical plan before a single pixel is placed.',
  },
  {
    label: 'Built to last',
    text: 'Reusable components, honest naming and code the next developer can actually read.',
  },
  {
    label: 'Feels considered',
    text: 'Typography, spacing, motion and hierarchy tuned until the interface feels inevitable.',
  },
  {
    label: 'Ship it',
    text: 'Deployed, tested on real devices and handed over working — not left as a mockup.',
  },
]

export function About() {
  return (
    <Section id="about" ruled rhythm="loose">
      <Shell className="space-y-16 md:space-y-24">
        <SectionHeading
          index="01"
          eyebrow="About"
          title="WHO IS HAIDER?"
          lede="An independent developer who owns the whole path — from the first messy idea to a deployed product."
          accentLastWord
        />

        {/* ------------------------------------------------ statement */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="hairline-t grid gap-8 pt-10 lg:grid-cols-12 lg:gap-12 lg:pt-14"
        >
          <div className="lg:col-span-7">
            <p className="text-[clamp(1.35rem,3vw,2.35rem)] leading-[1.32] tracking-tighter2 text-bone">
              I&apos;m <span className="serif-accent">Haider Baloch</span> — an independent web
              and app developer based in Lahore, Pakistan, with around three to four years of
              hands-on experience building things for the web.
            </p>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <p className="text-[15.5px] leading-[1.75] text-bone-mute md:text-base">
              My work covers modern websites, web applications, mobile applications, ecommerce
              stores, interactive interfaces and custom digital products. I handle the parts
              nobody sees — structure, performance, accessibility, data flow — with the same care
              as the parts everybody does: typography, rhythm, motion, and how a screen feels the
              moment it appears.
            </p>

            <p className="text-[15.5px] leading-[1.75] text-bone-mute md:text-base">
              Where it genuinely improves the product, I fold in AI-powered features rather than
              bolting them on for effect. The goal is always the same: take an idea from a first
              conversation to something finished, working and worth putting your name on.
            </p>

            <div className="flex flex-wrap gap-x-7 gap-y-3 pt-3">
              {['Independent', 'Remote-friendly', 'Available for new work'].map((item) => (
                <span key={item} className="label flex items-center gap-2 text-bone-mute">
                  <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --------------------------------------------- principles list */}
        <div>
          <p className="label mb-6 text-accent/80">How I work</p>
          <ul className="hairline-t">
            {PRINCIPLES.map((principle, i) => (
              <motion.li
                key={principle.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                transition={{ delay: i * 0.05 }}
                className="group hairline-b grid gap-3 py-6 md:grid-cols-12 md:gap-8 md:py-7"
              >
                <span className="label tabular text-bone-faint transition-colors duration-300 group-hover:text-accent md:col-span-1">
                  0{i + 1}
                </span>
                <h3 className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-extrabold uppercase tracking-tighter2 leading-none text-bone md:col-span-4">
                  {principle.label}
                </h3>
                <p className="max-w-[58ch] text-[15px] leading-relaxed text-bone-mute md:col-span-7">
                  {principle.text}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ------------------------------------------------ facts band */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="hairline-t hairline-b grid grid-cols-2 gap-px lg:grid-cols-4"
        >
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="group relative px-1 py-7 md:px-6 md:py-9 [&:not(:last-child)]:lg:border-r [&:not(:last-child)]:lg:border-[var(--hairline)]"
            >
              <p className="font-display text-[clamp(2.4rem,5.5vw,4.25rem)] font-extrabold leading-none tracking-tighter2 text-bone transition-colors duration-500 group-hover:text-accent">
                {fact.value}
              </p>
              <p className="label mt-4 text-bone-mute">{fact.label}</p>
              <p className="mt-2 max-w-[24ch] text-[13.5px] leading-snug text-bone-faint">
                {fact.caption}
              </p>
            </div>
          ))}
        </motion.div>
      </Shell>
    </Section>
  )
}
