import { Card } from '@/components/ui/Card'
import type { Goal } from '@/types/profile'
import { formatGoalDate } from '@/lib/date-utils'

interface CompletionCardProps {
  goal: Goal
  daysSince: number
}

export function CompletionCard({ goal, daysSince }: CompletionCardProps) {
  return (
    <Card className="border border-teal-500/30 bg-gradient-to-b from-teal-500/5 to-transparent">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
            Completed
          </span>
          <h3 className="text-lg font-bold text-white mt-1">{goal.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{formatGoalDate(goal.date)}</p>
        </div>
        <div className="text-4xl mt-1">🎉</div>
      </div>

      <div className="bg-navy-600 rounded-xl p-3 mb-3">
        <p className="text-xs text-slate-400">
          Day <span className="text-white font-semibold">{daysSince + 1}</span> of 7 recovery window
        </p>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">
        Your body is in active recovery mode. The next 7 days are when the physiological adaptation from your goal effort consolidates — rest and hydration are your highest-leverage moves right now.
      </p>
    </Card>
  )
}
