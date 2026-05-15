'use client'

import { useEffect, useState } from 'react'
import { useAppStore, getCheckinToday, getDaysUntilGoal, getDaysSinceGoal } from '@/lib/demo-store'
import { getInsightCards } from '@/lib/insights-content'
import { determineState } from '@/lib/state-machine'
import { formatHeaderDate, getGreeting, todayISO } from '@/lib/date-utils'
import { formatElevation } from '@/lib/hooks/useUnits'
import { CheckInSection } from '@/components/home/CheckInSection'
import { Card } from '@/components/ui/Card'
import type { AppContext } from '@/types/insights'
import type { Checkin } from '@/types/checkin'

// ── Strava stats type ──────────────────────────────────────────────────────
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
    days_ago: number
  }[]
}

export default function HomePage() {
  const { profile, checkins, addCheckin } = useAppStore()
  const [stravaStats, setStravaStats] = useState<StravaStats | null>(null)
  const [stravaLoading, setStravaLoading] = useState(false)

  const stravaConnected = profile?.integrations.strava ?? false

  useEffect(() => {
    if (!stravaConnected) return
    setStravaLoading(true)
    fetch('/api/strava/activities')
      .then((r) => r.json())
      .then((data) => { if (!data.error) setStravaStats(data) })
      .catch(() => {})
      .finally(() => setStravaLoading(false))
  }, [stravaConnected])

  if (!profile) return null

  const units = profile.units_preference ?? 'imperial'
  const activeGoal = profile.goal?.is_active ? profile.goal : null
  const daysUntilGoal = getDaysUntilGoal(activeGoal)
  const daysSinceGoal = getDaysSinceGoal(profile.goal)
  const checkinToday = getCheckinToday(checkins)

  const context: AppContext = {
    profile,
    checkins,
    checkinToday,
    readinessScore: null,
    checkinCount: checkins.length,
    activeGoal,
    secondaryGoal: null,
    daysUntilGoal,
    daysSinceGoal,
    showUnlockInterstitial: false,
    integrations: profile.integrations,
  }

  const state = determineState(context)
  const { insights } = getInsightCards(profile, state, checkins.length, daysUntilGoal)

  const greeting = daysSinceGoal !== null && daysSinceGoal >= 0
    ? `You did it, ${profile.first_name}`
    : `${getGreeting()}, ${profile.first_name}`

  function handleCheckinSubmit(values: Record<string, number | null>) {
    addCheckin({
      user_id: profile!.id,
      date: todayISO(),
      energy: values.energy ?? null,
      sleep_quality: values.sleep_quality ?? null,
      breathlessness: values.breathlessness ?? null,
      hydration_yesterday: values.hydration_yesterday ?? null,
      training_today: values.training_today ?? null,
      mental_clarity: null,
      hydration: null,
      headache: null,
      notes: null,
    })
  }

  return (
    <div className="max-w-md mx-auto pb-6">

      {/* ── Section 1: Check-in ─────────────────────────────────────────── */}
      <CheckInSection
        checkins={checkins}
        checkinToday={checkinToday}
        onSubmit={handleCheckinSubmit}
      />

      {/* ── Section 2: Header + Goal context ───────────────────────────── */}
      <div className="px-4 pt-5">
        <p className="text-xs text-slate-500 mb-1">
          {formatHeaderDate()} · {formatElevation(profile.home_elevation_ft, units)} · Your daily altitude
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">{greeting}</h1>

        {/* Goal context — proximity driven */}
        {activeGoal && daysUntilGoal !== null && daysUntilGoal > 0 && (
          <>
            {daysUntilGoal >= 31 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {activeGoal.name} · {daysUntilGoal} days
              </span>
            )}

            {daysUntilGoal >= 8 && daysUntilGoal < 31 && (
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Countdown</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{activeGoal.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{activeGoal.date}</p>
                    {activeGoal.max_elevation_ft && (
                      <p className="text-xs text-slate-400 mt-1">
                        Jumping roughly {formatElevation(activeGoal.max_elevation_ft - profile.home_elevation_ft, units)} above your daily altitude
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold text-white">{daysUntilGoal}</p>
                    <p className="text-xs text-slate-500">days out</p>
                  </div>
                </div>
                {activeGoal.location && (
                  <span className="inline-block mt-2 text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                    {activeGoal.location}
                  </span>
                )}
                {activeGoal.max_elevation_ft && (
                  <span className="inline-block mt-2 ml-1.5 text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                    {formatElevation(activeGoal.max_elevation_ft, units)} max
                  </span>
                )}
              </Card>
            )}

            {daysUntilGoal >= 1 && daysUntilGoal < 8 && (
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Final prep</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{activeGoal.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{activeGoal.date}</p>
                    {activeGoal.max_elevation_ft && (
                      <p className="text-xs text-slate-400 mt-1">
                        Jumping roughly {formatElevation(activeGoal.max_elevation_ft - profile.home_elevation_ft, units)} above your daily altitude
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold text-orange-400">{daysUntilGoal}</p>
                    <p className="text-xs text-slate-500">days out</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Section 3: Recovery ─────────────────────────────────────────── */}
      <div className="px-4 pt-6">
        {!profile.integrations.whoop && !profile.integrations.oura ? (
          <div className="rounded-2xl border border-slate-700/40 bg-navy-800/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Recovery</p>
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              Connect Whoop or Oura to see how your body is responding to altitude right now — HRV, recovery score, and sleep quality interpreted through an altitude lens, not just raw numbers.
            </p>
            <div className="flex gap-2">
              <a
                href="/api/integrations/whoop/connect"
                className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors"
              >
                Connect Whoop
              </a>
              <a
                href="/api/integrations/oura/connect"
                className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-violet-500/30 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 transition-colors"
              >
                Connect Oura Ring
              </a>
            </div>
          </div>
        ) : (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Recovery</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Recovery data connected. Biometric interpretation will appear here once your device syncs.
            </p>
          </Card>
        )}
      </div>

      {/* ── Section 4: Performance ───────────────────────────────────────── */}
      <div className="px-4 pt-6">
        {!stravaConnected ? (
          <div className="rounded-2xl border border-slate-700/40 bg-navy-800/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Performance</p>
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              Connect Strava to see how altitude is affecting your training — effort efficiency by elevation band, training load trends, and HR-adjusted performance tracking across running, hiking, cycling, and ski mountaineering.
            </p>
            <a
              href="/api/integrations/strava/connect"
              className="block w-full py-2.5 text-center text-xs font-semibold rounded-xl border border-orange-500/30 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 transition-colors"
            >
              Connect Strava
            </a>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Performance</p>
            {stravaLoading && (
              <Card>
                <p className="text-xs text-slate-500 text-center py-3">Loading Strava data…</p>
              </Card>
            )}
            {stravaStats && !stravaLoading && (
              <>
                <Card>
                  <p className="text-xs font-semibold text-white mb-3">This week</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stravaStats.weeklyActivityCount}</p>
                      <p className="text-xs text-slate-500 mt-0.5">activities</p>
                    </div>
                    <div className="text-center border-x border-slate-700/50">
                      <p className="text-2xl font-bold text-white">
                        {formatElevation(stravaStats.weeklyElevationFt, units)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">gained</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stravaStats.weeklyLoadScore}</p>
                      <p className="text-xs text-slate-500 mt-0.5">load score</p>
                    </div>
                  </div>
                </Card>

                {stravaStats.recentActivities.length > 0 && (
                  <Card>
                    <p className="text-xs font-semibold text-white mb-3">Most recent</p>
                    {(() => {
                      const a = stravaStats.recentActivities[0]
                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{a.name}</p>
                            <p className="text-xs text-slate-400">
                              {a.days_ago === 0 ? 'Today' : `${a.days_ago}d ago`} · {a.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-300">{a.distance_mi} mi</p>
                            <p className="text-xs text-slate-500">↑ {formatElevation(a.elevation_ft, units)}</p>
                          </div>
                        </div>
                      )
                    })()}
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Section 5: Altitude insights ─────────────────────────────────── */}
      <div className="px-4 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Altitude insights</p>
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <Card key={insight.id}>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">{insight.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
