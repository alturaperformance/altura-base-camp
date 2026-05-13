'use client'

interface UnlockInterstitialProps {
  onDismiss: () => void
}

export function UnlockInterstitial({ onDismiss }: UnlockInterstitialProps) {
  return (
    <div className="rounded-2xl bg-navy-700 border-2 border-teal-500 p-5 shadow-lg shadow-teal-500/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-teal-500" />
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
          Unlocked
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        Your insights just got smarter
      </h3>

      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        You&apos;ve built enough of a baseline for us to start finding patterns. From here, your home
        screen updates based on what we actually observe about how altitude affects you — not just
        your onboarding profile.
      </p>

      <div className="space-y-2.5 mb-5">
        {[
          'Pattern insights replace generic educational cards',
          'Nutrition guidance becomes specific to your logged symptoms',
          'Trends tab activates — see how you\'ve changed over time',
        ].map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mt-0.5 shrink-0">
              <span className="text-teal-400 text-xs">✓</span>
            </span>
            <span className="text-sm text-slate-300">{bullet}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onDismiss}
        className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm transition-colors"
      >
        See your first insights →
      </button>
    </div>
  )
}
