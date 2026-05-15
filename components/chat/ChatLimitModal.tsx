export function ChatLimitModal() {
  return (
    <div className="mx-4 mb-4 rounded-2xl border border-slate-700/50 bg-navy-800 p-5 text-center">
      <p className="text-sm font-semibold text-white mb-1">You've reached today's limit</p>
      <p className="text-xs text-slate-400">Come back tonight — your questions reset at midnight.</p>
    </div>
  )
}
