import type { Article, ArticleCategory } from '@/data/articles'

const CATEGORY_EMOJI: Record<ArticleCategory, string> = {
  acclimatization: '🏔️',
  training: '🏃',
  nutrition: '🥗',
  science: '🧬',
}

const CATEGORY_LABEL: Record<ArticleCategory, string> = {
  acclimatization: 'Acclimatization',
  training: 'Training',
  nutrition: 'Nutrition',
  science: 'Science',
}

interface ArticleCardProps {
  article: Article
  onClick: (url: string, title: string) => void
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <button
      onClick={() => onClick(article.url, article.title)}
      className="w-full text-left bg-navy-800 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-colors"
    >
      <span className="text-xl">{CATEGORY_EMOJI[article.category]}</span>
      <p className="mt-2 text-sm font-medium text-white leading-snug line-clamp-2">
        {article.title}
      </p>
      <p className="mt-1 text-xs text-slate-500">{CATEGORY_LABEL[article.category]}</p>
    </button>
  )
}
