'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export function NewGoalCard() {
  const router = useRouter()

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        What&apos;s next?
      </p>
      <Card>
        <p className="text-sm text-slate-400 mb-4">
          Your check-in history and all pattern data carry forward — nothing resets.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => router.push('/onboarding/goal?type=event')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-navy-600 hover:bg-navy-500 border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <span className="text-lg">🏆</span>
            <div>
              <p className="text-sm font-semibold text-white">Set a new event or race goal</p>
              <p className="text-xs text-slate-400 mt-0.5">Add a race, summit, or challenge</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/onboarding/goal?type=trip')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-navy-600 hover:bg-navy-500 border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <span className="text-lg">🏔️</span>
            <div>
              <p className="text-sm font-semibold text-white">Plan a recovery trip</p>
              <p className="text-xs text-slate-400 mt-0.5">A lighter trip to stay active</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-navy-600 transition-all text-left">
            <span className="text-lg">⏸️</span>
            <div>
              <p className="text-sm font-semibold text-slate-300">I&apos;ll decide later</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Your check-in history stays intact — nothing is lost
              </p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
}
