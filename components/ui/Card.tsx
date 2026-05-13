import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  tealBorder?: boolean
}

export function Card({ children, className = '', tealBorder = false }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl bg-navy-700 p-5',
        tealBorder ? 'border-2 border-teal-500' : 'border border-slate-700/40',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
