import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks'
import bgVideo from '../../../bc.mp4'

/**
 * The atmosphere layer — a full-bleed video loop behind the whole site.
 *
 * Rules, enforced here so no section can break them:
 *  1. The video is `fixed inset-0` + `object-cover`, so it always fills the
 *     viewport, stays centred and never distorts or letterboxes.
 *  2. Muted + `playsInline` + `loop` + `autoPlay` — the attributes browsers
 *     require for reliable background autoplay; `play()` is also kicked
 *     programmatically because some engines ignore the attribute alone.
 *  3. A single dark veil sits above it so display type keeps its contrast
 *     without crushing the footage.
 *  4. Everything is `pointer-events:none` at z-0, so type on z-10 is never
 *     contaminated and the page still scrolls underneath.
 *  5. Reduced-motion visitors get a held frame instead of a running loop.
 */
export function AmbientBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (reduce) {
      video.pause()
      return
    }

    const start = () => {
      const promise = video.play()
      if (promise && typeof promise.catch === 'function') promise.catch(() => undefined)
    }

    start()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else video.pause()
    }

    const onCanPlay = () => start()

    video.addEventListener('canplay', onCanPlay)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* fallback colour so there is never a flash of nothing while loading */}
      <div className="absolute inset-0 bg-ink" />

      {/* ---- the loop ---------------------------------------------------- */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ---- readability veil -------------------------------------------- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,4,5,0.80) 0%, rgba(4,4,5,0.60) 26%, rgba(4,4,5,0.60) 74%, rgba(4,4,5,0.84) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 45%, rgba(4,4,5,0) 32%, rgba(4,4,5,0.55) 100%)',
        }}
      />
    </div>
  )
}
