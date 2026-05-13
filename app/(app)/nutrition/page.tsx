'use client'

import { useAppStore } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'

const NUTRITION_GUIDE = [
  {
    category: 'Hydration',
    icon: '💧',
    items: [
      {
        title: 'Daily baseline: 3–4 liters',
        body: 'At altitude, dry air accelerates fluid loss through respiration. Aim for at least 3 liters even on rest days, 4+ on active days.',
      },
      {
        title: 'Electrolytes matter more at elevation',
        body: 'Increased respiration and urination deplete sodium, potassium, and magnesium faster. Include electrolyte-rich foods with each meal.',
      },
      {
        title: "Thirst lags — don't wait for it",
        body: 'Thirst is a lagging indicator of dehydration at altitude. Schedule water intake: a glass on waking, one per hour of activity, one before bed.',
      },
    ],
  },
  {
    category: 'Fueling',
    icon: '🌾',
    items: [
      {
        title: 'Carbohydrates are your altitude fuel',
        body: 'Carbs require less oxygen to metabolize than fat. Leaning toward carb-forward meals — especially pre-activity — helps maintain energy output when oxygen is limited.',
      },
      {
        title: 'Iron supports adaptation',
        body: 'Your body produces more red blood cells at altitude to carry oxygen. Iron is the raw material — prioritize lean meat, legumes, and leafy greens.',
      },
      {
        title: 'Appetite suppression is common',
        body: 'Altitude suppresses appetite hormones. Even if hunger signals are weak, eating enough — especially carbohydrates — maintains energy and supports acclimatization.',
      },
    ],
  },
  {
    category: 'Timing',
    icon: '⏱️',
    items: [
      {
        title: 'Pre-activity: 2–3 hours before',
        body: 'Eat a balanced meal 2–3 hours before activity. If exercising early morning, a small carb-forward snack 30–60 minutes before helps.',
      },
      {
        title: 'Recovery window: within 2 hours',
        body: 'A 3:1 carb-to-protein ratio in the 2-hour post-activity window maximizes glycogen replenishment — especially important at altitude where recovery is slower.',
      },
    ],
  },
]

export default function NutritionPage() {
  const { profile } = useAppStore()

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Nutrition</h1>
        <p className="text-sm text-slate-400 mt-1">
          Altitude-specific fueling and hydration guidance at {profile?.home_elevation_ft.toLocaleString() ?? '—'} ft
        </p>
      </div>

      <div className="space-y-6">
        {NUTRITION_GUIDE.map((section) => (
          <div key={section.category}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.category}
            </p>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <Card key={i}>
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
