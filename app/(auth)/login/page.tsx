'use client'

import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/demo-store'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { profile } = useAppStore()

  useEffect(() => {
    if (profile?.onboarding_complete) {
      router.push('/home')
    } else {
      router.push('/onboarding')
    }
  }, [profile, router])

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <p className="text-slate-400 text-sm">Altura Base Camp</p>
      </div>
    </div>
  )
}
