'use client'

import { useState } from 'react'
import type { Lifestyle } from '@/types/profile'

const OPTIONS: { value: Lifestyle; label: string; description: string; icon: string }[] = [
  {
    value: 'daily_local',
    label: 'I live at altitude every day',
    description: 'Denver, Boulder, Colorado Springs, etc.',
    icon: '🏠',
  },
  {
    value: 'weekend_warrior',
    label: 'I do weekend trips into the mountains',
    description: 'Hiking, skiing, camping above 8,000 ft',
    icon: '🏔️',
  },
  {
    value: 'serious_trainer',
    label: 'I train seriously at altitude',
    description: 'Running, cycling, climbing — regular outdoor training',
    icon: '🏃',
  },
  {
    value: 'event_prep',
    label: "I'm preparing for a specific event or trip",
    description: 'Race, summit, backcountry trip',
    icon: '🎯',
  },
]

interface Q1LifestyleProps {
  onNext: (value: Lifestyle) => void
}

export function Q1Lifestyle({ onNext }: Q1LifestyleProps) {
  const [selected, setSelected] = useState<Lifestyle | null>(null)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 mt-2">
        Which of these best describes how altitude is part of your life?
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Pick the one that fits most — you can always refine this later.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={[
              'w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all',
              selected === opt.value
                ? 'bg-blue-600/15 border-blue-600/50 shadow-lg shadow-blue-600/10'
                : 'bg-navy-700 border-slate-700/50 hover:border-slate-600',
            ].join(' ')}
          >
            <span className="text-2xl mt-0.5">{opt.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${selected === opt.value ? 'text-blue-300' : 'text-white'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
            </div>
            {selected === opt.value && (
              <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && onNext(selected)}
        className={[
          'w-full py-4 rounded-2xl text-sm font-bold transition-all',
          selected
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
            : 'bg-navy-700 text-slate-500 border border-slate-700/50 cursor-not-allowed',
        ].join(' ')}
      >
        Continue →
      </button>
    </div>
  )
}
