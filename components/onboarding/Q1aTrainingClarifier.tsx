'use client'

import { useState } from 'react'
import type { TrainingFrequency, ElevationBand } from '@/types/profile'

const FREQUENCY_OPTIONS: { value: TrainingFrequency; label: string }[] = [
  { value: '1-2', label: '1–2 days' },
  { value: '3-4', label: '3–4 days' },
  { value: '5+', label: '5+ days' },
]

const ELEVATION_OPTIONS: { value: ElevationBand; label: string }[] = [
  { value: 'below_3k', label: 'Below 3,000 ft' },
  { value: '3k_5k', label: '3,000–5,000 ft' },
  { value: '5k_8k', label: '5,000–8,000 ft' },
  { value: '8k_10k', label: '8,000–10,000 ft' },
  { value: '10k_plus', label: '10,000+ ft' },
]

interface Q1aTrainingClarifierProps {
  onNext: (data: { frequency: TrainingFrequency; elevation_band: ElevationBand }) => void
  onBack: () => void
}

export function Q1aTrainingClarifier({ onNext, onBack }: Q1aTrainingClarifierProps) {
  const [frequency, setFrequency] = useState<TrainingFrequency | null>(null)
  const [elevation, setElevation] = useState<ElevationBand | null>(null)

  const canContinue = frequency !== null && elevation !== null

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 mt-2">
        Tell us about your training
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        This helps us calibrate your altitude insights.
      </p>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Days per week you train outdoors</h3>
        <div className="flex gap-3">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFrequency(opt.value)}
              className={[
                'flex-1 py-3 rounded-xl text-sm font-medium border transition-all',
                frequency === opt.value
                  ? 'bg-blue-600/15 border-blue-600/50 text-blue-300'
                  : 'bg-navy-700 border-slate-700/50 text-slate-300 hover:border-slate-600',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white mb-3">Typical training elevation</h3>
        <div className="space-y-2">
          {ELEVATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setElevation(opt.value)}
              className={[
                'w-full py-3 px-4 rounded-xl text-sm font-medium border text-left transition-all',
                elevation === opt.value
                  ? 'bg-blue-600/15 border-blue-600/50 text-blue-300'
                  : 'bg-navy-700 border-slate-700/50 text-slate-300 hover:border-slate-600',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          disabled={!canContinue}
          onClick={() =>
            canContinue && onNext({ frequency: frequency!, elevation_band: elevation! })
          }
          className={[
            'w-full py-4 rounded-2xl text-sm font-bold transition-all',
            canContinue
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
              : 'bg-navy-700 text-slate-500 border border-slate-700/50 cursor-not-allowed',
          ].join(' ')}
        >
          Continue →
        </button>
        <button onClick={onBack} className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}
