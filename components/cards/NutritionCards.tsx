import { Card } from '@/components/ui/Card'
import type { InsightCard } from '@/types/insights'

interface NutritionCardsProps {
  cards: InsightCard[]
}

export function NutritionCards({ cards }: NutritionCardsProps) {
  if (cards.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Nutrition & hydration
      </p>
      <div className="space-y-3">
        {cards.map((card) => (
          <Card key={card.id}>
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
