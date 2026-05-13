'use client'

import { useAppStore, getDaysUntilGoal } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import { FinalChecklistCard } from '@/components/cards/FinalChecklistCard'
import { formatGoalDate } from '@/lib/date-utils'

export default function PrepPage() {
  const { profile } = useAppStore()
  const activeGoal = profile?.goal?.is_active ? profile.goal : null
  const daysUntil = getDaysUntilGoal(activeGoal)

  if (!activeGoal || daysUntil === null) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Race Prep</h1>
        <Card>
          <p className="text-sm text-slate-400 text-center py-4">No active goal to prep for.</p>
        </Card>
      </div>
    )
  }

  const phase = daysUntil <= 7 ? 'Final prep' : daysUntil <= 30 ? 'Prep phase' : 'Base building'

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{phase}</h1>
        <p className="text-sm text-slate-400 mt-1">
          {activeGoal.name} · {formatGoalDate(activeGoal.date)} · {daysUntil} days out
        </p>
      </div>

      <div className="space-y-4">
        {daysUntil <= 7 && (
          <FinalChecklistCard goal={activeGoal} daysUntil={daysUntil} />
        )}

        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">
            {daysUntil <= 30 ? 'Final prep focus areas' : 'Base building priorities'}
          </h3>
          <div className="space-y-3">
            {(daysUntil <= 30
              ? [
                  { icon: '💧', text: 'Hydrate aggressively — 3.5–4 L/day minimum' },
                  { icon: '🌙', text: '8–9 hours of sleep each night' },
                  { icon: '🌾', text: 'Carb-forward meals, reduce alcohol' },
                  { icon: '⚡', text: 'Taper intensity, maintain frequency' },
                ]
              : [
                  { icon: '📈', text: 'Build aerobic base with consistent effort' },
                  { icon: '💧', text: 'Establish daily hydration habit now' },
                  { icon: '🌙', text: 'Prioritize sleep quality over quantity' },
                  { icon: '🥩', text: 'Focus on iron-rich foods for adaptation' },
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
