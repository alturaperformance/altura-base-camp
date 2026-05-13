'use client'

import { useState } from 'react'
import type { Symptom } from '@/types/profile'

const SYMPTOM_OPTIONS: { value: Symptom; label: string; icon: string; mutuallyExclusive?: boolean }[] = [
  { value: 'fatigue', label: 'Fatigue or low energy', icon: '😴' },
  { value: 'headache', label: 'Headache', icon: '🤕' },
  { value: 'breathlessness', label: 'Shortness of breath', icon: '🫁' },
  { value: 'poor_sleep', label: 'Disrupted or poor sleep', icon: '🌙' },
  { value: 'nausea', label: 'Nausea', icon: '🤢' },
  { value: 'dizziness', label: 'Dizziness or lightheadedness', icon: '💫' },
  { value: 'appetite_loss', label: 'Decreased appetite', icon: '🍽️' },
  { value: 'brain_fog', label: 'Difficulty concentrating', icon: '🧠' },
  { value: 'elevated_hr', label: 'Elevated resting heart rate', icon: '❤️' },
  { value: 'dry_mouth', label: 'Dry mouth or increased thirst', icon: '💧' },
  { value: 'none', label: "I don't notice much at altitude", icon: '✅', mutuallyExclusive: true },
]

interface Q2SymptomsProps {
  onNext: (symptoms: Symptom[]) => void
  onBack: () => void
}

export function Q2Symptoms({ onNext, onBack }: Q2SymptomsProps) {
  const [selected, setSelected] = useState<Symptom[]>([])

  function toggle(symptom: Symptom) {
    if (symptom === 'none') {
      setSelected(['none'])
      return
    }

    setSelected((prev) => {
      const withoutNone = prev.filter((s) => s !== 'none')
      if (withoutNone.includes(symptom)) {
        return withoutNone.filter((s) => s !== symptom)
      }
      return [...withoutNone, symptom]
    })
  }

  const canContinue = selected.length > 0

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 mt-2">
        What do you notice most at altitude?
      </h2>
      <p className="text-sm text-slate-400 mb-6">Select everything that applies to you.</p>

      <div className="space-y-2 mb-8">
        {SYMPTOM_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value)
          const isDisabled = selected.includes('none') && opt.value !== 'none'

          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              disabled={isDisabled}
              className={[
                'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all',
                opt.mutuallyExclusive && 'mt-4 border-t-2 border-t-slate-700/30 pt-4',
                isSelected
                  ? 'bg-blue-600/15 border-blue-600/50'
                  : isDisabled
                  ? 'bg-navy-800 border-slate-700/20 opacity-40 cursor-not-allowed'
                  : 'bg-navy-700 border-slate-700/50 hover:border-slate-600',
              ].join(' ')}
            >
              <span className="text-lg">{opt.icon}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                {opt.label}
              </span>
              {isSelected && (
                <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        <button
          disabled={!canContinue}
          onClick={() => canContinue && onNext(selected)}
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
