'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/demo-store'
import { createClient } from '@/lib/supabase/client'
import type { Lifestyle, Symptom } from '@/types/profile'

const LIFESTYLE_OPTIONS: { value: Lifestyle; label: string; desc: string }[] = [
  { value: 'daily_local', label: 'Daily local', desc: 'I live at altitude year-round' },
  { value: 'weekend_warrior', label: 'Weekend warrior', desc: 'I visit mountains occasionally' },
  { value: 'serious_trainer', label: 'Serious trainer', desc: 'I train specifically for altitude performance' },
  { value: 'event_prep', label: 'Event prep', desc: 'I\'m preparing for a specific event or goal' },
]

const SYMPTOM_OPTIONS: { value: Symptom; label: string }[] = [
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'headache', label: 'Headache' },
  { value: 'breathlessness', label: 'Breathlessness' },
  { value: 'poor_sleep', label: 'Poor sleep' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'dizziness', label: 'Dizziness' },
  { value: 'appetite_loss', label: 'Appetite loss' },
  { value: 'brain_fog', label: 'Brain fog' },
  { value: 'elevated_hr', label: 'Elevated heart rate' },
  { value: 'dry_mouth', label: 'Dry mouth' },
  { value: 'none', label: 'None' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 mt-8">
      {children}
    </p>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-navy-800 border border-slate-700/50 rounded-2xl overflow-hidden">
      {children}
    </div>
  )
}

