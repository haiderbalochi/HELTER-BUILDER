import { useEffect, useRef, useState } from 'react'
import { copyText } from '@/lib/contact'

export function useCopyToClipboard(resetAfter = 2200) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (value: string) => {
    const ok = await copyText(value)
    setCopied(ok)
    setFailed(!ok)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setCopied(false)
      setFailed(false)
    }, resetAfter)
    return ok
  }

  return { copied, failed, copy }
}
