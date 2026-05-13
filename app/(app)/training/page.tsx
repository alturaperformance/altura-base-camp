'use client'

import { useAppStore } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'

export default function TrainingPage() {
  const { profile, checkins } = useAppStore()
  const stravaConnected = profile?.integrations.strava ?? false

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
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-xs text-slate-500 mt-0.5">activities</p>
              </div>
              <div className="text-center border-x border-slate-700/50">
                <p className="text-2xl font-bold text-white">4,200</p>
                <p className="text-xs text-slate-500 mt-0.5">ft gained</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">68</p>
                <p className="text-xs text-slate-500 mt-0.5">load score</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Recent activity</h3>
            <div className="space-y-3">
              {[
                { name: 'Morning Run', distance: '6.2 mi', elevation: '820 ft', days: 1 },
                { name: 'Trail Ride', distance: '18.4 mi', elevation: '1,840 ft', days: 3 },
                { name: 'Easy Run', distance: '4.1 mi', elevation: '340 ft', days: 5 },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{activity.name}</p>
                    <p className="text-xs text-slate-400">{activity.days}d ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{activity.distance}</p>
                    <p className="text-xs text-slate-500">↑ {activity.elevation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="text-center py-6">
              <span className="text-4xl mb-3 block">🏃</span>
              <h3 className="text-base font-semibold text-white mb-2">Connect Strava to unlock training data</h3>
              <p className="text-sm text-slate-400 mb-4">
                See your training load, elevation history, and how your efforts compare at altitude.
              </p>
              <button className="px-6 py-2.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-semibold rounded-xl hover:bg-orange-500/25 transition-colors">
                Connect Strava
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Your training profile</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Lifestyle: <span className="text-white capitalize">{profile?.lifestyle?.replace('_', ' ') ?? '—'}</span></p>
              {profile?.training.frequency && (
                <p>Training frequency: <span className="text-white">{profile.training.frequency} days/week</span></p>
              )}
              {profile?.training.elevation_band && (
                <p>Training elevation: <span className="text-white capitalize">{profile.training.elevation_band.replace('_', ' ')} ft</span></p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
