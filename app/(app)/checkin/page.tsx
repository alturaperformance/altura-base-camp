'use client'

import { useRouter } from 'next/navigation'
import { useAppStore, getCheckinToday } from '@/lib/demo-store'
import { getCheckinQuestions } from '@/lib/checkin-questions'
import { CheckInCard } from '@/components/cards/CheckInCard'
import { todayISO } from '@/lib/date-utils'

export default function CheckinPage() {
  const router = useRouter()
  const { profile, checkins, addCheckin } = useAppStore()
  const alreadyDone = getCheckinToday(checkins)

  if (!profile) return null

  const questions = getCheckinQuestions(profile.lifestyle, profile.symptoms)

  if (alreadyDone) {
    return (
      <div className="max-w-md mx-auto px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Check-in</h1>
        <div className="rounded-2xl bg-navy-700 border border-slate-700/40 p-8 text-center">
          <span className="text-4xl mb-3 block">✅</span>
          <h3 className="text-base font-semibold text-white mb-1">Today&apos;s check-in logged</h3>
          <p className="text-sm text-slate-400">Come back tomorrow to log your next check-in.</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-4 px-6 py-2.5 bg-navy-600 text-slate-300 text-sm font-medium rounded-xl hover:bg-navy-500 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Check-in</h1>
        <p className="text-sm text-slate-400 mt-1">How are you feeling today?</p>
      </div>

      <CheckInCard
        questions={questions}
        streakCount={checkins.length}
        onSubmit={(values) => {
          addCheckin({
            user_id: profile.id,
            date: todayISO(),
            energy: values.energy ?? null,
            sleep_quality: values.sleep_quality ?? null,
            breathlessness: values.breathlessness ?? null,
            mental_clarity: values.mental_clarity ?? null,
            hydration: values.hydration ?? null,
            headache: values.headache ?? null,
            notes: null,
          })
          router.push('/home')
        }}
      />
    </div>
  )
}
