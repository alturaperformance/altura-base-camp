import { Card } from '@/components/ui/Card'

interface StreakCardProps {
  checkinCount: number
  patternsActive: boolean
}

export function StreakCard({ checkinCount, patternsActive }: StreakCardProps) {
  if (patternsActive) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-white">{checkinCount}-day streak</span>
              <span className="text-xs bg-teal-500/15 border border-teal-500/30 text-teal-400 px-2 py-0.5 rounded-full font-medium">
                Patterns active
              </span>
            </div>
            <p className="text-xs text-slate-400">10 check-ins gives you weekly trends</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-lg">
            🔓
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-navy-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${Math.min((checkinCount / 10) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">{checkinCount} / 10 toward weekly trends</p>
      </Card>
    )
  }

  const progress = Math.min(checkinCount, 5)

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-semibold text-white">Building your baseline</span>
          <p className="text-xs text-slate-400 mt-0.5">
            {5 - checkinCount} more check-in{5 - checkinCount !== 1 ? 's' : ''} to unlock pattern insights
          </p>
        </div>
        <span className="text-lg">🔒</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={[
              'flex-1 h-1.5 rounded-full transition-all',
              n <= progress ? 'bg-blue-600' : 'bg-navy-600',
            ].join(' ')}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-1.5">{checkinCount} / 5 to unlock</p>
    </Card>
  )
}
