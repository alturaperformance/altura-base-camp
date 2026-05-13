import { Card } from '@/components/ui/Card'
import type { Pattern } from '@/types/insights'

interface PatternCardProps {
  pattern: Pattern
  isFirst?: boolean
}

export function PatternCard({ pattern, isFirst = false }: PatternCardProps) {
  return (
    <div>
      {isFirst && (
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
          Your first pattern
        </p>
      )}
      <Card>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/15 border border-blue-600/25 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm">📊</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">{pattern.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{pattern.body}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">{pattern.dataPoints} check-ins</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs text-blue-400">
                {Math.round(pattern.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
