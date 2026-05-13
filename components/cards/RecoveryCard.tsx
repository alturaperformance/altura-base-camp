import { Card } from '@/components/ui/Card'

interface RecoveryCardProps {
  daysSince: number
  homeElevationFt: number
}

const RECOVERY_CARDS = [
  {
    icon: '🔋',
    title: 'Body in deep recovery mode',
    body: 'Your cardiovascular and muscular systems are actively repairing. At altitude, this process requires more oxygen and time than at sea level — expect some fatigue to persist for 3–5 days.',
  },
  {
    icon: '💧',
    title: 'Rehydration is your first priority',
    body: 'Target 3.5–4 liters of water today. Include an electrolyte source with meals — sodium and potassium help your body retain the fluid it needs for recovery.',
  },
  {
    icon: '🍗',
    title: 'Nutrition timing window',
    body: 'Aim for a 3:1 carb-to-protein ratio within 2 hours of any light activity. This window is when glycogen replenishment is most efficient.',
  },
  {
    icon: '🌙',
    title: 'Prioritize 9+ hours of sleep',
    body: 'Growth hormone — the primary driver of tissue repair — is released primarily during deep sleep. At altitude, sleep quality drops naturally, so more time in bed is essential to get enough restorative phases.',
  },
]

export function RecoveryCard({ daysSince, homeElevationFt }: RecoveryCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Recovery — day {daysSince + 1} of 7
      </p>
      <div className="space-y-3">
        {RECOVERY_CARDS.map((card, i) => (
          <Card key={i}>
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 shrink-0">{card.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{card.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
