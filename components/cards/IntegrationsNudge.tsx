'use client'

import { Card } from '@/components/ui/Card'
import { useAppStore } from '@/lib/demo-store'
import type { Integrations } from '@/types/profile'

const INTEGRATIONS = [
  {
    key: 'strava' as keyof Integrations,
    name: 'Strava',
    icon: '🏃',
    description: 'Track your training load and elevation history',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    key: 'whoop' as keyof Integrations,
    name: 'Whoop',
    icon: '💪',
    description: 'Get a daily readiness score from your HRV data',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    key: 'oura' as keyof Integrations,
    name: 'Oura',
    icon: '💍',
    description: 'Unlock sleep stages and overnight recovery data',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
]

interface IntegrationsNudgeProps {
  integrations: Integrations
}

export function IntegrationsNudge({ integrations }: IntegrationsNudgeProps) {
  const connectIntegration = useAppStore((s) => s.connectIntegration)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Unlock richer insights
      </p>
      <Card>
        <div className="space-y-4">
          {INTEGRATIONS.map((integration) => {
            const connected = integrations[integration.key]
            return (
              <div key={integration.key} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${integration.bg} border ${integration.border} flex items-center justify-center text-base shrink-0`}
                >
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{integration.name}</p>
                  <p className="text-xs text-slate-400 leading-tight mt-0.5">
                    {integration.description}
                  </p>
                </div>
                {connected ? (
                  <div className="flex items-center gap-1.5 text-green-400 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs font-medium">Connected</span>
                  </div>
                ) : (
                  <button
                    onClick={() => connectIntegration(integration.key)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0 border border-blue-600/30 px-3 py-1.5 rounded-lg hover:bg-blue-600/10"
                  >
                    Connect
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
