'use client'

import { useRouter } from 'next/navigation'
import { useAppStore, getElevationDelta } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { formatGoalDate, daysUntil } from '@/lib/date-utils'

export default function TripPage() {
  const router = useRouter()
  const { profile } = useAppStore()
  const activeGoal = profile?.goal?.is_active ? profile.goal : null

  if (!activeGoal) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Trip</h1>
          <p className="text-sm text-slate-400 mt-1">Plan and track your next altitude goal</p>
        </div>
        <Card>
          <div className="text-center py-6">
            <span className="text-4xl mb-3 block">🏔️</span>
            <h3 className="text-base font-semibold text-white mb-2">No active goal</h3>
            <p className="text-sm text-slate-400 mb-4">
              Add a trip or event goal to unlock countdown tracking and prep guidance.
            </p>
            <button
              onClick={() => router.push('/onboarding/goal')}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition-colors"
            >
              Add a goal
            </button>
          </div>
        </Card>
      </div>
    )
  }

  const days = daysUntil(activeGoal.date)
  const delta = profile ? getElevationDelta(profile.home_elevation_ft, activeGoal.max_elevation_ft) : null

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Trip</h1>
        <p className="text-sm text-slate-400 mt-1">{activeGoal.name}</p>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">{activeGoal.name}</h3>
              <p className="text-sm text-slate-400">{activeGoal.location}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatGoalDate(activeGoal.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-400">{days}</p>
              <p className="text-xs text-slate-500">days out</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeGoal.max_elevation_ft && (
              <Pill variant="teal">{activeGoal.max_elevation_ft.toLocaleString()} ft</Pill>
            )}
            {delta && <Pill variant="blue">+{delta} above home</Pill>}
            <Pill variant="slate">{activeGoal.type === 'event' ? 'Event' : 'Trip'}</Pill>
          </div>
        </Card>

        {delta && (
          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Elevation context</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Jumping roughly <span className="text-white font-semibold">{delta}</span> above your daily altitude.
              Plan to allow 1–3 days for initial acclimatization, especially if your goal elevation exceeds 8,000 ft.
            </p>
          </Card>
        )}

        {activeGoal.activities.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Activities</h3>
            <div className="flex flex-wrap gap-2">
              {activeGoal.activities.map((a) => (
                <Pill key={a} variant="slate">{a.replace('_', ' ')}</Pill>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
