'use client'

import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'

export default function SettingsPage() {
  const router = useRouter()
  const { profile, checkins, reset } = useAppStore()

  if (!profile) return null

  const LIFESTYLE_LABELS: Record<string, string> = {
    daily_local: 'Daily local',
    weekend_warrior: 'Weekend warrior',
    serious_trainer: 'Serious trainer',
    event_prep: 'Event prep',
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">{profile.first_name}&apos;s profile</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white">
              {profile.first_name[0].toUpperCase()}{profile.last_name?.[0]?.toUpperCase() ?? ''}
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                {profile.first_name}{profile.last_name ? ` ${profile.last_name}` : ''}
              </p>
              {profile.email && (
                <p className="text-xs text-slate-400">{profile.email}</p>
              )}
              <p className="text-xs text-slate-500">
                {checkins.length} check-in{checkins.length !== 1 ? 's' : ''} logged
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Home elevation</span>
              <span className="text-white">{profile.home_elevation_ft.toLocaleString()} ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lifestyle</span>
              <span className="text-white">{LIFESTYLE_LABELS[profile.lifestyle ?? ''] ?? '—'}</span>
            </div>
            {profile.symptoms.length > 0 && !profile.symptoms.includes('none') && (
              <div className="flex justify-between items-start gap-3">
                <span className="text-slate-400 shrink-0">Symptoms</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {profile.symptoms.slice(0, 3).map((s) => (
                    <Pill key={s} variant="slate">{s.replace('_', ' ')}</Pill>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Integrations */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Integrations</h3>
          <div className="space-y-2">
            {(['strava', 'whoop', 'oura'] as const).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 capitalize">{key}</span>
                {profile.integrations[key] ? (
                  <Pill variant="green">Connected</Pill>
                ) : (
                  <span className="text-xs text-slate-500">Not connected</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Active goal */}
        {profile.goal?.is_active && (
          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Active goal</h3>
            <p className="text-sm text-slate-300">{profile.goal.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{profile.goal.date}</p>
          </Card>
        )}

        {/* Danger zone */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Reset</h3>
          <button
            onClick={() => {
              if (confirm('Reset all data? This cannot be undone.')) {
                reset()
                router.push('/onboarding')
              }
            }}
            className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            Reset app data
          </button>
          <p className="text-xs text-slate-600 text-center mt-2">
            Clears all check-ins and profile data
          </p>
        </Card>
      </div>
    </div>
  )
}