function Row({
  label,
  value,
  onTap,
  destructive,
}: {
  label: string
  value?: string
  onTap?: () => void
  destructive?: boolean
}) {
  return (
    <button
      onClick={onTap}
      disabled={!onTap}
      className="w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-700/40 last:border-0 disabled:cursor-default"
    >
      <span className={`text-sm ${destructive ? 'text-red-400' : 'text-white'}`}>{label}</span>
      {value && <span className="text-sm text-slate-400">{value}</span>}
      {onTap && !destructive && (
        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const { profile, updateProfile, reset } = useAppStore()

  // Edit states
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingGoal, setEditingGoal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [saving, setSaving] = useState(false)

  // Local profile edit state
  const [editLifestyle, setEditLifestyle] = useState<Lifestyle | null>(profile?.lifestyle ?? null)
  const [editSymptoms, setEditSymptoms] = useState<Symptom[]>(profile?.symptoms ?? [])
  const [editElevation, setEditElevation] = useState(String(profile?.home_elevation_ft ?? 5280))
  const [editFirstName, setEditFirstName] = useState(profile?.first_name ?? '')

  if (!profile) return null

  const supabaseAvailable =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  async function saveProfile() {
    if (!profile) return
    setSaving(true)
    const updates = {
      lifestyle: editLifestyle,
      symptoms: editSymptoms,
      home_elevation_ft: parseInt(editElevation) || profile.home_elevation_ft,
      first_name: editFirstName.trim() || profile.first_name,
    }
    updateProfile(updates)

    if (supabaseAvailable) {
      const supabase = createClient()
      await supabase.from('profiles').update({
        lifestyle: updates.lifestyle,
        symptoms: updates.symptoms,
        home_elevation_ft: updates.home_elevation_ft,
        first_name: updates.first_name,
      }).eq('id', profile.id)
    }

    setSaving(false)
    setEditingProfile(false)
  }

  async function setUnits(units: 'imperial' | 'metric') {
    if (!profile) return
    updateProfile({ units_preference: units })
    if (supabaseAvailable) {
      const supabase = createClient()
      await supabase.from('profiles').update({ units_preference: units }).eq('id', profile.id)
    }
  }

  async function signOut() {
    reset()
    if (supabaseAvailable) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push('/login')
  }

  async function deleteAccount() {
    if (deleteText !== 'DELETE') return
    if (supabaseAvailable) {
      const supabase = createClient()
      await supabase.rpc('delete_user_account')
      await supabase.auth.signOut()
    }
    reset()
    router.push('/login')
  }

  function toggleSymptom(sym: Symptom) {
    setEditSymptoms((prev) => {
      if (sym === 'none') return ['none']
      const withoutNone = prev.filter((s) => s !== 'none')
      return prev.includes(sym) ? withoutNone.filter((s) => s !== sym) : [...withoutNone, sym]
    })
  }

  const activeGoal = profile.goal?.is_active ? profile.goal : null

  return (
    <div className="max-w-md mx-auto px-4 pb-12">
      {/* Header */}
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Account</h1>
      </div>

      {/* ── Integrations ─────────────────────────────── */}
      <SectionLabel>Integrations</SectionLabel>
      <Card>
        {/* Strava */}
        <div className="px-4 py-4 border-b border-slate-700/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Strava</p>
                {profile.integrations.strava ? (
                  <p className="text-xs text-green-400">Connected</p>
                ) : (
                  <p className="text-xs text-slate-400">Unlocks altitude-adjusted performance tracking</p>
                )}
              </div>
            </div>
            {profile.integrations.strava ? (
              <button
                onClick={() => {
                  if (confirm('Disconnect Strava?')) {
                    updateProfile({ integrations: { ...profile.integrations, strava: false } })
                  }
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Disconnect
              </button>
            ) : (
              <a
                href="/api/integrations/strava/connect"
                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full"
              >
                Connect
              </a>
            )}
          </div>
        </div>

        {/* Whoop */}
        <div className="px-4 py-4 border-b border-slate-700/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black border border-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Whoop</p>
                {profile.integrations.whoop ? (
                  <p className="text-xs text-green-400">Connected</p>
                ) : (
                  <p className="text-xs text-slate-400">Unlocks HRV and recovery at altitude</p>
                )}
              </div>
            </div>
            {profile.integrations.whoop ? (
              <button
                onClick={() => {
                  if (confirm('Disconnect Whoop?')) {
                    updateProfile({ integrations: { ...profile.integrations, whoop: false } })
                  }
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Disconnect
              </button>
            ) : (
              <button className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full">
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Oura */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Oura Ring</p>
                {profile.integrations.oura ? (
                  <p className="text-xs text-green-400">Connected</p>
                ) : (
                  <p className="text-xs text-slate-400">Unlocks sleep and readiness at altitude</p>
                )}
              </div>
            </div>
            {profile.integrations.oura ? (
              <button
                onClick={() => {
                  if (confirm('Disconnect Oura Ring?')) {
                    updateProfile({ integrations: { ...profile.integrations, oura: false } })
                  }
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Disconnect
              </button>
            ) : (
              <button className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full">
                Connect
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Display ──────────────────────────────────── */}
      <SectionLabel>Display</SectionLabel>
      <Card>
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-3">Measurement units</p>
          <div className="flex gap-2">
            <button
              onClick={() => setUnits('imperial')}
              className={[
                'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                profile.units_preference === 'imperial'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-slate-700 text-slate-400',
              ].join(' ')}
            >
              Imperial (ft, mi)
            </button>
            <button
              onClick={() => setUnits('metric')}
              className={[
                'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                profile.units_preference === 'metric'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-slate-700 text-slate-400',
              ].join(' ')}
            >
              Metric (m, km)
            </button>
          </div>
        </div>
      </Card>

      {/* ── My Profile ───────────────────────────────── */}
      <SectionLabel>My Profile</SectionLabel>
      <Card>
        {!editingProfile ? (
          <>
            <Row label="Lifestyle" value={profile.lifestyle ?? 'Not set'} />
            <Row label="Home elevation" value={`${profile.home_elevation_ft.toLocaleString()} ft`} />
            <Row
              label="Symptoms"
              value={profile.symptoms.length === 0 ? 'None' : profile.symptoms.slice(0, 2).join(', ') + (profile.symptoms.length > 2 ? '…' : '')}
            />
            <Row label="Edit profile" onTap={() => {
              setEditLifestyle(profile.lifestyle)
              setEditSymptoms(profile.symptoms)
              setEditElevation(String(profile.home_elevation_ft))
              setEditFirstName(profile.first_name)
              setEditingProfile(true)
            }} />
          </>
        ) : (
          <div className="px-4 py-4 space-y-5">
            {/* Name */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Display name</p>
              <input
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Home elevation */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Home elevation (ft)</p>
              <input
                type="number"
                value={editElevation}
                onChange={(e) => setEditElevation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Lifestyle */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Lifestyle</p>
              <div className="space-y-2">
                {LIFESTYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEditLifestyle(opt.value)}
                    className={[
                      'w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-colors',
                      editLifestyle === opt.value
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Altitude symptoms</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleSymptom(opt.value)}
                    className={[
                      'text-xs px-3 py-1.5 rounded-full border transition-colors',
                      editSymptoms.includes(opt.value)
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditingProfile(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-sm text-white font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* ── My Goal ──────────────────────────────────── */}
      <SectionLabel>My Goal</SectionLabel>
      <Card>
        {activeGoal ? (
          <>
            <div className="px-4 py-4 border-b border-slate-700/40">
              <p className="text-sm font-semibold text-white">{activeGoal.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(activeGoal.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {activeGoal.location ? ` · ${activeGoal.location}` : ''}
              </p>
              {activeGoal.max_elevation_ft && (
                <p className="text-xs text-slate-400">{activeGoal.max_elevation_ft.toLocaleString()} ft max elevation</p>
              )}
            </div>
            <Row label="Edit goal" onTap={() => setEditingGoal(true)} />
            <Row
              label="Mark as complete"
              onTap={() => {
                if (confirm('Mark this goal as complete?')) {
                  useAppStore.getState().completeGoal(activeGoal.id)
                }
              }}
            />
            <Row
              label="Delete goal"
              destructive
              onTap={() => {
                if (confirm('Delete this goal? This cannot be undone.')) {
                  updateProfile({ goal: { ...activeGoal, is_active: false } })
                }
              }}
            />
          </>
        ) : (
          <Row label="Add a goal" onTap={() => router.push('/onboarding')} />
        )}
      </Card>

      {/* ── Notifications ────────────────────────────── */}
      <SectionLabel>Notifications</SectionLabel>
      <Card>
        <div className="px-4 py-3.5 border-b border-slate-700/40 flex items-center justify-between">
          <p className="text-sm text-white">Daily check-in reminder</p>
          <div className="w-10 h-5.5 bg-slate-700 rounded-full flex items-center px-0.5">
            <div className="w-4 h-4 bg-slate-500 rounded-full" />
          </div>
        </div>
        <div className="px-4 py-3.5 border-b border-slate-700/40 flex items-center justify-between">
          <p className="text-sm text-white">Goal milestone alerts</p>
          <div className="w-10 h-5.5 bg-slate-700 rounded-full flex items-center px-0.5">
            <div className="w-4 h-4 bg-slate-500 rounded-full" />
          </div>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <p className="text-sm text-white">Weekly summary</p>
          <div className="w-10 h-5.5 bg-slate-700 rounded-full flex items-center px-0.5">
            <div className="w-4 h-4 bg-slate-500 rounded-full" />
          </div>
        </div>
      </Card>

      {/* ── Account ──────────────────────────────────── */}
      <SectionLabel>Account</SectionLabel>
      <Card>
        <Row label="Name" value={`${profile.first_name} ${profile.last_name}`.trim()} />
        <Row label="Email" value={profile.email} />
        <Row
          label="Change password"
          onTap={async () => {
            if (supabaseAvailable) {
              const supabase = createClient()
              await supabase.auth.resetPasswordForEmail(profile.email)
              alert('Password reset email sent.')
            }
          }}
        />
        <Row label="Sign out" destructive onTap={signOut} />
      </Card>

      {/* Delete account */}
      <div className="mt-4">
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full text-center text-sm text-red-500 py-3"
          >
            Delete account
          </button>
        ) : (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4">
            <p className="text-sm text-red-300 font-medium mb-1">Delete account</p>
            <p className="text-xs text-slate-400 mb-3">
              This permanently deletes your account and all data. Type DELETE to confirm.
            </p>
            <input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-slate-900 border border-red-800/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setDeleteConfirm(false); setDeleteText('') }}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-sm text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteText !== 'DELETE'}
                className="flex-1 py-2 rounded-xl bg-red-600 text-sm text-white font-medium disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
