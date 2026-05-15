'use client'

import { useState } from 'react'
import type { Checkin } from '@/types/checkin'

// ── Design tokens ──────────────────────────────────────────────────────────────
const CARD_BG = '#181b30'
const CARD_BORDER = '0.5px solid #2a2d45'
const INNER_BG = '#1e2240'
const INNER_BORDER = '0.5px solid #2a2d45'

type PillVariant = 'red' | 'amber' | 'green' | 'blue' | 'neutral'

const PILL: Record<PillVariant, { text: string; border: string; bg: string }> = {
  red:     { text: '#E24B4A', border: 'rgba(226,75,74,0.3)',    bg: 'rgba(226,75,74,0.1)' },
  amber:   { text: '#EF9F27', border: 'rgba(239,159,39,0.3)',   bg: 'rgba(239,159,39,0.1)' },
  green:   { text: '#5DCAA5', border: 'rgba(93,202,165,0.3)',   bg: 'rgba(93,202,165,0.1)' },
  blue:    { text: '#378ADD', border: 'rgba(55,138,221,0.3)',   bg: 'rgba(55,138,221,0.1)' },
  neutral: { text: '#9ca0bc', border: '#2a2d45',                bg: 'transparent' },
}

// ── Question definitions ───────────────────────────────────────────────────────
const QUESTIONS = [
  {
    field: 'energy' as const,
    label: 'Energy level',
    max: 5,
    labels: ['Exhausted', 'Low', 'Moderate', 'Good', 'Strong'],
    variants: ['red', 'amber', 'neutral', 'green', 'green'] as PillVariant[],
  },
  {
    field: 'sleep_quality' as const,
    label: 'Sleep quality',
    max: 5,
    labels: ['Terrible', 'Poor', 'Okay', 'Good', 'Great'],
    variants: ['red', 'amber', 'neutral', 'green', 'green'] as PillVariant[],
  },
  {
    field: 'breathlessness' as const,
    label: 'Breathlessness',
    max: 5,
    labels: ['Severe', 'Noticeable', 'Mild', 'Minimal', 'None'],
    variants: ['red', 'amber', 'amber', 'green', 'green'] as PillVariant[],
  },
  {
    field: 'hydration_yesterday' as const,
    label: 'Hydration yesterday',
    max: 4,
    labels: ['Under 1L', '1–2L', '2–3L', '3L or more'],
    variants: ['red', 'amber', 'green', 'green'] as PillVariant[],
  },
  {
    field: 'training_today' as const,
    label: 'Training today',
    max: 5,
    labels: ['Rest day', 'Active recovery', 'Easy', 'Moderate', 'Hard'],
    variants: ['neutral', 'blue', 'green', 'amber', 'red'] as PillVariant[],
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

export function CheckInSection({ checkins, checkinToday, onSubmit }: CheckInSectionProps) {
  const [values, setValues] = useState<CheckinValues>({
    energy: null,
    sleep_quality: null,
    breathlessness: null,
    hydration_yesterday: null,
    training_today: null,
  })

  const allAnswered = QUESTIONS.every((q) => values[q.field] !== null)
  const streak = checkins.length

  // Post-submission state
  if (checkinToday) {
    const today = checkins[checkins.length - 1]
    const summaryParts = [
      today?.energy !== null && today?.energy !== undefined
        ? `Energy ${QUESTIONS[0].labels[(today.energy ?? 1) - 1]}` : null,
      today?.sleep_quality !== null && today?.sleep_quality !== undefined
        ? `Sleep ${QUESTIONS[1].labels[(today.sleep_quality ?? 1) - 1]}` : null,
      today?.breathlessness !== null && today?.breathlessness !== undefined
        ? `Breathlessness ${QUESTIONS[2].labels[(today.breathlessness ?? 1) - 1]}` : null,
      today?.hydration_yesterday !== null && today?.hydration_yesterday !== undefined
        ? `Hydration ${QUESTIONS[3].labels[(today.hydration_yesterday ?? 1) - 1]}` : null,
      today?.training_today !== null && today?.training_today !== undefined
        ? `Training ${QUESTIONS[4].labels[(today.training_today ?? 1) - 1]}` : null,
    ].filter(Boolean)

    return (
      <div style={{ borderRadius: 16, background: CARD_BG, border: CARD_BORDER, padding: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', marginBottom: 6 }}>
          {getStreakMessage(streak)}
        </p>
        {summaryParts.length > 0 && (
          <p style={{ fontSize: 12, color: '#6b708c', lineHeight: 1.5 }}>
            {summaryParts.join(' · ')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 16, background: CARD_BG, border: CARD_BORDER, padding: 16 }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6' }}>
          How are you feeling today?
        </span>
        {streak > 0 && (
          <span style={{
            fontSize: 12, color: '#5DCAA5',
            background: 'rgba(93,202,165,0.12)', border: '0.5px solid rgba(93,202,165,0.25)',
            borderRadius: 20, padding: '3px 10px',
          }}>
            🔥 {streak}-day streak
          </span>
        )}
      </div>

      {/* Question blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {QUESTIONS.map((q) => {
          const val = values[q.field]
          const hasValue = val !== null
          const variant: PillVariant = hasValue ? q.variants[val - 1] : 'neutral'
          const pillStyle = PILL[variant]
          const pct = hasValue ? ((val - 1) / (q.max - 1)) * 100 : 0
          const trackFill = hasValue ? pillStyle.text : '#2a2d45'

          return (
            <div
              key={q.field}
              style={{ background: INNER_BG, border: INNER_BORDER, borderRadius: 12, padding: '14px 16px' }}
            >
              {/* Label row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#9ca0bc' }}>{q.label}</span>
                <span style={{
                  fontSize: 11, borderRadius: 20, padding: '3px 10px',
                  border: `0.5px solid ${hasValue ? pillStyle.border : '#2a2d45'}`,
                  background: hasValue ? pillStyle.bg : 'transparent',
                  color: hasValue ? pillStyle.text : '#5a5f80',
                }}>
                  {hasValue ? q.labels[val - 1] : 'Drag to rate'}
                </span>
              </div>

              {/* Slider + endpoint labels */}
              <div style={{ position: 'relative' }}>
                <input
                  type="range"
                  min={1}
                  max={q.max}
                  step={1}
                  value={val ?? 1}
                  onChange={(e) => setValues((prev) => ({ ...prev, [q.field]: Number(e.target.value) }))}
                  onMouseDown={() => {
                    if (!hasValue) setValues((prev) => ({ ...prev, [q.field]: Math.ceil(q.max / 2) }))
                  }}
                  onTouchStart={() => {
                    if (!hasValue) setValues((prev) => ({ ...prev, [q.field]: Math.ceil(q.max / 2) }))
                  }}
                  style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 4,
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    background: `linear-gradient(to right, ${trackFill} ${pct}%, #2a2d45 ${pct}%)`,
                    // Thumb styling via CSS class below
                  }}
                  className="altura-slider"
                />
                <style>{`
                  .altura-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid ${trackFill};
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                  }
                  .altura-slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid ${trackFill};
                    cursor: pointer;
                  }
                `}</style>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#3a3f60' }}>1</span>
                <span style={{ fontSize: 10, color: '#3a3f60' }}>{q.max}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit button */}
      <button
        onClick={() => { if (allAnswered) onSubmit(values) }}
        style={{
          width: '100%',
          marginTop: 12,
          padding: 14,
          borderRadius: 12,
          background: '#0F5AC2',
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          cursor: allAnswered ? 'pointer' : 'default',
          opacity: allAnswered ? 1 : 0.4,
          pointerEvents: allAnswered ? 'auto' : 'none',
        }}
      >
        Log check-in
      </button>
    </div>
  )
}
