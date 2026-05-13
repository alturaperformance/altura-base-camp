import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import type { Goal } from '@/types/profile'
import { formatGoalDate } from '@/lib/date-utils'
import { getElevationDelta } from '@/lib/demo-store'

interface GoalCountdownCardProps {
  goal: Goal
  homeElevationFt: number
  daysUntil: number
}

export function GoalCountdownCard({ goal, homeElevationFt, daysUntil }: GoalCountdownCardProps) {
  const delta = getElevationDelta(homeElevationFt, goal.max_elevation_ft)
  const urgency = daysUntil <= 7

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        {urgency ? 'Final prep' : 'Goal countdown'}
      </p>
      <Card className={urgency ? 'border border-orange-500/40' : ''}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">{goal.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{formatGoalDate(goal.date)}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-3xl font-bold ${urgency ? 'text-orange-400' : 'text-blue-400'}`}>
              {daysUntil}
            </span>
            <p className="text-xs text-slate-500">days out</p>
          </div>
        </div>

        {delta && (
          <div className="bg-navy-600 rounded-xl p-3 mb-3">
            <p className="text-xs text-slate-400">
              Jumping roughly <span className="text-white font-semibold">{delta}</span> above your daily altitude
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {goal.location && <Pill variant="slate">{goal.location}</Pill>}
          {goal.max_elevation_ft && (
            <Pill variant="teal">{goal.max_elevation_ft.toLocaleString()} ft</Pill>
          )}
          <Pill variant={urgency ? 'orange' : 'blue'}>
            {daysUntil <= 7 ? 'Final week' : daysUntil <= 30 ? 'Countdown' : 'Base building'}
          </Pill>
        </div>
      </Card>
    </div>
  )
}
