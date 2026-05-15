import type { Article, ArticleTag } from '@/data/articles'
import type { Profile, Goal, Integrations } from '@/types/profile'

export function getForYouArticles(
  profile: Profile,
  goal: Goal | null,
  integrations: Integrations,
  allArticles: Article[]
): Article[] {
  const signals = new Set<ArticleTag>([
    ...(profile.symptoms as ArticleTag[]),
    profile.lifestyle as ArticleTag,
  ])

  if (integrations.strava) signals.add('strava_connected')
  if (integrations.whoop) signals.add('whoop_connected')
  if (integrations.oura) signals.add('oura_connected')

  if (goal) {
    signals.add('goal_active')
    const daysOut = Math.ceil(
      (new Date(goal.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    if (daysOut <= 30) signals.add('goal_near')
  }

  const scored = allArticles.map((article) => ({
    article,
    score: article.tags.filter((tag) => signals.has(tag)).length * article.priority,
  }))

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s) => s.article)
}
