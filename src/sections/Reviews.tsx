import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { Section, Shell } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stars } from '@/components/ui/Stars'
import { ReviewCard, ReviewSkeleton } from '@/components/reviews/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { averageRating, usePublishedReviews } from '@/hooks/useReviews'
import { VIEWPORT_ONCE, fadeUp } from '@/lib/motion'
import { SITE } from '@/lib/site'

function Summary({
  count,
  average,
  onLeave,
}: {
  count: number
  average: number | null
  onLeave: () => void
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="flex flex-wrap items-end justify-between gap-6 border-y border-[var(--hairline)] py-6"
    >
      <div className="flex items-end gap-6">
        <div>
          <p className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tightest text-bone tabular">
            {average !== null ? average.toFixed(1) : '—'}
          </p>
          <div className="mt-3">
            <Stars value={Math.round(average ?? 0)} size={14} />
          </div>
        </div>
        <div className="pb-1">
          <p className="font-mono text-[11px] uppercase tracking-wider2 text-bone-mute">
            {count} published {count === 1 ? 'review' : 'reviews'}
          </p>
          <p className="mt-1 font-mono text-[11px] text-bone-faint">Average rating out of 5</p>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        icon="plus"
        onClick={onLeave}
        className="hidden sm:inline-flex"
      >
        Leave a review
      </Button>
    </motion.div>
  )
}

export function Reviews() {
  const { reviews, status, error, reload } = usePublishedReviews()
  const [open, setOpen] = useState(false)
  const average = averageRating(reviews)

  return (
    <Section id="reviews" ruled rhythm="loose">
      <Shell className="space-y-12 md:space-y-16">
        <SectionHeading
          index="06"
          eyebrow="Reviews"
          title="WHAT PEOPLE SAY"
          lede="Real feedback from people I have worked with — published only after approval, never auto-posted."
          accentLastWord
        />

        <Summary count={reviews.length} average={average} onLeave={() => setOpen(true)} />

        {/* -------------------------------------------------- states */}
        {status === 'loading' && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="flex flex-col items-start gap-5 border-t-2 border-[#ff6b57]/70 py-7"
          >
            <span className="grid h-11 w-11 place-items-center border border-[#ff6b57]/45 text-[#ff6b57]">
              <Icon name="close" size={18} />
            </span>
            <div>
              <h3 className="display text-xl text-bone">Reviews are unavailable</h3>
              <p className="mt-2 max-w-prose2 text-[14.5px] leading-relaxed text-bone-mute">
                {error}
              </p>
            </div>
            <Button variant="ghost" size="md" icon="arrow-right" onClick={() => void reload()}>
              Try again
            </Button>
          </div>
        )}

        {status === 'unconfigured' && (
          <div className="border-t-2 border-bone/80 py-7">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--hairline-strong)] text-bone-mute">
                <Icon name="lock" size={17} />
              </span>
              <div>
                <h3 className="display text-xl text-bone">Review service not connected</h3>
                <p className="mt-2 max-w-prose2 text-[14.5px] leading-relaxed text-bone-mute">
                  Firebase has not been configured for this build, so reviews are hidden rather
                  than shown empty. Add <code className="text-accent">VITE_FIREBASE_API_KEY</code>{' '}
                  to <code className="text-accent">.env</code> and rebuild to enable them.
                </p>
                <p className="mt-3 font-mono text-[11px] text-bone-faint">
                  Contact directly instead:{' '}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-bone underline decoration-dotted underline-offset-4 hover:text-accent"
                  >
                    {SITE.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && reviews.length === 0 && (
          <div className="border-t-2 border-bone/80 py-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center border border-accent/45 text-accent">
              <Icon name="quote" size={20} />
            </span>
            <h3 className="display mt-5 text-2xl text-bone">No published reviews yet</h3>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-bone-mute">
              Every review on this page is read by a human before it goes live. Yours could be
              the first.
            </p>
            <div className="mt-6 flex justify-center">
              <Button variant="primary" size="lg" icon="plus" onClick={() => setOpen(true)}>
                Leave a review
              </Button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- the grid */}
        {status === 'ready' && reviews.length > 0 && (
          <>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, i) => (
                <div key={review.id} className={['xl:mt-0', 'xl:mt-16', 'xl:mt-32'][i % 3]}>
                  <ReviewCard review={review} index={i} />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[var(--hairline)] pt-8">
              <p className="max-w-prose2 text-[14.5px] leading-relaxed text-bone-mute">
                Worked with me and have a moment? I read every single one.
              </p>
              <Button variant="primary" size="lg" icon="plus" onClick={() => setOpen(true)}>
                Leave a review
              </Button>
            </div>
          </>
        )}

      </Shell>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Leave a review"
        eyebrow="Public feedback"
        headerExtra={
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider2 text-bone-faint sm:flex">
            <Icon name="lock" size={12} /> Held for approval
          </span>
        }
      >
        <ReviewForm
          onSubmitted={() => {
            void reload()
          }}
        />
        <p className="mt-6 border-t border-[var(--hairline)] pt-5 text-[13px] leading-relaxed text-bone-faint">
          Your email is used only to validate the submission — it is never shown publicly.{' '}
          <ButtonLink href={`mailto:${SITE.email}`} variant="quiet" size="md" magnetic={false}>
            Prefer email? Contact Haider
          </ButtonLink>
        </p>
      </Modal>
    </Section>
  )
}
