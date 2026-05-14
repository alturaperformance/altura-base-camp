'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/demo-store'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const { profile, updateProfile } = useAppStore()

  const [mode, setMode] = useState<Mode>('signup')

  // Sign-up fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Sign-in fields
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  const [error, setError] = useState('')

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // In production: call Supabase auth.signUp({ email, password })
    // then store profile fields. Here we persist to demo store.
    updateProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      onboarding_complete: false,
    })
    router.push('/onboarding')
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!signInEmail.trim() || !signInPassword) {
      setError('Please enter your email and password.')
      return
    }

    // In production: call Supabase auth.signInWithPassword({ email, password })
    // For demo: route based on existing profile state.
    if (profile?.onboarding_complete) {
      router.push('/home')
    } else if (profile) {
      router.push('/onboarding')
    } else {
      setError('No account found. Please create an account first.')
    }
  }

  const inputClass =
    'w-full bg-navy-700 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600/50 text-sm'

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold text-white">Altura Base Camp</h1>
          <p className="text-sm text-slate-400 mt-1">Altitude wellness, built for you.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-navy-700 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('signup'); setError('') }}
            className={[
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
              mode === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white',
            ].join(' ')}
          >
            Create account
          </button>
          <button
            onClick={() => { setMode('signin'); setError('') }}
            className={[
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
              mode === 'signin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white',
            ].join(' ')}
          >
            Sign in
          </button>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                autoComplete="given-name"
                className={inputClass}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              autoComplete="new-password"
              className={inputClass}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={inputClass}
            />

            {error && (
              <p className="text-red-400 text-xs px-1">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              Create account →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className={inputClass}
            />
            <input
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className={inputClass}
            />

            {error && (
              <p className="text-red-400 text-xs px-1">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              Sign in →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
