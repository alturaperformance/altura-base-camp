'use client'

import { useAppStore } from '@/lib/demo-store'
import { detectPatterns } from '@/lib/pattern-detection'
import { Card } from '@/components/ui/Card'

export default function TrendsPage() {
  const { checkins, profile } = useAppStore()
  const patterns = detectPatterns(checkins)
  const hasEnoughData = checkins.length >= 5

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Trends</h1>
        <p className="text-sm text-slate-400 mt-1">
          {hasEnoughData ? 'Patterns from your check-in history' : `${checkins.length} / 5 check-ins to unlock`}
        </p>
      </div>

      {!hasEnoughData ? (
        <Card>
          <div className="text-center py-6">
            <span className="text-4xl mb-3 block">📊</span>
            <h3 className="text-base font-semibold text-white mb-2">Trends unlock at 5 check-ins</h3>
            <p className="text-sm text-slate-400 mb-4">
              You've logged {checkins.length} check-in{checkins.length !== 1 ? 's' : ''}. {5 - checkins.length} more to go.
            </p>
            <div className="flex gap-1.5 max-w-[180px] mx-auto">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`flex-1 h-1.5 rounded-full ${n <= checkins.length ? 'bg-blue-600' : 'bg-navy-600'}`}
                />
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Patterns */}
          {patterns.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
                Detected patterns
              </p>
              <div className="space-y-3">
                {patterns.map((pattern, i) => (
                  <Card key={i}>
                    <h4 className="text-sm font-semibold text-white mb-1">{pattern.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{pattern.body}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{pattern.dataPoints} check-ins</span>
                      <span>·</span>
                      <span className="text-blue-400">{Math.round(pattern.confidence * 100)}% confidence</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <p className="text-sm font-semibold text-white mb-1">Patterns emerging</p>
              <p className="text-xs text-slate-400">
                No strong correlations detected yet. Keep logging consistently — patterns typically emerge after 7–10 check-ins.
              </p>
            </Card>
          )}

          {/* Check-in history chart */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Recent check-ins
            </p>
            <Card>
              <div className="space-y-3">
                {checkins.slice(-7).reverse().map((checkin, i) => (
                  <div key={checkin.id} className="flex items-center justify-between py-1 border-b border-slate-700/30 last:border-0">
                    <span className="text-xs text-slate-500">{checkin.date}</span>
                    <div className="flex gap-2">
                      {checkin.energy && (
                        <span className="text-xs">E: <span className="text-white font-medium">{checkin.energy}</span></span>
                      )}
                      {checkin.sleep_quality && (
                        <span className="text-xs">S: <span className="text-white font-medium">{checkin.sleep_quality}</span></span>
                      )}
                      {checkin.hydration && (
                        <span className="text-xs">H: <span className="text-white font-medium">{checkin.hydration}</span></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
