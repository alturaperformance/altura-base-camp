'use client'

import { useState } from 'react'
import type { Checkin } from '@/types/checkin'

// ── Question definitions ───────────────────────────────────────────────────

const QUESTIONS = [
  {
    field: 'energy' as const,
    label: 'Energy level',
    max: 5,
    labels: ['Exhausted', 'Low', 'Moderate', 'Good', 'Strong'],
    colors: ['#ef4444', '#f59e0b', '#94a3b8', '#22c55e', '#22c55e'], // red, amber, neutral, green, green
    trackColors: ['#dc2626', '#d97706', '#475569', '#16a34a', '#16a34a'],
  },
  {
    field: 'sleep_quality' as const,
    label: 'Sleep quality',
    max: 5,
    labels: ['Terrible', 'Poor', 'Okay', 'Good', 'Great'],
    colors: ['#ef4444', '#f59e0b', '#94a3b8', '#22c55e', '#22c55e'],
    trackColors: ['#dc2626', '#d97706', '#475569', '#16a34a', '#16a34a'],
  },
  {
    field: 'breathlessness' as const,
    label: 'Breathlessness',
    max: 5,
    labels: ['Severe', 'Noticeable', 'Mild', 'Minimal', 'None'],
    colors: ['#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e'],
    trackColors: ['#dc2626', '#d97706', '#d97706', '#16a34a', '#16a34a'],
  },
  {
    field: 'hydration_yesterday' as const,
    label: 'Hydration yesterday',
    max: 4,
    labels: ['Under 1L', '1–2L', '2–3L', '3L or more'],
    colors: ['#ef4444', '#f59e0b', '#22c55e', '#22c55e'],
    trackColors: ['#dc2626', '#d97706', '#16a34a', '#16a34a'],
  },
  {
    field: 'training_today' as const,
    label: 'Training today',
    max: 5,
    labels: ['Rest day', 'Active recovery', 'Easy', 'Moderate', 'Hard'],
    colors: ['#94a3b8', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
    trackColors: ['#475569', '#2563eb', '#16a34a', '#d97706', '#dc2626'],
  },
] as const

type QuestionField = typeof QUESTIONS[number]['field']
type CheckinValues = Record<QuestionField, number | null>

interface CheckInSectionProps {
  checkins: Checkin[]
  checkinToday: boolean
  onSubmit: (values: CheckinValues) => void
}

function getStreakMessage(count: number): string {
  if (count >= 30) return `Logged. ${count}-day streak. Your pattern data is strong.`
  if (count >= 10) return `Logged. ${count} days of data and counting.`
  if (count >= 5) return `Done for today. ${count}-day streak — keep it going.`
  return 'Check-in logged. Your data is working for you.'
}

function getValueLabel(q: typeof QUESTIONS[number], value: number): string {
  return q.labels[value - 1] ?? ''
}

function getPillColor(q: typeof QUESTIONS[number], value: number | null): string {
  if (value === null) return 'bg-slate-800 text-slate-500'
  const color = q.colors[value - 1]
  if (color === '#ef4444') return 'bg-red-500/20 text-red-400'
  if (color === '#f59e0b') return 'bg-amber-500/20 text-amber-400'
  if (color === '#22c55e') return 'bg-green-500/20 text-green-400'
  if (color === '#3b82f6') return 'bg-blue-500/20 text-blue-400'
  return 'bg-slate-700 text-slate-300'
}

function getTrackColor(q: typeof QUESTIONS[number], value: number | null): string {
  if (value === null) return '#1e293b'
  return q.trackColors[value - 1] ?? '#1e293b'
}

export function CheckInSection({ checkins, checkinToday, onSubmit }: CheckInSectionProps) {
  const [values, setValues] = useState<CheckinValues>({
    energy: null,
    sleep_quality: null,
    breathlessness: null,
    hydration_yesterday: null,
    training_today: null,
  })

  const allAnswered = QUESTIONS.every((q) => values[q.field] !== null)

  // Post-submission confirmation
  if (checkinToday) {
    const todayCheckin = checkins[checkins.length - 1]
    const streak = checkins.length
    const msg = getStreakMessage(streak)

    const summaryParts = [
      todayCheckin?.energy !== null ? `Energy ${QUESTIONS[0].labels[(todayCheckin.energy ?? 1) - 1]}` : null,
      todayCheckin?.sleep_quality !== null ? `Sleep ${QUESTIONS[1].labels[(todayCheckin.sleep_quality ?? 1) - 1]}` : null,
      todayCheckin?.breathlessness !== null ? `Breathlessness ${QUESTIONS[2].labels[(todayCheckin.breathlessness ?? 1) - 1]}` : null,
      todayCheckin?.hydration_yesterday !== null ? `Hydration ${QUESTIONS[3].labels[(todayCheckin.hydration_yesterday ?? 1) - 1]}` : null,
      todayCheckin?.training_today !== null ? `Training ${QUESTIONS[4].labels[(todayCheckin.training_today ?? 1) - 1]}` : null,
    ].filter(Boolean)

    return (
      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
          <p className="text-sm font-semibold text-white mb-1">{msg}</p>
          {summaryParts.length > 0 && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {summaryParts.join(' · ')}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-5">
      <div className="rounded-2xl border border-slate-700/50 bg-navy-800/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          How are you feeling today?
        </p>

        <div className="space-y-5">
          {QUESTIONS.map((q) => {
            const val = values[q.field]
            const pct = val !== null ? ((val - 1) / (q.max - 1)) * 100 : 0
            const trackColor = getTrackColor(q, val)

            return (
              <div key={q.field}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">{q.label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPillColor(q, val)}`}>
                    {val !== null ? getValueLabel(q, val) : 'Drag to rate'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={q.max}
                  step={1}
                  value={val ?? 1}
                  onChange={(e) => setValues((prev) => ({ ...prev, [q.field]: Number(e.target.value) }))}
                  onMouseDown={() => {
                    if (values[q.field] === null) {
                      setValues((prev) => ({ ...prev, [q.field]: Math.ceil(q.max / 2) }))
                    }
                  }}
                  onTouchStart={() => {
                    if (values[q.field] === null) {
                      setValues((prev) => ({ ...prev, [q.field]: Math.ceil(q.max / 2) }))
                    }
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                  style={{
                    background: val !== null
                      ? `linear-gradient(to right, ${trackColor} ${pct}%, #1e293b ${pct}%)`
                      : '#1e293b',
                  }}
                />
              </div>
            )
          })}
        </div>

        <button
          onClick={() => { if (allAnswered) onSubmit(values) }}
          disabled={!allAnswered}
          className={[
            'w-full mt-5 py-3 rounded-xl text-sm font-semibold transition-all',
            allAnswered
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed',
          ].join(' ')}
        >
          Log check-in
        </button>
      </div>
    </div>
  )
}
