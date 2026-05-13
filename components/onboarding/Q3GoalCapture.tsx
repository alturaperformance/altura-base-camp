'use client'

import { useState } from 'react'
import type { GoalFormData, ActivityType } from '@/types/goal'

const ACTIVITIES: { value: ActivityType; label: string }[] = [
  { value: 'hiking', label: 'Hiking' },
  { value: 'trail_running', label: 'Trail running' },
  { value: 'skiing', label: 'Skiing / snowboarding' },
  { value: 'mountaineering', label: 'Mountaineering / climbing' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'camping', label: 'Camping / backpacking' },
  { value: 'other', label: 'Other' },
]

interface Q3GoalCaptureProps {
  onNext: (data: GoalFormData | null) => void
  onBack: () => void
}

export function Q3GoalCapture({ onNext, onBack }: Q3GoalCaptureProps) {
  const [goalType, setGoalType] = useState<'event' | 'trip' | 'none' | null>(null)
  const [form, setForm] = useState<Partial<GoalFormData>>({})
  const [activities, setActivities] = useState<ActivityType[]>([])

  function toggleActivity(a: ActivityType) {
    setActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  function canContinue(): boolean {
    if (goalType === 'none') return true
    if (!goalType) return false
    if (!form.name || !form.date || !form.location) return false
    return true
  }

  function handleNext() {
    if (goalType === 'none') {
      onNext(null)
      return
    }
    if (!goalType || !form.name || !form.date || !form.location) return
    onNext({
      type: goalType,
      name: form.name,
      date: form.date,
      location: form.location,
      max_elevation_ft: form.max_elevation_ft ?? '',
      activities,
      other_activity: form.other_activity ?? '',
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 mt-2">
        Is there something specific you&apos;re working toward?
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        This helps us build a timeline and prep recommendations around your goal.
      </p>

      <div className="space-y-3 mb-6">
        {[
          { value: 'event' as const, label: "Yes, I'm training for an event", icon: '🏆' },
          { value: 'trip' as const, label: "Yes, I'm planning a trip", icon: '🏔️' },
          { value: 'none' as const, label: 'No specific goal right now', icon: '⏳' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setGoalType(opt.value)}
            className={[
              'w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all',
              goalType === opt.value
                ? 'bg-blue-600/15 border-blue-600/50'
                : 'bg-navy-700 border-slate-700/50 hover:border-slate-600',
            ].join(' ')}
          >
            <span className="text-xl">{opt.icon}</span>
            <span className={`text-sm font-medium ${goalType === opt.value ? 'text-blue-300' : 'text-white'}`}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {(goalType === 'event' || goalType === 'trip') && (
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {goalType === 'event' ? 'Event name' : 'Destination'} *
            </label>
            <input
              type="text"
              value={form.name ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={goalType === 'event' ? 'e.g. Leadville 100' : 'e.g. Rocky Mountain National Park'}
              className="w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {goalType === 'event' ? 'Event date' : 'Trip date'} *
            </label>
            <input
              type="date"
              value={form.date ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600/50 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Location *
            </label>
            <input
              type="text"
              value={form.location ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Leadville, CO"
              className="w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Max elevation (optional)
            </label>
            <input
              type="text"
              value={form.max_elevation_ft ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, max_elevation_ft: e.target.value }))}
              placeholder="e.g. 12,600 ft"
              className="w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Activities (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleActivity(a.value)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    activities.includes(a.value)
                      ? 'bg-blue-600/15 border-blue-600/50 text-blue-300'
                      : 'bg-navy-700 border-slate-700/50 text-slate-400 hover:border-slate-500',
                  ].join(' ')}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          disabled={!canContinue()}
          onClick={handleNext}
          className={[
            'w-full py-4 rounded-2xl text-sm font-bold transition-all',
            canContinue()
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
              : 'bg-navy-700 text-slate-500 border border-slate-700/50 cursor-not-allowed',
          ].join(' ')}
        >
          Continue →
        </button>
        <button onClick={onBack} className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}
