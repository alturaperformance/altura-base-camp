'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DotScale } from '@/components/ui/DotScale'

interface ReflectionCardProps {
  onSubmit?: (values: { bodyFeel: number; prepQuality: number; symptomAtAltitude: number }) => void
  submitted?: boolean
}

export function ReflectionCard({ onSubmit, submitted = false }: ReflectionCardProps) {
  const [bodyFeel, setBodyFeel] = useState<number | null>(null)
  const [prepQuality, setPrepQuality] = useState<number | null>(null)
  const [symptomAtAltitude, setSymptomAtAltitude] = useState<number | null>(null)
  const [done, setDone] = useState(submitted)

  const allAnswered = bodyFeel !== null && prepQuality !== null && symptomAtAltitude !== null

  function handleSubmit() {
    if (!allAnswered) return
    onSubmit?.({ bodyFeel, prepQuality, symptomAtAltitude })
    setDone(true)
  }

  if (done) {
    return (
      <Card>
        <div className="text-center py-2">
          <span className="text-2xl">✅</span>
          <p className="text-sm font-semibold text-white mt-2">Reflection logged</p>
          <p className="text-xs text-slate-400 mt-1">This helps calibrate your next goal.</p>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Reflection
      </p>
      <Card>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Takes 30 seconds. Helps us understand what worked and calibrate your next goal.
        </p>

        <div className="space-y-4 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 flex-1">How did your body feel?</span>
            <DotScale value={bodyFeel} onChange={setBodyFeel} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 flex-1">How was your prep?</span>
            <DotScale value={prepQuality} onChange={setPrepQuality} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 flex-1">Symptoms at altitude?</span>
            <DotScale value={symptomAtAltitude} onChange={setSymptomAtAltitude} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={[
            'w-full py-3 rounded-xl text-sm font-semibold transition-all',
            allAnswered
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-navy-600 text-slate-500 cursor-not-allowed border border-slate-700/50',
          ].join(' ')}
        >
          Submit reflection →
        </button>
      </Card>
    </div>
  )
}
