import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Hairline scroll indicator pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 })
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY < 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={`fixed inset-x-0 top-0 z-[85] h-[2px] bg-accent transition-opacity duration-500 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    />
  )
}
