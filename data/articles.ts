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
  // ── Acclimatization (15) ─────────────────────────────────────────────────
  { id: 'art-001', title: 'Sleep Quality at Altitude: Athlete\'s Guide', url: `${BASE}/sleep-quality-altitude-athletes/`, category: 'acclimatization', tags: ['poor_sleep'], priority: 5 },
  { id: 'art-002', title: 'Altitude, Sleep Apnea, and Periodic Breathing', url: `${BASE}/altitude-sleep-apnea-periodic-breathing/`, category: 'acclimatization', tags: ['poor_sleep'], priority: 4 },
  { id: 'art-003', title: 'Altitude Headaches and Dehydration: Prevention Guide', url: `${BASE}/altitude-headache-dehydration-prevention/`, category: 'acclimatization', tags: ['headache', 'fatigue'], priority: 5 },
  { id: 'art-004', title: 'How to Acclimatize to Altitude: Athlete\'s Guide', url: `${BASE}/how-to-acclimatize-to-altitude-athletes/`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 5 },
  { id: 'art-005', title: 'How Long Does It Take to Acclimatize to Altitude?', url: `${BASE}/how-long-acclimatize-altitude-timeline/`, category: 'acclimatization', tags: ['weekend_warrior', 'event_prep'], priority: 5 },
  { id: 'art-006', title: 'Altitude Sickness Prevention for Athletes', url: `${BASE}/altitude-sickness-prevention-athletes/`, category: 'acclimatization', tags: ['headache', 'nausea', 'dizziness'], priority: 5 },
  { id: 'art-007', title: 'Altitude Sickness Symptoms: AMS, HACE, and HAPE', url: `${BASE}/altitude-sickness-symptoms-ams-hace-hape/`, category: 'acclimatization', tags: ['nausea', 'dizziness', 'headache'], priority: 4 },
  { id: 'art-008', title: 'Jet Lag and Altitude: Managing Travel Fatigue', url: `${BASE}/jet-lag-altitude-travel-fatigue/`, category: 'acclimatization', tags: ['fatigue', 'poor_sleep', 'weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-009', title: 'Re-Acclimatization: Returning to Altitude', url: `${BASE}/re-acclimatization-returning-altitude/`, category: 'acclimatization', tags: ['event_prep', 'weekend_warrior'], priority: 3 },
  { id: 'art-010', title: 'NSAIDs and Ibuprofen at Altitude: Risks for Athletes', url: `${BASE}/nsaids-ibuprofen-altitude-risk-athletes/`, category: 'acclimatization', tags: ['headache', 'serious_trainer'], priority: 4 },
  { id: 'art-011', title: 'Acetazolamide (Diamox) for Altitude: Athlete\'s Guide', url: `${BASE}/acetazolamide-diamox-altitude-athletes/`, category: 'acclimatization', tags: ['headache', 'nausea', 'weekend_warrior', 'event_prep'], priority: 3 },
  { id: 'art-012', title: 'Altitude Training and Immune Function', url: `${BASE}/altitude-training-immune-function-illness/`, category: 'acclimatization', tags: ['fatigue', 'daily_local'], priority: 3 },
  { id: 'art-013', title: 'How Long Do Altitude Gains Last? The Washout Effect', url: `${BASE}/how-long-altitude-gains-last-washout/`, category: 'acclimatization', tags: ['daily_local', 'event_prep'], priority: 4 },
  { id: 'art-014', title: 'Breathing Exercises to Prepare for Altitude', url: `${BASE}/breathing-exercises-altitude-preparation/`, category: 'acclimatization', tags: ['breathlessness', 'weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-015', title: 'The Complete Altitude Training Guide', url: `${BASE}/altitude-training-guide/`, category: 'acclimatization', tags: ['serious_trainer', 'weekend_warrior', 'event_prep'], priority: 5 },

  // ── Training (59) ────────────────────────────────────────────────────────
  { id: 'art-016', title: 'Altitude Training for Runners', url: `${BASE}/altitude-training-runners-guide/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 5 },
  { id: 'art-017', title: 'Altitude Training for Cyclists', url: `${BASE}/altitude-training-cyclists-guide/`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 5 },
  { id: 'art-018', title: 'Altitude Training for Triathletes', url: `${BASE}/altitude-training-for-triathletes/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 5 },
  { id: 'art-019', title: 'Altitude Training for Triathletes: Complete Guide', url: `${BASE}/altitude-training-triathletes-guide/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 4 },
  { id: 'art-020', title: 'Altitude Training for Ultra and 100-Mile Trail Runners', url: `${BASE}/altitude-training-ultra-trail-100-mile-runners/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 4 },
  { id: 'art-021', title: 'Altitude Training for Climbers and Mountaineers', url: `${BASE}/altitude-training-climbers-mountaineers/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-022', title: 'Leadville 100: Altitude Race Pacing Strategy', url: `${BASE}/leadville-100-altitude-race-pacing-strategy/`, category: 'training', tags: ['event_prep', 'goal_near', 'goal_active', 'serious_trainer'], priority: 5 },
  { id: 'art-023', title: 'When to Race After an Altitude Camp', url: `${BASE}/when-to-race-after-altitude-camp/`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-024', title: 'Race Pace Adjustment at Altitude', url: `${BASE}/race-pace-adjustment-altitude-calculator/`, category: 'training', tags: ['event_prep', 'goal_near', 'strava_connected'], priority: 5 },
  { id: 'art-025', title: 'Tapering After an Altitude Camp', url: `${BASE}/tapering-after-altitude-camp-protocol/`, category: 'training', tags: ['event_prep', 'goal_near'], priority: 5 },
  { id: 'art-026', title: 'Overtraining at Altitude: Prevention Guide', url: `${BASE}/overtraining-at-altitude-prevention/`, category: 'training', tags: ['serious_trainer', 'elevated_hr', 'fatigue'], priority: 4 },
  { id: 'art-027', title: 'How to Periodize Altitude Training', url: `${BASE}/altitude-training-periodization-mesocycle/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-028', title: 'Block Periodization for Altitude Training Camps', url: `${BASE}/block-periodization-altitude-training-camps/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-029', title: '4-Week Altitude Training Plan', url: `${BASE}/altitude-training-plan-4-week-block/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-030', title: 'Power Meters at Altitude: Watts and Training Zones', url: `${BASE}/power-meter-altitude-watts-training-zones/`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 4 },
  { id: 'art-031', title: 'Lactate Testing at Altitude', url: `${BASE}/lactate-testing-altitude-training-zones/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-032', title: 'Polarized Training (80/20) at Altitude', url: `${BASE}/polarized-training-80-20-altitude-guide/`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 3 },
  { id: 'art-033', title: 'Strength Training at Altitude: Concurrent Training Guide', url: `${BASE}/strength-training-altitude-concurrent-guide/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-034', title: 'Altitude Training for Female Athletes', url: `${BASE}/altitude-training-female-athletes-guide/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-035', title: 'Altitude Training for Masters Athletes (40+)', url: `${BASE}/altitude-training-masters-athletes-over-40/`, category: 'training', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-036', title: 'Altitude Training Recovery Guide', url: `${BASE}/altitude-training-recovery-guide/`, category: 'training', tags: ['fatigue', 'poor_sleep', 'serious_trainer'], priority: 4 },
  { id: 'art-037', title: 'Cold Water Immersion for Altitude Recovery', url: `${BASE}/cold-water-immersion-altitude-recovery/`, category: 'training', tags: ['fatigue', 'poor_sleep', 'serious_trainer'], priority: 4 },
  { id: 'art-038', title: 'Compression Garments for Altitude Recovery', url: `${BASE}/compression-garments-altitude-recovery/`, category: 'training', tags: ['fatigue', 'serious_trainer'], priority: 3 },
  { id: 'art-039', title: 'Red Light Therapy and Photobiomodulation for Altitude Recovery', url: `${BASE}/red-light-therapy-photobiomodulation-altitude-recovery/`, category: 'training', tags: ['fatigue', 'poor_sleep', 'serious_trainer'], priority: 3 },
  { id: 'art-040', title: 'Sauna and Altitude Training Combined', url: `${BASE}/sauna-altitude-training-combination/`, category: 'training', tags: ['serious_trainer', 'fatigue'], priority: 3 },
  { id: 'art-041', title: 'Cold Exposure vs. Altitude Training: Which Is Better?', url: `${BASE}/cold-exposure-vs-altitude-training-comparison/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-042', title: 'Heat vs. Altitude Training: Comparison', url: `${BASE}/heat-vs-altitude-training-comparison/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-043', title: 'Altitude Training Benefits for Endurance Athletes', url: `${BASE}/altitude-training-benefits-endurance-athletes/`, category: 'training', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-044', title: 'Altitude Tents for Athletes: Complete Guide', url: `${BASE}/altitude-tent-athletes-guide/`, category: 'training', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-045', title: 'Altitude Mask vs. Altitude Tent: Which Is Better?', url: `${BASE}/altitude-mask-vs-altitude-tent-comparison/`, category: 'training', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-046', title: 'Altitude Simulation Room: Home Setup Guide', url: `${BASE}/altitude-simulation-room-home-setup-guide/`, category: 'training', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-047', title: 'How to Log and Track Your Altitude Training', url: `${BASE}/altitude-training-log-tracking-guide/`, category: 'training', tags: ['serious_trainer', 'strava_connected'], priority: 3 },
  { id: 'art-048', title: 'Visualization and Mental Skills at Altitude Camp', url: `${BASE}/visualization-mental-skills-altitude-camp/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'brain_fog'], priority: 3 },
  { id: 'art-049', title: 'Finding Your Ideal Altitude for Training', url: `${BASE}/ideal-altitude-for-training-calculator/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 3 },
  { id: 'art-050', title: 'Altitude Training Camp Packing List', url: `${BASE}/altitude-training-camp-packing-list/`, category: 'training', tags: ['weekend_warrior', 'event_prep'], priority: 4 },
  { id: 'art-051', title: 'Best Altitude Training Camps for Endurance Athletes', url: `${BASE}/best-altitude-training-camps-endurance-athletes/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 4 },
  { id: 'art-052', title: 'Flagstaff Altitude Training Guide', url: `${BASE}/flagstaff-altitude-training-guide/`, category: 'training', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-053', title: 'Colorado Springs Altitude Training at the Olympic Center', url: `${BASE}/colorado-springs-altitude-training-olympic-center/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-054', title: 'Park City, Utah Altitude Training Guide', url: `${BASE}/park-city-utah-altitude-training-guide/`, category: 'training', tags: ['serious_trainer', 'weekend_warrior'], priority: 2 },
  { id: 'art-055', title: 'Albuquerque, New Mexico Altitude Training Guide', url: `${BASE}/albuquerque-new-mexico-altitude-training-guide/`, category: 'training', tags: ['serious_trainer', 'weekend_warrior'], priority: 2 },
  { id: 'art-056', title: 'St. Moritz Altitude Training Destination Guide', url: `${BASE}/st-moritz-altitude-training-destination/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-057', title: 'Font Romeu Altitude Training Guide', url: `${BASE}/font-romeu-altitude-training-guide/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-058', title: 'Eldoret, Kenya: Altitude Training in the Rift Valley', url: `${BASE}/eldoret-kenya-altitude-training-rift-valley/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-059', title: 'Iten, Kenya: Altitude Training Destination', url: `${BASE}/iten-kenya-altitude-training-destination/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-060', title: 'Addis Ababa, Ethiopia: Altitude Training Destination Guide', url: `${BASE}/addis-ababa-altitude-training-ethiopia/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-061', title: 'Bogotá, Colombia: Altitude Training Destination Guide', url: `${BASE}/bogota-altitude-training-destination-guide/`, category: 'training', tags: ['serious_trainer'], priority: 2 },
  { id: 'art-062', title: 'Altitude Training for Alpine Skiing', url: `${BASE}/altitude-training-alpine-skiing-guide/`, category: 'training', tags: ['weekend_warrior', 'event_prep', 'strava_connected'], priority: 3 },
  { id: 'art-063', title: 'Altitude Training for Cross-Country Skiing', url: `${BASE}/altitude-training-cross-country-skiing/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 3 },
  { id: 'art-064', title: 'Altitude Training for Biathlon', url: `${BASE}/altitude-training-biathlon-winter-sport/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 3 },
  { id: 'art-065', title: 'Altitude Training for Rowers', url: `${BASE}/altitude-training-rowers-rowing/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 2 },
  { id: 'art-066', title: 'Altitude Training for Soccer and Football', url: `${BASE}/altitude-training-soccer-football-guide/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-067', title: 'Altitude Training for Basketball and Team Sports', url: `${BASE}/altitude-training-basketball-team-sports/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-068', title: 'Altitude Training for Rugby and Team Sports', url: `${BASE}/altitude-training-rugby-team-sports/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-069', title: 'Altitude Training for MMA and Combat Sports', url: `${BASE}/altitude-training-mma-combat-sports-boxing/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-070', title: 'Altitude Training for Volleyball', url: `${BASE}/altitude-training-volleyball-team-sport/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-071', title: 'Altitude Training for Paralympic and Adaptive Athletes', url: `${BASE}/altitude-training-paralympic-adaptive-athletes/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 2 },
  { id: 'art-072', title: 'Altitude Training for Youth and Junior Athletes', url: `${BASE}/altitude-training-youth-junior-athletes/`, category: 'training', tags: ['weekend_warrior'], priority: 2 },
  { id: 'art-073', title: 'Swimming at Altitude: Performance Guide', url: `${BASE}/swimming-at-altitude-guide/`, category: 'training', tags: ['serious_trainer', 'event_prep', 'strava_connected'], priority: 3 },
  { id: 'art-074', title: 'Altitude Training Calculator', url: `${BASE}/altitude-training-calculator-tool/`, category: 'training', tags: ['serious_trainer', 'event_prep'], priority: 3 },

  // ── Nutrition (16) ───────────────────────────────────────────────────────
  { id: 'art-075', title: 'Hydration Strategy for Altitude Athletes', url: `${BASE}/hydration-strategy-altitude-athletes/`, category: 'nutrition', tags: ['headache', 'dry_mouth', 'fatigue'], priority: 5 },
  { id: 'art-076', title: 'Nutrition & Hydration Strategies for Altitude Training', url: `${BASE}/nutrition-hydration-strategies-altitude-training/`, category: 'nutrition', tags: ['fatigue', 'serious_trainer'], priority: 5 },
  { id: 'art-077', title: 'Nutrition for Altitude Training Athletes', url: `${BASE}/nutrition-for-altitude-training-athletes/`, category: 'nutrition', tags: ['fatigue', 'appetite_loss', 'serious_trainer'], priority: 5 },
  { id: 'art-078', title: 'Carbohydrate Needs for Altitude Athletes', url: `${BASE}/carbohydrate-needs-altitude-athletes/`, category: 'nutrition', tags: ['fatigue', 'appetite_loss', 'serious_trainer'], priority: 4 },
  { id: 'art-079', title: 'Protein Intake for Altitude Athletes', url: `${BASE}/protein-intake-altitude-athletes-guide/`, category: 'nutrition', tags: ['serious_trainer', 'fatigue'], priority: 3 },
  { id: 'art-080', title: 'Iron Supplementation for Altitude Training', url: `${BASE}/iron-supplementation-altitude-training/`, category: 'nutrition', tags: ['fatigue', 'daily_local', 'serious_trainer'], priority: 4 },
  { id: 'art-081', title: 'Altitude and Gut Health: Managing GI Distress', url: `${BASE}/altitude-gut-health-gi-distress-athletes/`, category: 'nutrition', tags: ['nausea', 'appetite_loss', 'dizziness'], priority: 4 },
  { id: 'art-082', title: 'Plant-Based Diet for Altitude Training Athletes', url: `${BASE}/plant-based-diet-altitude-training-athletes/`, category: 'nutrition', tags: ['fatigue', 'serious_trainer'], priority: 3 },
  { id: 'art-083', title: 'Caffeine and Altitude Performance', url: `${BASE}/caffeine-altitude-performance-athletes/`, category: 'nutrition', tags: ['fatigue', 'brain_fog'], priority: 4 },
  { id: 'art-084', title: 'Beetroot and Nitrates for Altitude Performance', url: `${BASE}/beetroot-nitrate-altitude-performance-athletes/`, category: 'nutrition', tags: ['serious_trainer', 'breathlessness'], priority: 4 },
  { id: 'art-085', title: 'Beta-Alanine for Altitude and Hypoxic Training', url: `${BASE}/beta-alanine-altitude-hypoxic-training/`, category: 'nutrition', tags: ['serious_trainer', 'breathlessness'], priority: 3 },
  { id: 'art-086', title: 'Sodium Bicarbonate for Altitude Racing', url: `${BASE}/sodium-bicarbonate-bicarb-altitude-racing/`, category: 'nutrition', tags: ['event_prep', 'goal_near'], priority: 3 },
  { id: 'art-087', title: 'Ketones and Altitude Performance: Exogenous BHB', url: `${BASE}/ketones-altitude-performance-exogenous-bhb/`, category: 'nutrition', tags: ['serious_trainer', 'fatigue'], priority: 3 },
  { id: 'art-088', title: 'Creatine at Altitude: Dehydration Risk', url: `${BASE}/creatine-altitude-training-dehydration-risk/`, category: 'nutrition', tags: ['serious_trainer', 'fatigue'], priority: 3 },
  { id: 'art-089', title: 'Vitamin D and Altitude Training', url: `${BASE}/vitamin-d-altitude-training-athletes/`, category: 'nutrition', tags: ['fatigue', 'daily_local', 'serious_trainer'], priority: 3 },
  { id: 'art-090', title: 'Continuous Glucose Monitoring for Altitude Athletes', url: `${BASE}/continuous-glucose-monitoring-altitude-athletes/`, category: 'nutrition', tags: ['fatigue', 'serious_trainer'], priority: 3 },

  // ── Science (20) ─────────────────────────────────────────────────────────
  { id: 'art-091', title: 'Breathing Mechanics at Altitude', url: `${BASE}/breathing-mechanics-altitude-athletes/`, category: 'science', tags: ['breathlessness', 'serious_trainer'], priority: 5 },
  { id: 'art-092', title: 'HRV at Altitude: Training Guide', url: `${BASE}/hrv-at-altitude-training-guide/`, category: 'science', tags: ['elevated_hr', 'whoop_connected', 'oura_connected'], priority: 5 },
  { id: 'art-093', title: 'Cognitive Effects of Altitude on Athletes', url: `${BASE}/cognitive-effects-altitude-athletes/`, category: 'science', tags: ['brain_fog', 'fatigue'], priority: 5 },
  { id: 'art-094', title: 'Wearables for Altitude Training: Whoop, Oura, Garmin', url: `${BASE}/wearables-altitude-training-whoop-oura-garmin/`, category: 'science', tags: ['whoop_connected', 'oura_connected', 'strava_connected'], priority: 4 },
  { id: 'art-095', title: 'Blood Oxygen Levels for Athletes: SpO2 Guide', url: `${BASE}/blood-oxygen-levels-athletes-spo2/`, category: 'science', tags: ['breathlessness', 'elevated_hr'], priority: 4 },
  { id: 'art-096', title: 'Pulse Oximeter for Altitude Athletes: Guide', url: `${BASE}/pulse-oximeter-altitude-athletes-guide/`, category: 'science', tags: ['breathlessness', 'elevated_hr'], priority: 4 },
  { id: 'art-097', title: 'How Altitude Training Improves VO2 Max', url: `${BASE}/altitude-training-vo2-max-improvement/`, category: 'science', tags: ['serious_trainer', 'breathlessness'], priority: 4 },
  { id: 'art-098', title: 'VO2 Max Testing at Altitude: Protocol and Results', url: `${BASE}/vo2-max-testing-altitude-protocol-results/`, category: 'science', tags: ['serious_trainer', 'breathlessness'], priority: 4 },
  { id: 'art-099', title: 'Hemoglobin Optimization Through Altitude Training', url: `${BASE}/hemoglobin-optimization-altitude-training/`, category: 'science', tags: ['serious_trainer', 'daily_local', 'fatigue'], priority: 3 },
  { id: 'art-100', title: 'Altitude Training, EPO, and Red Blood Cells', url: `${BASE}/altitude-training-epo-red-blood-cells/`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-101', title: 'Hypoxic Training: Benefits and Methods', url: `${BASE}/hypoxic-training-benefits-methods/`, category: 'science', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-102', title: 'Live High, Train Low: Protocol Guide', url: `${BASE}/live-high-train-low-protocol-guide/`, category: 'science', tags: ['serious_trainer'], priority: 4 },
  { id: 'art-103', title: 'Intermittent Hypoxic Exposure Protocol', url: `${BASE}/intermittent-hypoxic-exposure-protocol/`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-104', title: 'Normobaric vs. Hypobaric Hypoxia for Athletes', url: `${BASE}/normobaric-vs-hypobaric-hypoxia-athletes/`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-105', title: 'Altitude and Blood Pressure: What Athletes Need to Know', url: `${BASE}/altitude-blood-pressure-hypertension-athletes/`, category: 'science', tags: ['elevated_hr', 'dizziness', 'daily_local'], priority: 3 },
  { id: 'art-106', title: 'How Altitude Training Affects Hormones: Testosterone and Cortisol', url: `${BASE}/altitude-training-hormones-testosterone-cortisol/`, category: 'science', tags: ['serious_trainer', 'daily_local', 'fatigue'], priority: 3 },
  { id: 'art-107', title: 'Epigenetics and Altitude Training: Gene Expression', url: `${BASE}/epigenetics-altitude-training-gene-expression/`, category: 'science', tags: ['serious_trainer', 'daily_local'], priority: 3 },
  { id: 'art-108', title: 'Genetics and Altitude Response: The EPAS1 Gene', url: `${BASE}/genetics-altitude-response-epas1-athletes/`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-109', title: 'EPO Non-Responders: Why Some Athletes Don\'t Respond to Altitude', url: `${BASE}/individual-variation-epo-altitude-non-responders/`, category: 'science', tags: ['serious_trainer'], priority: 3 },
  { id: 'art-110', title: 'Altitude Course Records: The Physiology Behind Fast Performances', url: `${BASE}/altitude-course-records-physiology-athletics/`, category: 'science', tags: ['serious_trainer', 'event_prep'], priority: 3 },
]
