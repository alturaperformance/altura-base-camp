'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppStore, getDaysUntilGoal } from '@/lib/demo-store'
import { determineState } from '@/lib/state-machine'
import { generateSuggestedPrompts } from '@/lib/chat-prompts'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { SuggestedPrompts } from '@/components/chat/SuggestedPrompts'
import { ChatLimitModal } from '@/components/chat/ChatLimitModal'
import type { AppContext } from '@/types/insights'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getLocalDate(): string {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

export default function ChatPage() {
  const { profile, checkins } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [prompts, setPrompts] = useState<string[]>([])
  const [promptsLoading, setPromptsLoading] = useState(true)
  const [limitReached, setLimitReached] = useState(false)
  const [promptsVisible, setPromptsVisible] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionDate = getLocalDate()

  // Phase 1: Load today's conversation history
  useEffect(() => {
    if (!profile) return
    fetch(`/api/chat?date=${sessionDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
            role: m.role,
            content: m.content,
          })))
          if (data.userMessageCount >= 5) setLimitReached(true)
          if (data.messages.length > 0) setPromptsVisible(false)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [profile, sessionDate])

  // Phase 2: Generate suggested prompts
  useEffect(() => {
    if (!profile) return
    const activeGoal = profile.goal?.is_active ? profile.goal : null
    const daysUntilGoal = getDaysUntilGoal(activeGoal)
    const context: AppContext = {
      profile,
      checkins,
      checkinToday: false,
      readinessScore: null,
      checkinCount: checkins.length,
      activeGoal,
      secondaryGoal: null,
      daysUntilGoal,
      daysSinceGoal: null,
      showUnlockInterstitial: false,
      integrations: profile.integrations,
    }
    const state = determineState(context)
    void state // used indirectly via context
    setPrompts(generateSuggestedPrompts(context))
    setPromptsLoading(false)
  }, [profile, checkins])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading || limitReached) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setPromptsVisible(false)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: messages,
          sessionDate,
        }),
      })
      const data = await res.json()
      if (data.error === 'daily_limit_reached') {
        setLimitReached(true)
        return
      }
      if (data.error) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: `Error: ${data.error}${data.detail ? ` — ${data.detail}` : ''}`,
        }])
        return
      }
      if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
        if (data.limitReached) setLimitReached(true)
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: `Something went wrong: ${err instanceof Error ? err.message : String(err)}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const activeGoal = profile?.goal?.is_active ? profile.goal : null
  const welcomeMsg = activeGoal
    ? `Ask me anything about altitude, your training, or how to prepare for ${activeGoal.name}.`
    : 'Ask me anything about altitude, your training, or how to perform your best at elevation.'

  return (
    <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white">Altitude Coach</h1>
        <p className="text-xs text-slate-400 mt-0.5">Altura Base Camp · Powered by Claude</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-400 leading-relaxed px-1 py-4">{welcomeMsg}</p>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))
        )}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-navy-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Limit modal + input area */}
      <div className="shrink-0">
        {limitReached && <ChatLimitModal />}

        {!limitReached && (
          <>
            {/* Suggested prompts */}
            {promptsVisible && !loadingHistory && (
              <div className="px-4 mb-3">
                <SuggestedPrompts
                  prompts={prompts}
                  loading={promptsLoading}
                  onSelect={(p) => sendMessage(p)}
                />
              </div>
            )}

            {/* Input */}
            <div className="flex items-end gap-2 px-4 pb-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder="Ask about altitude…"
                rows={1}
                disabled={loadingHistory}
                className="flex-1 resize-none bg-navy-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 disabled:opacity-50 max-h-32"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading || loadingHistory}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 flex items-center justify-center shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
