'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const C = {
  active: '#0F5AC2',
  inactive: '#3a3f60',
  bg: '#141628',
  border: '#2a2d45',
}

const NAV_ITEMS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/chat', label: 'Chat', Icon: ChatIcon },
  { href: '/resources', label: 'Resources', Icon: ResourcesIcon },
  { href: '/account', label: 'Account', Icon: AccountIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: C.bg, borderTop: `0.5px solid ${C.border}` }}
    >
      <div className="max-w-md mx-auto flex items-end justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href
          const color = active ? C.active : C.inactive
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-1 px-4 min-w-0"
            >
              {/* Active indicator dot */}
              <span
                className="block w-1 h-1 rounded-full mb-0.5 transition-opacity"
                style={{ background: C.active, opacity: active ? 1 : 0 }}
              />
              <Icon color={color} />
              <span className="text-[10px] font-medium" style={{ color }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function ChatIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResourcesIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccountIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  )
}
