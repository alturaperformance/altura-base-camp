'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DotScale } from '@/components/ui/DotScale'
import type { CheckinQuestion } from '@/types/checkin'

interface CheckInCardProps {
  questions: CheckinQuestion[]
  streakCount?: number
  onSubmit: (values: Record<string, number>) => void
}

export function CheckInCard({ questions, streakCount, onSubmit }: CheckInCardProps) {
  const [values, setValues] = useState<Record<string, number>>({})

  const allAnswered = questions.every((q) => values[q.field] !== undefined)

  function handleSubmit() {
    if (!allAnswered) return
    onSubmit(values)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Daily check-in</p>
        {streakCount !== undefined && streakCount > 0 && (
          <span className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full">
            🔥 {streakCount}-day streak
          </span>
        )}
      </div>

      <div className="space-y-4 mb-5">
        {questions.map((q) => (
          <div key={q.field} className="flex items-center justify-between">
            <span className="text-sm text-slate-300 w-28">{q.label}</span>
            <DotScale
              value={values[q.field] ?? null}
              onChange={(v) => setValues((prev) => ({ ...prev, [q.field]: v }))}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className={[
          'w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
          allAnswered
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
            : 'bg-navy-600 text-slate-500 cursor-not-allowed border border-slate-700/50',
        ].join(' ')}
      >
        Log today&apos;s check-in →
      </button>
    </Card>
  )
}
