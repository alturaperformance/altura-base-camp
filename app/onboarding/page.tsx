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
import type { Lifestyle } from '@/types/profile'
import type { GoalFormData } from '@/types/goal'

type Step = 'q1' | 'q1a' | 'q2' | 'q3' | 'q4' | 'done'

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const { updateProfile, setGoal } = useAppStore()

  const [step, setStep] = useState<Step>('q1')
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null)

  if (step === 'q1') {
    return (
      <OnboardingShell step={1} totalSteps={TOTAL_STEPS} onBack={() => router.push('/login')}>
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
      <OnboardingShell step={3} totalSteps={TOTAL_STEPS} onBack={() => setStep('q2')}>
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
      <OnboardingShell step={4} totalSteps={TOTAL_STEPS} onBack={() => setStep('q3')}>
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
