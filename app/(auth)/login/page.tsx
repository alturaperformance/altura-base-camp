'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()

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
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
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

    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log('[signup] env check — URL present:', !!supabaseUrl, '| KEY present:', !!supabaseKey)
      console.log('[signup] Supabase URL prefix:', supabaseUrl?.slice(0, 30) ?? 'MISSING')

      if (!supabaseUrl || !supabaseKey) {
        setError('Configuration error: Supabase environment variables are not set. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
        setLoading(false)
        return
      }

      const supabase = createClient()

      // 1. Create the auth user
      console.log('[signup] Calling supabase.auth.signUp for:', email.trim().toLowerCase())
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      })
      console.log('[signup] signUp result — user:', authData?.user?.id ?? 'none', '| error:', authError?.message ?? 'none')

      if (authError) {
        setError(`Auth error: ${authError.message}`)
        setLoading(false)
        return
      }

      const userId = authData.user?.id
      if (!userId) {
        setError('Sign-up succeeded but no user ID was returned. Check if email confirmation is required in your Supabase project settings.')
        setLoading(false)
        return
      }

      // 2. Insert the profile row
      console.log('[signup] Inserting profile row for user:', userId)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        onboarding_complete: false,
      })
      console.log('[signup] Profile insert result — error:', profileError?.message ?? 'none')

      if (profileError) {
        setError(`Auth succeeded but profile could not be saved: ${profileError.message}`)
        setLoading(false)
        return
      }

      setLoading(false)
      router.push('/onboarding')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[signup] Unexpected exception:', message)
      setError(`Unexpected error: ${message}`)
      setLoading(false)
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!signInEmail.trim() || !signInPassword) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: signInEmail.trim().toLowerCase(),
      password: signInPassword,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Fetch the user's profile to decide where to send them
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      setError(`Signed in but could not load profile: ${profileError.message}`)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push(profile?.onboarding_complete ? '/home' : '/onboarding')
  }

  async function handleGoogleSignIn() {
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/callback`
      console.log('[google] initiating OAuth redirect — redirectTo:', redirectTo)
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
      if (oauthError) {
        console.error('[google] OAuth error:', oauthError.message)
        setError(`Google sign-in failed: ${oauthError.message}`)
        setLoading(false)
      }
      // On success Supabase redirects the browser — no further action needed here
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[google] Unexpected exception:', message)
      setError(`Unexpected error: ${message}`)
      setLoading(false)
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

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed text-gray-800 text-sm font-semibold transition-all mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-700/60" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-slate-700/60" />
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
                disabled={loading}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                autoComplete="family-name"
                className={inputClass}
                disabled={loading}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className={inputClass}
              disabled={loading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              autoComplete="new-password"
              className={inputClass}
              disabled={loading}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={inputClass}
              disabled={loading}
            />

            {error && (
              <p className="text-red-400 text-xs px-1 bg-red-400/10 rounded-lg py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account →'}
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
              disabled={loading}
            />
            <input
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className={inputClass}
              disabled={loading}
            />

            {error && (
              <p className="text-red-400 text-xs px-1 bg-red-400/10 rounded-lg py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
