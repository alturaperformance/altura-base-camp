import { Card } from '@/components/ui/Card'
import type { InsightCard } from '@/types/insights'

interface InsightsStackProps {
  insights: InsightCard[]
}

export function InsightsStack({ insights }: InsightsStackProps) {
  if (insights.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Insights
      </p>
      <div className="space-y-3">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 shrink-0">{insight.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{insight.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.body}</p>
                {insight.tag && (
                  <span className="inline-block mt-2 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                    {insight.tag}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
