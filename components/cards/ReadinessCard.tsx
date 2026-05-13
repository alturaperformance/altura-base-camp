import { Card } from '@/components/ui/Card'

interface ReadinessCardProps {
  score: number
  provider?: 'whoop' | 'oura'
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'Ready'
  if (score >= 50) return 'Moderate'
  return 'Recovery needed'
}

function getScoreGuidance(score: number): string {
  if (score >= 70) {
    return 'Your body is well-recovered and ready for effort. A good day for a meaningful training session or activity at altitude.'
  }
  if (score >= 50) {
    return 'Your readiness is moderate. Consider a lighter effort today — recovery activities, easy movement, and strong hydration support the next adaptation cycle.'
  }
  return 'Your body is signaling a need for recovery. At altitude, pushing through low-readiness days has outsized consequences. Rest, hydrate, and prioritize sleep tonight.'
}

export function ReadinessCard({ score, provider = 'whoop' }: ReadinessCardProps) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const guidance = getScoreGuidance(score)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Today&apos;s readiness
      </p>
      <Card>
        <div className="flex items-center gap-4 mb-3">
          <div className={`text-5xl font-bold ${color}`}>{score}</div>
          <div>
            <p className={`text-base font-semibold ${color}`}>{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">via {provider === 'whoop' ? 'Whoop' : 'Oura'}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{guidance}</p>
      </Card>
    </div>
  )
}
