import type { AppContext } from '@/types/insights'

type SymptomKey =
  | 'poor_sleep' | 'breathlessness' | 'fatigue' | 'headache'
  | 'brain_fog' | 'elevated_hr' | 'nausea' | 'dizziness'
  | 'appetite_loss' | 'dry_mouth'

const SYMPTOM_PROMPTS: Partial<Record<SymptomKey, string>> = {
  poor_sleep: "Why is my sleep so disrupted at altitude and what can I do about it?",
  breathlessness: "How should I adjust my training intensity at my elevation?",
  fatigue: "Why am I so tired and how long will this last?",
  headache: "What's the best way to manage altitude headaches?",
  brain_fog: "How does altitude affect mental clarity and what helps?",
  elevated_hr: "My heart rate is running high — is that normal at altitude?",
}

const LIFESTYLE_FALLBACKS: Record<string, string[]> = {
  serious_trainer: [
    "What's the optimal training intensity at my elevation?",
    "How long before I'm fully adapted to altitude?",
  ],
  weekend_warrior: [
    "How do I prepare my body before a mountain trip?",
    "What should I eat and drink on a big mountain day?",
  ],
  daily_local: [
    "What habits matter most for living well at altitude long-term?",
    "How can I tell if altitude is affecting my day-to-day performance?",
  ],
  event_prep: [
    "How many days before my event should I arrive at altitude?",
    "What's the most important prep I can do right now?",
  ],
}

export function generateSuggestedPrompts(context: AppContext): string[] {
  const prompts: string[] = []

  // 1. Goal-proximity prompts (highest priority)
  if (context.activeGoal && context.daysUntilGoal !== null) {
    if (context.daysUntilGoal <= 7) {
      prompts.push(`What should I focus on in my final ${context.daysUntilGoal} days before ${context.activeGoal.name}?`)
      prompts.push(`What should I eat the day before ${context.activeGoal.name}?`)
    } else if (context.daysUntilGoal <= 30) {
      prompts.push(`How should I structure my training this week for ${context.activeGoal.name}?`)
      prompts.push(`Am I on track for ${context.activeGoal.name} based on my recent training?`)
    } else {
      prompts.push(`What's the most important thing I can do now to prepare for ${context.activeGoal.name}?`)
    }
  }

  // 2. Biometric prompts
  if (context.integrations.whoop || context.integrations.oura) {
    prompts.push("What does my recovery data tell me about how I'm adapting to altitude?")
  }

  // 3. Symptom prompt (one max)
  for (const symptom of context.profile.symptoms) {
    const p = SYMPTOM_PROMPTS[symptom as SymptomKey]
    if (p) {
      prompts.push(p)
      break
    }
  }

  // 4. Strava prompt
  if (context.integrations.strava) {
    prompts.push("How is altitude affecting my training performance based on my recent activities?")
  }

  // 5. Lifestyle fallback (fill to 3 minimum)
  if (prompts.length < 3 && context.profile.lifestyle) {
    const fallbacks = LIFESTYLE_FALLBACKS[context.profile.lifestyle] ?? []
    prompts.push(...fallbacks)
  }

  return Array.from(new Set(prompts)).slice(0, 4)
}
