'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'

interface StravaStats {
  weeklyActivityCount: number
  weeklyElevationFt: number
  weeklyLoadScore: number
  recentActivities: {
    id: number
    name: string
    type: string
    distance_mi: number
    elevation_ft: number
    moving_time_min: number
    start_date: string
    days_ago: number
  }[]
}

export default function TrainingPage() {
  const { profile } = useAppStore()
  const stravaConnected = profile?.integrations.strava ?? false

  const [stats, setStats] = useState<StravaStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!stravaConnected) return
    setLoading(true)
    fetch('/api/strava/activities')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setFetchError(true); return }
        setStats(data)
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [stravaConnected])

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Training</h1>
        <p className="text-sm text-slate-400 mt-1">Your altitude training context</p>
      </div>

      {stravaConnected ? (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">This week</h3>
              <Pill variant="green">Strava connected</Pill>
            </div>

            {loading && (
              <p className="text-xs text-slate-500 text-center py-4">Loading from Strava…</p>
            )}

            {fetchError && !loading && (
              <p className="text-xs text-red-400 text-center py-4">
                Could not load Strava data. Try reconnecting in Settings.
              </p>
            )}

            {stats && !loading && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.weeklyActivityCount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">activities</p>
                </div>
                <div className="text-center border-x border-slate-700/50">
                  <p className="text-2xl font-bold text-white">
                    {stats.weeklyElevationFt.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">ft gained</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.weeklyLoadScore}</p>
                  <p className="text-xs text-slate-500 mt-0.5">load score</p>
                </div>
              </div>
            )}
          </Card>

          {stats && stats.recentActivities.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Recent activity</h3>
              <div className="space-y-3">
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{activity.name}</p>
                      <p className="text-xs text-slate-400">
                        {activity.days_ago === 0 ? 'Today' : `${activity.days_ago}d ago`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">{activity.distance_mi} mi</p>
                      <p className="text-xs text-slate-500">↑ {activity.elevation_ft.toLocaleString()} ft</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="text-center py-6">
              <span className="text-4xl mb-3 block">🏃</span>
              <h3 className="text-base font-semibold text-white mb-2">
                Connect Strava to unlock training data
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                See your training load, elevation history, and how your efforts compare at altitude.
              </p>
              <a
                href="/api/integrations/strava/connect"
                className="inline-block px-6 py-2.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-semibold rounded-xl hover:bg-orange-500/25 transition-colors"
              >
                Connect Strava
              </a>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Your training profile</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>
                Lifestyle:{' '}
                <span className="text-white capitalize">
                  {profile?.lifestyle?.replace('_', ' ') ?? '—'}
                </span>
              </p>
              {profile?.training.frequency && (
                <p>
                  Training frequency:{' '}
                  <span className="text-white">{profile.training.frequency} days/week</span>
                </p>
              )}
              {profile?.training.elevation_band && (
                <p>
                  Training elevation:{' '}
                  <span className="text-white capitalize">
                    {profile.training.elevation_band.replace('_', ' ')} ft
                  </span>
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
