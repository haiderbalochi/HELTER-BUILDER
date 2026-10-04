import { motion } from 'framer-motion'
import type { ReviewStats } from '@/firebase/types'
import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: number
  tone?: 'default' | 'accent' | 'warning' | 'muted'
  hint?: string
}

const TONE: Record<NonNullable<StatTileProps['tone']>, string> = {
  default: 'text-bone',
  accent: 'text-accent',
  warning: 'text-[#E9C46A]',
  muted: 'text-bone-mute',
}

export function StatTile({ label, value, tone = 'default', hint }: StatTileProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--hairline)] bg-white/[0.02] p-5">
      <p className="label mb-3">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cn('font-display text-4xl font-extrabold leading-none tracking-tightest tabular', TONE[tone])}
      >
        {value}
      </motion.p>
      {hint && <p className="mt-2 font-mono text-[10px] text-bone-faint">{hint}</p>}
    </div>
  )
}

export function StatsGrid({ stats }: { stats: ReviewStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatTile label="Total reviews" value={stats.total} hint="All submissions" />
      <StatTile
        label="Pending"
        value={stats.pending}
        tone="warning"
        hint="Awaiting a decision"
      />
      <StatTile label="Published" value={stats.published} tone="accent" hint="Visible publicly" />
      <StatTile
        label="Hidden / rejected"
        value={stats.hidden + stats.rejected}
        tone="muted"
        hint={`${stats.hidden} hidden · ${stats.rejected} rejected`}
      />
    </div>
  )
}
