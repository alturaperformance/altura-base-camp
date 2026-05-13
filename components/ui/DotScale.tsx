'use client'

interface DotScaleProps {
  value: number | null
  onChange?: (value: number) => void
  readOnly?: boolean
}

export function DotScale({ value, onChange, readOnly = false }: DotScaleProps) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={[
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all',
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            value === n
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-navy-600 text-slate-400 border border-slate-700/50 hover:border-slate-500',
          ].join(' ')}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
