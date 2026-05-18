'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/demo-store'
import { ARTICLES } from '@/data/articles'
import type { ArticleCategory } from '@/data/articles'
import { getForYouArticles } from '@/lib/resources-matching'
import { ArticleCard } from '@/components/resources/ArticleCard'

const CATEGORIES: { value: ArticleCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'acclimatization', label: 'Acclimatization' },
  { value: 'training', label: 'Training' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'science', label: 'Science' },
]

export default function ResourcesPage() {
  const { profile } = useAppStore()
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all')
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null)
  const [webViewTitle, setWebViewTitle] = useState<string>('')

  function openArticle(url: string, title: string) {
    setWebViewUrl(url)
    setWebViewTitle(title)
  }

  function closeWebView() {
    setWebViewUrl(null)
    setWebViewTitle('')
  }

  if (webViewUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={closeWebView}
            className="flex items-center gap-1.5 text-blue-600 text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Resources
          </button>
          <p className="flex-1 text-sm text-slate-600 truncate">{webViewTitle}</p>
        </div>
        <iframe
          src={webViewUrl}
          className="flex-1 w-full border-0"
          title={webViewTitle}
        />
      </div>
    )
  }

  const activeGoal = profile?.goal?.is_active ? profile.goal : null
  const forYouArticles = profile
    ? getForYouArticles(profile, activeGoal, profile.integrations, ARTICLES)
    : []

  const filteredArticles =
    activeCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory)

  return (
    <div className="max-w-md mx-auto px-4 pb-8">
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Resources</h1>
      </div>

      {forYouArticles.length > 0 && (
        <section className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Picked for you
          </p>
          <div className="grid grid-cols-2 gap-3">
            {forYouArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={openArticle} />
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={[
              'shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
              activeCategory === cat.value
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300',
            ].join(' ')}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <section>
        <div className="grid grid-cols-2 gap-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onClick={openArticle} />
          ))}
        </div>
      </section>
    </div>
  )
}
