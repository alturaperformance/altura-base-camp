export type ArticleCategory = 'acclimatization' | 'training' | 'nutrition' | 'science'

export type ArticleTag =
  | 'poor_sleep' | 'headache' | 'breathlessness' | 'fatigue'
  | 'nausea' | 'dizziness' | 'elevated_hr' | 'brain_fog'
  | 'appetite_loss' | 'dry_mouth'
  | 'serious_trainer' | 'weekend_warrior' | 'daily_local' | 'event_prep'
  | 'strava_connected' | 'whoop_connected' | 'oura_connected'
  | 'goal_active' | 'goal_near'

export interface Article {
  id: string
  title: string
  url: string
  category: ArticleCategory
  tags: ArticleTag[]
  priority: number
}

const BASE = 'https://altitudeperformancelab.com/articles'

export const ARTICLES: Article[] = [
  // ── Acclimatization (30) ─────────────────────────────────────────────────
  { id: 'art-001', title: 'Why Sleep Suffers at Altitude', url: `${BASE}/why-sleep-suffers-altitude`, category: 'acclimatization', tags: ['poor_sleep'], priority: 5 },
  { id: 'art-002', title: 'Altitude and Sleep Apnea: Periodic Breathing', url: `${BASE}/altitude-sleep-apnea-periodic-breathing`, category: 'acclimatization', tags: ['poor_sleep'], priority: 4 },
  { id: 'art-003', title: 'Why You Get Headaches at Altitude', url: `${BASE}/why-headaches-altitude`, category: 'acclimatization', tags: ['headache'], priority: 5 },
  { id: 'art-004', title: 'How to Acclimatize to Altitude: Step-by-Step', url: `${BASE}/how-to-acclimatize-altitude`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 5 },
  { id: 'art-005', title: 'How Long Does It Take to Acclimatize', url: `${BASE}/how-long-acclimatize-altitude`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 5 },
  { id: 'art-006', title: 'Altitude Sickness Prevention', url: `${BASE}/altitude-sickness-prevention`, category: 'acclimatization', tags: ['headache', 'nausea', 'dizziness'], priority: 5 },
  { id: 'art-007', title: 'Recognizing AMS, HACE, and HAPE', url: `${BASE}/recognizing-ams-hace-hape`, category: 'acclimatization', tags: ['nausea', 'dizziness', 'headache'], priority: 4 },
  { id: 'art-008', title: 'Jet Lag and Altitude', url: `${BASE}/jet-lag-altitude`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-009', title: 'Re-Acclimatization After Returning Home', url: `${BASE}/re-acclimatization`, category: 'acclimatization', tags: ['event_prep', 'weekend_warrior'], priority: 3 },
  { id: 'art-010', title: 'Recovery at Altitude', url: `${BASE}/recovery-altitude`, category: 'acclimatization', tags: ['fatigue', 'poor_sleep'], priority: 4 },
  { id: 'art-011', title: 'Your First 24 Hours at Altitude', url: `${BASE}/first-24-hours-altitude`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-012', title: 'The 3-Day Altitude Window', url: `${BASE}/3-day-altitude-window`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-013', title: 'Gradual Ascent Protocols', url: `${BASE}/gradual-ascent-protocols`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-014', title: 'Returning to Sea Level: What Changes', url: `${BASE}/returning-sea-level`, category: 'acclimatization', tags: ['daily_local', 'event_prep'], priority: 3 },
  { id: 'art-015', title: 'Does Fitness Level Protect You at Altitude?', url: `${BASE}/does-fitness-protect-altitude`, category: 'acclimatization', tags: ['serious_trainer', 'weekend_warrior'], priority: 4 },
  { id: 'art-016', title: 'Altitude Myths Debunked', url: `${BASE}/altitude-myths-debunked`, category: 'acclimatization', tags: ['weekend_warrior', 'daily_local'], priority: 3 },
  { id: 'art-017', title: 'Acclimatization at Moderate Altitude (5,000–8,000 ft)', url: `${BASE}/acclimatization-moderate-altitude`, category: 'acclimatization', tags: ['daily_local', 'weekend_warrior'], priority: 4 },
  { id: 'art-018', title: 'High Altitude (10,000+ ft): What Your Body Experiences', url: `${BASE}/high-altitude-what-changes`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-019', title: 'Sleep at Altitude: Practical Strategies', url: `${BASE}/sleep-altitude-strategies`, category: 'acclimatization', tags: ['poor_sleep'], priority: 5 },
  { id: 'art-020', title: 'Altitude and Immune Function', url: `${BASE}/altitude-immune-function`, category: 'acclimatization', tags: ['fatigue', 'daily_local'], priority: 3 },
  { id: 'art-021', title: 'Altitude and Cardiovascular Health', url: `${BASE}/altitude-cardiovascular-health`, category: 'acclimatization', tags: ['elevated_hr', 'daily_local'], priority: 3 },
  { id: 'art-022', title: 'Altitude and Dehydration: A Hidden Risk', url: `${BASE}/altitude-dehydration-risk`, category: 'acclimatization', tags: ['headache', 'fatigue'], priority: 4 },
  { id: 'art-023', title: 'Preparing for Your First High-Altitude Trip', url: `${BASE}/first-high-altitude-trip`, category: 'acclimatization', tags: ['weekend_warrior'], priority: 5 },
  { id: 'art-024', title: 'Living at Altitude Long-Term', url: `${BASE}/living-altitude-long-term`, category: 'acclimatization', tags: ['daily_local'], priority: 4 },
  { id: 'art-025', title: 'How to Minimize Altitude Symptoms', url: `${BASE}/minimize-altitude-symptoms`, category: 'acclimatization', tags: ['headache', 'breathlessness', 'fatigue'], priority: 5 },
  { id: 'art-026', title: 'Altitude and Medication: What to Know', url: `${BASE}/altitude-medication`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 3 },
  { id: 'art-027', title: 'Children at Altitude', url: `${BASE}/children-altitude`, category: 'acclimatization', tags: ['weekend_warrior'], priority: 2 },
  { id: 'art-028', title: 'Altitude in Winter vs Summer', url: `${BASE}/altitude-winter-vs-summer`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 3 },
  { id: 'art-029', title: 'Altitude and Inflammation', url: `${BASE}/altitude-inflammation`, category: 'acclimatization', tags: ['fatigue', 'serious_trainer'], priority: 3 },
  { id: 'art-030', title: 'How Altitude Changes as You Stay Longer', url: `${BASE}/altitude-long-stay-changes`, category: 'acclimatization', tags: ['daily_local'], priority: 4 },

  // ── Training (32) ────────────────────────────────────────────────────────
  { id: 'art-031', title: 'Breathing Exercises to Prepare for Altitude', url: `${BASE}/breathing-exercises-altitude`, category: 'training', tags: ['breathlessness'], priority: 4 },
  { id: 'art-032', title: 'Altitude Training for Runners', url: `${BASE}/altitude-training-runners`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 5 },
  { id: 'art-033', title: 'Altitude Training for Cyclists', url: `${BASE}/altitude-training-cyclists`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 5 },
  { id: 'art-034', title: 'Altitude Training for Ultra Runners', url: `${BASE}/altitude-training-ultra-runners`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-035', title: 'Altitude Training for Climbers', url: `${BASE}/altitude-training-climbers`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-036', title: 'Power Meters at Altitude', url: `${BASE}/power-meters-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },
  { id: 'art-037', title: 'Lactate Testing at Altitude', url: `${BASE}/lactate-testing-altitude`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-038', title: 'Polarized Training at Altitude', url: `${BASE}/polarized-training-altitude`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-039', title: 'How to Periodize Altitude Training', url: `${BASE}/periodize-altitude-training`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-040', title: 'When to Race After an Altitude Camp', url: `${BASE}/race-after-altitude-camp`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-041', title: 'Race Pace Adjustment at Altitude', url: `${BASE}/race-pace-adjustment-altitude`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-042', title: 'How to Taper After an Altitude Camp', url: `${BASE}/taper-after-altitude-camp`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-043', title: 'Overtraining at Altitude', url: `${BASE}/overtraining-altitude`, category: 'training', tags: ['serious_trainer', 'elevated_hr'], priority: 4 },
  { id: 'art-044', title: 'Altitude Training for Female Athletes', url: `${BASE}/altitude-training-female-athletes`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-045', title: 'Zone 2 Training at Altitude', url: `${BASE}/zone-2-training-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },
  { id: 'art-046', title: 'Interval Training at Altitude', url: `${BASE}/interval-training-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },
  { id: 'art-047', title: 'Strength Training at Altitude', url: `${BASE}/strength-training-altitude`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-048', title: 'Heart Rate Zones at Altitude', url: `${BASE}/heart-rate-zones-altitude`, category: 'training', tags: ['serious_trainer', 'elevated_hr'], priority: 4 },
  { id: 'art-049', title: 'Skiing and Snowboarding at Altitude', url: `${BASE}/skiing-snowboarding-altitude`, category: 'training', tags: ['weekend_warrior'], priority: 3 },
  { id: 'art-050', title: 'Ski Touring and Skinning at Altitude', url: `${BASE}/ski-touring-altitude`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-051', title: 'Mountain Biking at Altitude', url: `${BASE}/mountain-biking-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 3 },
  { id: 'art-052', title: 'Trail Running at Altitude', url: `${BASE}/trail-running-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },
  { id: 'art-053', title: 'Hiking at Altitude: A Training Guide', url: `${BASE}/hiking-altitude-training`, category: 'training', tags: ['weekend_warrior', 'strava_connected'], priority: 4 },
  { id: 'art-054', title: 'Recovery Runs at Altitude', url: `${BASE}/recovery-runs-altitude`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-055', title: 'Long Runs at Altitude', url: `${BASE}/long-runs-altitude`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-056', title: 'RPE vs Heart Rate Training at Altitude', url: `${BASE}/rpe-vs-heart-rate-altitude`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-057', title: 'Reading Your Strava Data at Altitude', url: `${BASE}/strava-data-altitude`, category: 'training', tags: ['strava_connected'], priority: 5 },
  { id: 'art-058', title: 'Using a GPS Watch at Altitude', url: `${BASE}/gps-watch-altitude`, category: 'training', tags: ['strava_connected', 'serious_trainer'], priority: 3 },
  { id: 'art-059', title: 'How to Structure Your Training Week at Altitude', url: `${BASE}/training-week-altitude`, category: 'training', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-060', title: 'Racing at Altitude: A Complete Guide', url: `${BASE}/racing-altitude-guide`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-061', title: 'Altitude Training for Triathletes', url: `${BASE}/altitude-training-for-triathletes`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 5 },
  { id: 'art-062', title: 'How to Choose the Right Training Load at Altitude', url: `${BASE}/training-load-altitude`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },

  // ── Nutrition (28) ───────────────────────────────────────────────────────
  { id: 'art-063', title: 'Hydration at Altitude', url: `${BASE}/hydration-altitude`, category: 'nutrition', tags: ['headache', 'dry_mouth', 'fatigue'], priority: 5 },
  { id: 'art-064', title: 'Nutrition and Hydration Strategies for Altitude Training', url: `${BASE}/nutrition-hydration-strategies-altitude-training`, category: 'nutrition', tags: ['fatigue', 'appetite_loss', 'serious_trainer'], priority: 5 },
  { id: 'art-065', title: 'Carbohydrate Needs at Altitude', url: `${BASE}/carbohydrate-needs-altitude`, category: 'nutrition', tags: ['fatigue', 'appetite_loss', 'serious_trainer'], priority: 4 },
  { id: 'art-066', title: 'Protein Needs at Altitude', url: `${BASE}/protein-needs-altitude`, category: 'nutrition', tags: ['serious_trainer', 'fatigue'], priority: 3 },
  { id: 'art-067', title: 'Iron Supplementation at Altitude', url: `${BASE}/iron-supplementation-altitude`, category: 'nutrition', tags: ['fatigue', 'daily_local', 'serious_trainer'], priority: 4 },
  { id: 'art-068', title: 'Altitude and Gut Health: GI Distress', url: `${BASE}/altitude-gut-health`, category: 'nutrition', tags: ['nausea', 'appetite_loss'], priority: 4 },
  { id: 'art-069', title: 'Plant-Based Athletes at Altitude', url: `${BASE}/plant-based-athletes-altitude`, category: 'nutrition', tags: ['fatigue', 'serious_trainer'], priority: 3 },
  { id: 'art-070', title: 'What to Eat the Day Before Your Event', url: `${BASE}/pre-event-nutrition-altitude`, category: 'nutrition', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-071', title: 'Race Day Fueling at Altitude', url: `${BASE}/race-day-fueling-altitude`, category: 'nutrition', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-072', title: 'Pre-Workout Nutrition at Altitude', url: `${BASE}/pre-workout-nutrition-altitude`, category: 'nutrition', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-073', title: 'Post-Workout Recovery Nutrition at Altitude', url: `${BASE}/post-workout-nutrition-altitude`, category: 'nutrition', tags: ['serious_trainer', 'fatigue'], priority: 4 },
  { id: 'art-074', title: 'Electrolyte Balance at Altitude', url: `${BASE}/electrolyte-balance-altitude`, category: 'nutrition', tags: ['headache', 'fatigue'], priority: 4 },
  { id: 'art-075', title: 'Altitude and Alcohol', url: `${BASE}/altitude-alcohol`, category: 'nutrition', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-076', title: 'Caffeine and Coffee at Altitude', url: `${BASE}/caffeine-altitude`, category: 'nutrition', tags: ['fatigue', 'brain_fog'], priority: 4 },
  { id: 'art-077', title: 'Sodium and Salt at Altitude', url: `${BASE}/sodium-altitude`, category: 'nutrition', tags: ['headache', 'fatigue'], priority: 3 },
  { id: 'art-078', title: 'Beet Root and Nitrates at Altitude', url: `${BASE}/beet-root-nitrates-altitude`, category: 'nutrition', tags: ['serious_trainer', 'breathlessness'], priority: 4 },
  { id: 'art-079', title: 'Meal Timing at Altitude', url: `${BASE}/meal-timing-altitude`, category: 'nutrition', tags: ['serious_trainer', 'event_prep'], priority: 3 },
  { id: 'art-080', title: 'Snacking for Long Mountain Days', url: `${BASE}/snacking-altitude`, category: 'nutrition', tags: ['weekend_warrior', 'event_prep'], priority: 3 },
  { id: 'art-081', title: 'Anti-Inflammatory Eating for Altitude Recovery', url: `${BASE}/anti-inflammatory-altitude`, category: 'nutrition', tags: ['fatigue', 'poor_sleep'], priority: 3 },
  { id: 'art-082', title: 'Magnesium and Altitude Recovery', url: `${BASE}/magnesium-altitude`, category: 'nutrition', tags: ['poor_sleep', 'fatigue'], priority: 4 },
  { id: 'art-083', title: 'Vitamins C and D at Altitude', url: `${BASE}/vitamin-c-d-altitude`, category: 'nutrition', tags: ['fatigue', 'daily_local'], priority: 3 },
  { id: 'art-084', title: 'Altitude and Appetite Suppression', url: `${BASE}/altitude-appetite-suppression`, category: 'nutrition', tags: ['appetite_loss', 'fatigue'], priority: 5 },
  { id: 'art-085', title: 'Altitude Cooking: How High Elevation Changes Prep', url: `${BASE}/altitude-cooking`, category: 'nutrition', tags: ['weekend_warrior'], priority: 2 },
  { id: 'art-086', title: 'Omega-3s and Altitude Recovery', url: `${BASE}/omega-3-altitude`, category: 'nutrition', tags: ['fatigue', 'serious_trainer'], priority: 3 },
  { id: 'art-087', title: 'B Vitamins and Altitude Performance', url: `${BASE}/b-vitamins-altitude`, category: 'nutrition', tags: ['fatigue', 'brain_fog'], priority: 3 },
  { id: 'art-088', title: 'Fueling for Multi-Day Events at Altitude', url: `${BASE}/multi-day-fueling-altitude`, category: 'nutrition', tags: ['event_prep', 'goal_near'], priority: 4 },
  { id: 'art-089', title: 'Pre-Trip Nutritional Loading', url: `${BASE}/pre-trip-nutritional-loading`, category: 'nutrition', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-090', title: 'Altitude and Blood Sugar Management', url: `${BASE}/altitude-blood-sugar`, category: 'nutrition', tags: ['fatigue', 'daily_local'], priority: 3 },

  // ── Science (22) ─────────────────────────────────────────────────────────
  { id: 'art-091', title: 'Breathing Mechanics at Altitude', url: `${BASE}/breathing-mechanics-altitude`, category: 'science', tags: ['breathlessness'], priority: 5 },
  { id: 'art-092', title: 'How Altitude Affects Your HRV', url: `${BASE}/altitude-hrv`, category: 'science', tags: ['elevated_hr', 'whoop_connected', 'oura_connected'], priority: 5 },
  { id: 'art-093', title: 'Wearables at Altitude: WHOOP, Oura, Garmin', url: `${BASE}/wearables-altitude`, category: 'science', tags: ['whoop_connected', 'oura_connected', 'strava_connected'], priority: 4 },
  { id: 'art-094', title: 'Blood Oxygen Levels for Athletes', url: `${BASE}/blood-oxygen-athletes`, category: 'science', tags: ['breathlessness', 'elevated_hr'], priority: 4 },
  { id: 'art-095', title: 'Cognitive Effects of Altitude', url: `${BASE}/cognitive-effects-altitude`, category: 'science', tags: ['brain_fog'], priority: 5 },
  { id: 'art-096', title: 'Hemoglobin Optimization at Altitude', url: `${BASE}/hemoglobin-altitude`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-097', title: 'How Altitude Training Improves VO2 Max', url: `${BASE}/altitude-vo2-max`, category: 'science', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-098', title: 'Altitude and Blood Pressure', url: `${BASE}/altitude-blood-pressure`, category: 'science', tags: ['elevated_hr', 'dizziness'], priority: 3 },
  { id: 'art-099', title: 'The Hypoxic Response Explained', url: `${BASE}/hypoxic-response`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-100', title: 'Erythropoietin (EPO) and Altitude', url: `${BASE}/epo-altitude`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-101', title: 'Altitude and Pulmonary Function', url: `${BASE}/altitude-pulmonary-function`, category: 'science', tags: ['breathlessness', 'serious_trainer'], priority: 3 },
  { id: 'art-102', title: 'SpO2 Monitoring at Altitude', url: `${BASE}/spo2-altitude`, category: 'science', tags: ['breathlessness', 'elevated_hr'], priority: 4 },
  { id: 'art-103', title: 'Live High, Train Low: The Science', url: `${BASE}/live-high-train-low`, category: 'science', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-104', title: 'Altitude and Hormones', url: `${BASE}/altitude-hormones`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-105', title: 'How Altitude Changes Your Breathing Rate', url: `${BASE}/altitude-breathing-rate`, category: 'science', tags: ['breathlessness'], priority: 4 },
  { id: 'art-106', title: 'Altitude and Anaerobic Threshold', url: `${BASE}/altitude-anaerobic-threshold`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-107', title: 'The Science of Altitude Sickness', url: `${BASE}/science-altitude-sickness`, category: 'science', tags: ['headache', 'nausea', 'dizziness'], priority: 4 },
  { id: 'art-108', title: 'Altitude and Sleep Architecture', url: `${BASE}/altitude-sleep-architecture`, category: 'science', tags: ['poor_sleep'], priority: 4 },
  { id: 'art-109', title: 'Altitude and Mitochondrial Adaptation', url: `${BASE}/altitude-mitochondria`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-110', title: 'Carbon Dioxide and Altitude', url: `${BASE}/carbon-dioxide-altitude`, category: 'science', tags: ['breathlessness'], priority: 3 },
  { id: 'art-111', title: 'The Science Behind Altitude Adaptation', url: `${BASE}/science-altitude-adaptation`, category: 'science', tags: ['daily_local', 'weekend_warrior'], priority: 4 },
  { id: 'art-112', title: 'Cold Water Immersion for Altitude Recovery', url: `${BASE}/cold-water-immersion-altitude-recovery`, category: 'training', tags: ['fatigue', 'poor_sleep', 'serious_trainer'], priority: 4 },
]
