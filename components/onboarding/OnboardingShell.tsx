'use client'

import type { ReactNode } from 'react'

interface OnboardingShellProps {
  step: number
  totalSteps: number
  onBack?: () => void
  children: ReactNode
}

export function OnboardingShell({ step, totalSteps, onBack, children }: OnboardingShellProps) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-navy-700">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}
        <span className="text-xs text-slate-500">
          {step} / {totalSteps}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8">{children}</div>
    </div>
  )
}
