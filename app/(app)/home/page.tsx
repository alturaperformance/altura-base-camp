'use client'

import { useEffect, useState } from 'react'
import { useAppStore, getCheckinToday, getDaysUntilGoal, getDaysSinceGoal } from '@/lib/demo-store'
import { getInsightCards } from '@/lib/insights-content'
import { determineState } from '@/lib/state-machine'
import { formatHeaderDate, getGreeting, todayISO, formatGoalDate } from '@/lib/date-utils'
import { formatElevation } from '@/lib/units'
import { CheckInSection } from '@/components/home/CheckInSection'
import type { AppContext } from '@/types/insights'
import type { InsightCard } from '@/types/insights'
import type { Checkin } from '@/types/checkin'

// ── Design tokens ──────────────────────────────────────────────────────────────
const CARD = { background: '#181b30', border: '0.5px solid #2a2d45', borderRadius: 16, padding: 16 }
const INNER = { background: '#1e2240', border: '0.5px solid #2a2d45', borderRadius: 10 }
const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#5a5f80',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  marginBottom: 8,
}

// ── Strava types ───────────────────────────────────────────────────────────────
interface StravaStats {
  weeklyActivityCount: number
  weeklyElevationFt: number
  weeklyLoadScore: number
  recentActivities: {
    id: number; name: string; type: string
    distance_mi: number; elevation_ft: number; days_ago: number
  }[]
}

// ── Insight accent colors ──────────────────────────────────────────────────────
function insightAccent(id: string): string {
  if (id.includes('sleep')) return '#7F77DD'
  if (id.includes('breathlessness')) return '#378ADD'
  if (id.includes('fatigue')) return '#EF9F27'
  if (id.includes('headache')) return '#E24B4A'
  if (id.includes('elevated_hr')) return '#F78129'
  if (id.includes('brain_fog')) return '#7F77DD'
  if (id.includes('nausea') || id.includes('dizziness')) return '#5DCAA5'
  if (id.includes('hydration') || id.includes('nutrition')) return '#5DCAA5'
  return '#5DCAA5'
}

