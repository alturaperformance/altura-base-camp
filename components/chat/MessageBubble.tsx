interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-navy-800 border border-slate-700/50 text-slate-200 rounded-tl-sm',
        ].join(' ')}
      >
        {content}
      </div>
    </div>
  )
}
