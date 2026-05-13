'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { Goal } from '@/types/profile'

const CHECKLIST = [
  'Hydrating consistently for the past 3 days',
  'Getting 8+ hours of sleep each night',
  'Reducing alcohol and caffeine intake',
  'Packing electrolytes for the trip',
  'Reviewing your activity schedule and pacing plan',
  'Eating carb-forward meals the day before',
]

interface FinalChecklistCardProps {
  goal: Goal
  daysUntil: number
}

export function FinalChecklistCard({ goal, daysUntil }: FinalChecklistCardProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const checkedCount = Object.values(checked).filter(Boolean).length

  function toggle(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">
        Final prep checklist · {daysUntil} day{daysUntil !== 1 ? 's' : ''} out
      </p>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Last-mile prep</h3>
          <span className="text-xs text-slate-400">
            {checkedCount}/{CHECKLIST.length}
          </span>
        </div>

        <div className="space-y-3">
          {CHECKLIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 text-left"
            >
              <div
                className={[
                  'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                  checked[i]
                    ? 'bg-teal-500 border-teal-500'
                    : 'bg-transparent border-slate-600',
                ].join(' ')}
              >
                {checked[i] && <span className="text-navy-900 text-xs font-bold">✓</span>}
              </div>
              <span
                className={`text-sm leading-snug ${checked[i] ? 'text-slate-500 line-through' : 'text-slate-300'}`}
              >
                {item}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
