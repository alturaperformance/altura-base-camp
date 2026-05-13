'use client'

import { useState } from 'react'

const INTEGRATIONS = [
  {
    key: 'strava' as const,
    name: 'Strava',
    icon: '🏃',
    description: 'Unlocks training load, elevation history, and performance trends at altitude',
    color: 'from-orange-500/20 to-transparent',
    border: 'border-orange-500/30',
  },
  {
    key: 'whoop' as const,
    name: 'Whoop',
    icon: '💪',
    description: 'Unlocks HRV, recovery scores, and sleep quality for readiness insights',
    color: 'from-red-500/20 to-transparent',
    border: 'border-red-500/30',
  },
  {
    key: 'oura' as const,
    name: 'Oura',
    icon: '💍',
    description: 'Unlocks sleep stages, readiness ring, and overnight recovery data',
    color: 'from-violet-500/20 to-transparent',
    border: 'border-violet-500/30',
  },
]

interface Q4IntegrationsProps {
  onNext: (connected: { strava: boolean; whoop: boolean; oura: boolean }) => void
  onBack: () => void
}

export function Q4Integrations({ onNext, onBack }: Q4IntegrationsProps) {
  const [connected, setConnected] = useState({ strava: false, whoop: false, oura: false })

  function toggle(key: keyof typeof connected) {
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 mt-2">
        Connect your accounts to unlock richer insights.
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        None of these are required — you can connect them any time.
      </p>

      <div className="space-y-4 mb-8">
        {INTEGRATIONS.map((int) => (
          <div
            key={int.key}
            className={`rounded-2xl border ${int.border} bg-gradient-to-b ${int.color} p-4`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl mt-0.5">{int.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{int.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{int.description}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(int.key)}
              className={[
                'w-full py-2.5 rounded-xl text-sm font-semibold border transition-all',
                connected[int.key]
                  ? 'bg-green-500/15 border-green-500/30 text-green-400'
                  : 'bg-navy-700 border-slate-600 text-slate-300 hover:border-slate-500',
              ].join(' ')}
            >
              {connected[int.key] ? '✓ Connected' : `Connect ${int.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onNext(connected)}
          className="w-full py-4 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all"
        >
          {Object.values(connected).some(Boolean) ? 'Continue →' : 'Skip for now →'}
        </button>
        <button onClick={onBack} className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}
