import type { Symptom } from '@/types/profile'
import type { CheckinQuestion } from '@/types/checkin'

// Default question sets by primary profile lifestyle
const QUESTION_SETS: Record<string, CheckinQuestion[]> = {
  serious_trainer: [
    { field: 'energy', label: 'Energy' },
    { field: 'sleep_quality', label: 'Sleep quality' },
    { field: 'breathlessness', label: 'Breathlessness' },
  ],
  weekend_warrior: [
    { field: 'energy', label: 'Energy' },
    { field: 'sleep_quality', label: 'Sleep quality' },
    { field: 'headache', label: 'Headache' },
  ],
  daily_local: [
    { field: 'energy', label: 'Energy' },
    { field: 'mental_clarity', label: 'Mental clarity' },
    { field: 'hydration', label: 'Hydration' },
  ],
  event_prep: [
    { field: 'energy', label: 'Energy' },
    { field: 'breathlessness', label: 'Breathlessness' },
    { field: 'hydration', label: 'Hydration' },
  ],
}

// Symptom-to-field mapping for programmatic question selection
const SYMPTOM_FIELD_MAP: Partial<Record<Symptom, CheckinQuestion>> = {
  fatigue: { field: 'energy', label: 'Energy' },
  poor_sleep: { field: 'sleep_quality', label: 'Sleep quality' },
  breathlessness: { field: 'breathlessness', label: 'Breathlessness' },
  brain_fog: { field: 'mental_clarity', label: 'Mental clarity' },
  dry_mouth: { field: 'hydration', label: 'Hydration' },
  headache: { field: 'headache', label: 'Headache' },
}

export function getCheckinQuestions(
  lifestyle: string | null,
  symptoms: Symptom[]
): CheckinQuestion[] {
  // Start from the default set for the lifestyle
  const base = QUESTION_SETS[lifestyle ?? 'daily_local'] ?? QUESTION_SETS.daily_local

  // If user has specific symptom flags, prioritize those questions
  if (symptoms.length > 0 && !symptoms.includes('none')) {
    const symptomQuestions: CheckinQuestion[] = []
    const seen = new Set<string>()

    for (const symptom of symptoms.slice(0, 3)) {
      const q = SYMPTOM_FIELD_MAP[symptom]
      if (q && !seen.has(q.field)) {
        symptomQuestions.push(q)
        seen.add(q.field)
      }
      if (symptomQuestions.length === 3) break
    }

    if (symptomQuestions.length === 3) return symptomQuestions

    // Fill remaining with base set
    for (const q of base) {
      if (!seen.has(q.field)) {
        symptomQuestions.push(q)
        seen.add(q.field)
        if (symptomQuestions.length === 3) break
      }
    }

    return symptomQuestions.slice(0, 3)
  }

  return base.slice(0, 3)
}