function insightTrigger(insight: InsightCard, checkins: Checkin[]): string {
  const last3 = checkins.slice(-3)
  if (insight.id.includes('sleep')) {
    const sleepVals = last3.map((c) => c.sleep_quality).filter((v): v is number => v !== null)
    if (sleepVals.length >= 2 && sleepVals.every((v) => v <= 3)) {
      return `You've logged sleep below 3 ${sleepVals.length} days in a row`
    }
    return 'Sleep disruption is among your reported altitude symptoms'
  }
  if (insight.id.includes('breathlessness')) {
    const last = checkins[checkins.length - 1]
    if (last?.breathlessness !== null && last?.breathlessness !== undefined) {
      return `You logged breathlessness at ${last.breathlessness}/5 in your last check-in`
    }
    return 'Breathlessness is among your reported altitude symptoms'
  }
  if (insight.id.includes('fatigue')) {
    const energyVals = last3.map((c) => c.energy).filter((v): v is number => v !== null)
    if (energyVals.length >= 2 && energyVals.every((v) => v <= 3)) {
      return `You've logged energy below 3 recently`
    }
    return 'Fatigue is among your reported altitude symptoms'
  }
  if (insight.id.includes('headache')) return 'You flagged headaches as an altitude symptom'
  if (insight.id.includes('elevated_hr')) return 'You flagged elevated heart rate as an altitude symptom'
  if (insight.id.includes('brain_fog')) return 'You flagged brain fog as an altitude symptom'
  return 'From your altitude profile'
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
    profile, checkins, checkinToday, readinessScore: null,
    checkinCount: checkins.length, activeGoal, secondaryGoal: null,
    daysUntilGoal, daysSinceGoal, showUnlockInterstitial: false,
    integrations: profile.integrations,
  }
  const state = determineState(context)
  const { insights } = getInsightCards(profile, state, checkins.length, daysUntilGoal)

  const isPostGoal = daysSinceGoal !== null && daysSinceGoal >= 0
  const greeting = isPostGoal
    ? `You did it, ${profile.first_name}`
    : `${getGreeting()}, ${profile.first_name}`

  // Phase label for goal
  function phaseLabel(days: number): string {
    if (days <= 7) return 'Final prep'
    if (days <= 30) return 'Countdown'
    return 'Base building'
  }

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

  // Strava load trend
  function loadTrend(): { label: string; color: string } {
    if (!stravaStats) return { label: 'No data', color: '#5a5f80' }
    const score = stravaStats.weeklyLoadScore
    if (score > 130) return { label: 'Overreaching', color: '#E24B4A' }
    if (score > 100) return { label: 'Building', color: '#5DCAA5' }
    if (score > 70) return { label: 'Maintaining', color: '#378ADD' }
    return { label: 'Tapering', color: '#9ca0bc' }
  }

  const trend = loadTrend()

  return (
    <div style={{ background: '#111328', minHeight: '100vh' }}>

      {/* ── Section 1: Header — full bleed ──────────────────────────────────── */}
      <div style={{ background: '#0F5AC2', padding: '16px 20px 20px' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)', marginBottom: 6 }}>
          {formatHeaderDate()} · {formatElevation(profile.home_elevation_ft, units)} · Your daily altitude
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 500, color: '#ffffff', margin: 0 }}>
          {greeting}
        </h1>

        {/* Goal pill — 31+ days out only */}
        {activeGoal && daysUntilGoal !== null && daysUntilGoal >= 31 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 10, padding: '5px 12px', borderRadius: 20,
            background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.20)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5DCAA5', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.90)' }}>
              {activeGoal.name} · {daysUntilGoal} days
            </span>
          </div>
        )}
      </div>

      {/* ── Content sections ────────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto" style={{ padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Section 2: Daily check-in ──────────────────────────────────── */}
        <section>
          <p style={SECTION_LABEL}>Daily Check-in</p>
          <CheckInSection
            checkins={checkins}
            checkinToday={checkinToday}
            onSubmit={handleCheckinSubmit}
          />
        </section>

        {/* ── Section 3: Goal ─────────────────────────────────────────────── */}
        {activeGoal && daysUntilGoal !== null && daysUntilGoal > 0 && daysUntilGoal < 31 && (
          <section>
            <p style={SECTION_LABEL}>Goal</p>
            <div style={{
              ...CARD,
              borderLeft: daysUntilGoal <= 7 ? '3px solid #F1410B' : CARD.border,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 500, color: '#e8eaf6', marginBottom: 4 }}>
                    {activeGoal.name}
                  </p>
                  <p style={{ fontSize: 12, color: '#5a5f80' }}>{formatGoalDate(activeGoal.date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 32, fontWeight: 500, color: '#0F5AC2', lineHeight: 1 }}>
                    {daysUntilGoal}
                  </p>
                  <p style={{ fontSize: 11, color: '#5a5f80' }}>days out</p>
                </div>
              </div>

              {/* Elevation delta box */}
              {activeGoal.max_elevation_ft && activeGoal.max_elevation_ft > profile.home_elevation_ft && (
                <div style={{ ...INNER, padding: '10px 12px', marginBottom: 10 }}>
                  <p style={{ fontSize: 13, color: '#9ca0bc', margin: 0 }}>
                    Jumping roughly{' '}
                    <strong style={{ color: '#e8eaf6' }}>
                      {formatElevation(activeGoal.max_elevation_ft - profile.home_elevation_ft, units)}
                    </strong>{' '}
                    above your daily altitude
                  </p>
                </div>
              )}

              {/* Pill row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeGoal.location && (
                  <span style={{
                    fontSize: 11, borderRadius: 20, padding: '4px 10px',
                    background: '#1e2240', border: '0.5px solid #2a2d45', color: '#9ca0bc',
                  }}>
                    📍 {activeGoal.location}
                  </span>
                )}
                {activeGoal.max_elevation_ft && (
                  <span style={{
                    fontSize: 11, borderRadius: 20, padding: '4px 10px',
                    background: 'rgba(93,202,165,0.10)', border: '0.5px solid rgba(93,202,165,0.30)', color: '#5DCAA5',
                  }}>
                    {formatElevation(activeGoal.max_elevation_ft, units)} max
                  </span>
                )}
                <span style={{
                  fontSize: 11, borderRadius: 20, padding: '4px 10px',
                  background: daysUntilGoal <= 7 ? 'rgba(241,65,11,0.10)' : 'rgba(55,138,221,0.10)',
                  border: `0.5px solid ${daysUntilGoal <= 7 ? 'rgba(241,65,11,0.30)' : 'rgba(55,138,221,0.30)'}`,
                  color: daysUntilGoal <= 7 ? '#F1410B' : '#378ADD',
                }}>
                  {phaseLabel(daysUntilGoal)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Section 4: Recovery ─────────────────────────────────────────── */}
        <section>
          <p style={SECTION_LABEL}>
            {profile.integrations.whoop ? 'Recovery · Via Whoop' : profile.integrations.oura ? 'Recovery · Via Oura' : 'Recovery'}
          </p>

          {!profile.integrations.whoop && !profile.integrations.oura ? (
            <div style={CARD}>
              <p style={{ fontSize: 13, color: '#9ca0bc', lineHeight: 1.6, marginBottom: 14 }}>
                Connect Whoop or Oura to see how your body is responding to altitude right now — HRV, recovery score, and sleep quality interpreted in the context of your adaptation, not just raw numbers.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Connect Whoop', 'Connect Oura Ring'] as const).map((label) => (
                  <button
                    key={label}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 12, fontSize: 12,
                      background: 'transparent', border: '0.5px solid #2a2d45', color: '#378ADD',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={CARD}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#5DCAA5' }}>✓</span>
                <span style={{ fontSize: 11, color: '#5a5f80' }}>
                  {profile.integrations.whoop ? 'Whoop' : 'Oura'} · synced recently
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#9ca0bc', lineHeight: 1.6 }}>
                Recovery data connected. Biometric interpretation will appear here once your device syncs.
              </p>
            </div>
          )}
        </section>

        {/* ── Section 5: Performance ──────────────────────────────────────── */}
        <section>
          <p style={SECTION_LABEL}>Performance · Via Strava</p>

          {!stravaConnected ? (
            <div style={CARD}>
              <p style={{ fontSize: 13, color: '#9ca0bc', lineHeight: 1.6, marginBottom: 14 }}>
                Connect Strava to see how altitude is affecting your training — effort efficiency by elevation band, training load trends, and HR-adjusted performance tracking across your activity types.
              </p>
              <a
                href="/api/integrations/strava/connect"
                style={{
                  display: 'block', textAlign: 'center', padding: '10px 14px',
                  borderRadius: 12, fontSize: 12, background: 'transparent',
                  border: '0.5px solid #2a2d45', color: '#378ADD', textDecoration: 'none',
                }}
              >
                Connect Strava
              </a>
            </div>
          ) : (
            <div style={CARD}>
              {stravaLoading && (
                <p style={{ fontSize: 13, color: '#5a5f80', textAlign: 'center', padding: '12px 0' }}>
                  Loading Strava data…
                </p>
              )}

              {stravaStats && !stravaLoading && (
                <>
                  {/* Stat row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div style={{ ...INNER, padding: '12px 10px', textAlign: 'center' }}>
                      <p style={{ fontSize: 20, fontWeight: 500, color: '#e8eaf6', margin: 0 }}>
                        {formatElevation(stravaStats.weeklyElevationFt, units)}
                      </p>
                      <p style={{ fontSize: 11, color: '#5a5f80', marginTop: 2 }}>ft gained · 7 days</p>
                      <p style={{ fontSize: 10, color: '#378ADD', marginTop: 2 }}>On track</p>
                    </div>
                    <div style={{ ...INNER, padding: '12px 10px', textAlign: 'center' }}>
                      <p style={{ fontSize: 20, fontWeight: 500, color: '#e8eaf6', margin: 0 }}>
                        {stravaStats.weeklyLoadScore}
                      </p>
                      <p style={{ fontSize: 11, color: '#5a5f80', marginTop: 2 }}>Training load</p>
                      <p style={{ fontSize: 10, color: trend.color, marginTop: 2 }}>{trend.label}</p>
                    </div>
                  </div>

                  {/* Load badge */}
                  <div style={{ marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, borderRadius: 20, padding: '4px 10px',
                      background: 'rgba(93,202,165,0.10)', border: '0.5px solid rgba(93,202,165,0.25)', color: '#5DCAA5',
                    }}>
                      {activeGoal
                        ? (trend.label === 'Building' ? `Building toward ${activeGoal.name}` : `${trend.label} — ${daysUntilGoal} days to ${activeGoal.name}`)
                        : 'Stable training load this week'}
                    </span>
                  </div>

                  {/* Most recent activity */}
                  {stravaStats.recentActivities.length > 0 && (() => {
                    const a = stravaStats.recentActivities[0]
                    return (
                      <div style={{ ...INNER, padding: '10px 12px' }}>
                        <p style={{ fontSize: 12, color: '#9ca0bc', margin: 0 }}>
                          <strong style={{ color: '#e8eaf6' }}>{a.type}</strong>
                          {' '}·{' '}
                          {a.days_ago === 0 ? 'Today' : a.days_ago === 1 ? 'Yesterday' : `${a.days_ago}d ago`}
                          {' · '}{a.distance_mi} mi
                          {' · '}{formatElevation(a.elevation_ft, units)} gain
                          {' · '}
                          <strong style={{ color: '#e8eaf6' }}>Effort consistent with your recent baseline.</strong>
                        </p>
                      </div>
                    )
                  })()}
                </>
              )}

              {!stravaStats && !stravaLoading && (
                <p style={{ fontSize: 13, color: '#5a5f80', textAlign: 'center', padding: '12px 0' }}>
                  No recent Strava activities found.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Section 6: Altitude insights ────────────────────────────────── */}
        <section>
          <p style={SECTION_LABEL}>Altitude Insights</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.slice(0, 3).map((insight) => {
              const accent = insightAccent(insight.id)
              const trigger = insightTrigger(insight, checkins)
              return (
                <div
                  key={insight.id}
                  style={{
                    background: '#181b30',
                    border: '0.5px solid #2a2d45',
                    borderRadius: 12,
                    borderLeft: `3px solid ${accent}`,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '14px 16px 14px 14px' }}>
                    {/* Trigger block */}
                    <div style={{ ...INNER, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: `${accent}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                      }}>
                        {insight.icon}
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca0bc', margin: 0, lineHeight: 1.4 }}>
                        {trigger}
                      </p>
                    </div>

                    {/* Title */}
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', marginBottom: 6 }}>
                      {insight.title}
                    </p>

                    {/* Body */}
                    <p style={{ fontSize: 12, color: '#6b708c', lineHeight: 1.6, marginBottom: 10 }}>
                      {insight.body}
                    </p>

                    {/* Attribution */}
                    <div style={{ borderTop: '0.5px solid #1e2240', paddingTop: 8 }}>
                      <p style={{ fontSize: 11, color: '#3a3f60', margin: 0 }}>
                        From your profile data · Altitude Base Camp
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
