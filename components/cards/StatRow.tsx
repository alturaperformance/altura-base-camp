import { Card } from '@/components/ui/Card'

interface StatRowProps {
  stats?: {
    weeklyElevation?: number
    trainingLoad?: number
    activeDays?: number
  }
}

export function StatRow({ stats = {} }: StatRowProps) {
  const { weeklyElevation = 4200, trainingLoad = 68, activeDays = 4 } = stats

  return (
    <Card>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{weeklyElevation.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">ft gained</p>
        </div>
        <div className="text-center border-x border-slate-700/50">
          <p className="text-lg font-bold text-white">{trainingLoad}</p>
          <p className="text-xs text-slate-500 mt-0.5">training load</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{activeDays}</p>
          <p className="text-xs text-slate-500 mt-0.5">active days</p>
        </div>
      </div>
      <p className="text-xs text-slate-600 text-center mt-2">via Strava · last 7 days</p>
    </Card>
  )
}
