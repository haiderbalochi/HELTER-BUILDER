import { useEffect, useState } from 'react'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { PageLoader } from '@/components/layout/PageLoader'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { CustomCursor } from '@/components/cursor/CustomCursor'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Expertise } from '@/sections/Expertise'
import { FinalCTA } from '@/sections/FinalCTA'
import { Hero } from '@/sections/Hero'
import { Reviews } from '@/sections/Reviews'
import { SelectedWork } from '@/sections/SelectedWork'
import { Technologies } from '@/sections/Technologies'
import { WorkProcess } from '@/sections/WorkProcess'
import { useSmoothScroll } from '@/hooks/useLenis'
import { usePrefersReducedMotion } from '@/hooks'

export default function Home() {
  const [booting, setBooting] = useState(true)
  const reduce = usePrefersReducedMotion()

  useSmoothScroll(!booting)

  // Lock the page while the loader plate is on screen.
  useEffect(() => {
    if (!booting) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [booting])

  // Land on the right section when arriving with a hash.
  useEffect(() => {
    if (booting) return
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const element = document.getElementById(hash)
    if (element) {
      window.setTimeout(() => element.scrollIntoView({ behavior: 'auto', block: 'start' }), 60)
    }
  }, [booting])

  return (
    <>
      <PageLoader onDone={() => setBooting(false)} />
      {!reduce && <CustomCursor />}

      <AmbientBackground />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <ScrollProgress />
      <Navbar />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[99] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-wider2 focus:text-ink"
      >
        Skip to content
      </a>

      <main className="relative z-10">
        <Hero />
        <About />
        <Expertise />
        <Technologies />
        <SelectedWork />
        <WorkProcess />
        <Reviews />
        <Contact />
        <FinalCTA />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  )
}
