import type { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'teal' | 'blue' | 'orange' | 'slate' | 'green'
}

const VARIANTS = {
  teal: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
  blue: 'bg-blue-600/15 text-blue-400 border border-blue-600/30',
  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  slate: 'bg-slate-700/50 text-slate-400 border border-slate-600/30',
  green: 'bg-green-500/15 text-green-400 border border-green-500/30',
}

export function Pill({ children, variant = 'slate' }: PillProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  )
}
