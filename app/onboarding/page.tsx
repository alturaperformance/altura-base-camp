'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/demo-store'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { Q1Lifestyle } from '@/components/onboarding/Q1Lifestyle'
import { Q1aTrainingClarifier } from '@/components/onboarding/Q1aTrainingClarifier'
import { Q2Symptoms } from '@/components/onboarding/Q2Symptoms'
import { Q3GoalCapture } from '@/components/onboarding/Q3GoalCapture'
import { Q4Integrations } from '@/components/onboarding/Q4Integrations'
import type { Lifestyle, TrainingFrequency, ElevationBand, Symptom } from '@/types/profile'
import type { GoalFormData } from '@/types/goal'

type Step = 'name' | 'q1' | 'q1a' | 'q2' | 'q3' | 'q4' | 'done'

const TOTAL_STEPS = 5

function stepNumber(step: Step): number {
  const order: Step[] = ['name', 'q1', 'q1a', 'q2', 'q3', 'q4']
  return order.indexOf(step) + 1
}

export default function OnboardingPage() {
  const router = useRouter()
  const { updateProfile, setGoal } = useAppStore()

  const [step, setStep] = useState<Step>('name')
  const [firstName, setFirstName] = useState('')
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null)

  // Name step
  if (step === 'name') {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col">
        <div className="h-0.5 bg-navy-700">
          <div className="h-full bg-blue-600 w-[5%] transition-all" />
        </div>
        <div className="flex-1 px-5 pt-12 pb-8">
          {/* Logo / brand */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-sm font-semibold text-slate-300">Altura Base Camp</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Altitude wellness,<br />built for you.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Personalized insights based on your elevation, habits, and goals. Takes about 2 minutes to set up.
            </p>
          </div>

          <div className="mb-8">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              autoFocus
              className="w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600/50 text-base"
            />
          </div>

          <button
            disabled={!firstName.trim()}
            onClick={() => {
              updateProfile({ first_name: firstName.trim() })
              setStep('q1')
            }}
            className={[
              'w-full py-4 rounded-2xl text-sm font-bold transition-all',
              firstName.trim()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                : 'bg-navy-700 text-slate-500 border border-slate-700/50 cursor-not-allowed',
            ].join(' ')}
          >
            Get started →
          </button>
        </div>
      </div>
    )
  }

  if (step === 'q1') {
    return (
      <OnboardingShell step={1} totalSteps={TOTAL_STEPS} onBack={() => setStep('name')}>
        <Q1Lifestyle
          onNext={(value) => {
            setLifestyle(value)
            updateProfile({ lifestyle: value })
            if (value === 'serious_trainer') {
              setStep('q1a')
            } else {
              setStep('q2')
            }
          }}
        />
      </OnboardingShell>
    )
  }

  if (step === 'q1a') {
    return (
      <OnboardingShell step={2} totalSteps={TOTAL_STEPS} onBack={() => setStep('q1')}>
        <Q1aTrainingClarifier
          onNext={(data) => {
            updateProfile({
              training: {
                frequency: data.frequency,
                elevation_band: data.elevation_band,
              },
            })
            setStep('q2')
          }}
          onBack={() => setStep('q1')}
        />
      </OnboardingShell>
    )
  }

  if (step === 'q2') {
    return (
      <OnboardingShell
        step={lifestyle === 'serious_trainer' ? 3 : 2}
        totalSteps={TOTAL_STEPS}
        onBack={() => (lifestyle === 'serious_trainer' ? setStep('q1a') : setStep('q1'))}
      >
        <Q2Symptoms
          onNext={(symptoms) => {
            updateProfile({ symptoms })
            setStep('q3')
          }}
          onBack={() => (lifestyle === 'serious_trainer' ? setStep('q1a') : setStep('q1'))}
        />
      </OnboardingShell>
    )
  }

  if (step === 'q3') {
    return (
      <OnboardingShell step={4} totalSteps={TOTAL_STEPS} onBack={() => setStep('q2')}>
        <Q3GoalCapture
          onNext={(goalData: GoalFormData | null) => {
            if (goalData) {
              const goal = {
                id: `goal-${Date.now()}`,
                user_id: 'demo-user',
                type: goalData.type,
                name: goalData.name,
                date: goalData.date,
                location: goalData.location,
                max_elevation_ft: goalData.max_elevation_ft
                  ? parseInt(goalData.max_elevation_ft.replace(/\D/g, ''), 10)
                  : null,
                activities: goalData.activities,
                other_activity: goalData.other_activity || null,
                is_active: true,
                completed_at: null,
                created_at: new Date().toISOString(),
              }
              setGoal(goal)
            }
            setStep('q4')
          }}
          onBack={() => setStep('q2')}
        />
      </OnboardingShell>
    )
  }

  if (step === 'q4') {
    return (
      <OnboardingShell step={5} totalSteps={TOTAL_STEPS} onBack={() => setStep('q3')}>
        <Q4Integrations
          onNext={(connected) => {
            updateProfile({
              integrations: connected,
              onboarding_complete: true,
            })
            router.push('/home')
          }}
          onBack={() => setStep('q3')}
        />
      </OnboardingShell>
    )
  }

  return null
}
