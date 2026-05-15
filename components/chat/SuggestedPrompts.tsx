interface SuggestedPromptsProps {
  prompts: string[]
  loading: boolean
  onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ prompts, loading, onSelect }: SuggestedPromptsProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-44 rounded-full bg-slate-800 animate-pulse shrink-0" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className="shrink-0 text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white px-3 py-2 rounded-full transition-all whitespace-nowrap max-w-[220px] truncate"
        >
          {p}
        </button>
      ))}
    </div>
  )
}
