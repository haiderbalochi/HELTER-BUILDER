import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { ToastProvider } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import Home from '@/pages/Home'

const AdminApp = lazy(() => import('@/admin/AdminApp'))

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950">
      <Spinner size={26} className="text-accent" />
    </div>
  )
}

/** Resets scroll position on full route changes (never on in-page anchors). */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/') return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hideadmin" element={<AdminApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
