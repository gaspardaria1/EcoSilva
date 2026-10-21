'use client'

import { PaperAirplaneIcon, SparklesIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function callAI(prompt) {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || `Eroare server: ${response.status}`)
  }
  return response.json()
}

// ─── Markdown renderer simplu ───────────────────────────────────────────────
function MarkdownText({ text }) {
  const lines = (text || '').split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />
        const isH3 = line.startsWith('### ')
        const isH4 = line.startsWith('#### ')
        const isBullet = /^[-*]\s/.test(line)
        const isNumbered = /^\d+\.\s/.test(line)
        const content = line.replace(/^#{1,4}\s/, '').replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '')
        const rendered = content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
            : part
        )
        if (isH3) return <p key={i} className="mt-2 font-semibold text-gray-900">{rendered}</p>
        if (isH4) return <p key={i} className="mt-1 font-medium text-gray-800">{rendered}</p>
        if (isBullet || isNumbered) return (
          <div key={i} className="flex gap-2">
            <span className="shrink-0 text-gray-400">{isBullet ? '•' : line.match(/^\d+/)[0] + '.'}</span>
            <span>{rendered}</span>
          </div>
        )
        return <p key={i}>{rendered}</p>
      })}
    </div>
  )
}

// ─── Mini bar chart ──────────────────────────────────────────────────────────
function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 truncate text-xs text-gray-500">{label}</span>
      <div className="flex-1 rounded-full bg-gray-100 h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-xs font-medium text-gray-700">{value}</span>
    </div>
  )
}

function ChartsBlock({ charts }) {
  if (!charts) return null
  const speciesMax = Math.max(...(charts.species || []).map((s) => s.value), 1)
  const ageMax = Math.max(...(charts.age || []).map((s) => s.value), 1)
  const cutsMax = Math.max(...(charts.cuts || []).map((s) => s.value), 1)
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {charts.species?.length > 0 && (
        <div className="rounded-xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
          <p className="mb-2 text-xs font-semibold text-gray-700">Specii</p>
          <div className="space-y-1.5">
            {charts.species.map((s) => <MiniBar key={s.label} label={s.label} value={s.value} max={speciesMax} color="bg-emerald-400" />)}
          </div>
        </div>
      )}
      {charts.age?.length > 0 && (
        <div className="rounded-xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
          <p className="mb-2 text-xs font-semibold text-gray-700">Vârstă</p>
          <div className="space-y-1.5">
            {charts.age.map((s) => <MiniBar key={s.label} label={s.label} value={s.value} max={ageMax} color="bg-blue-400" />)}
          </div>
        </div>
      )}
      {charts.cuts?.length > 0 && (
        <div className="rounded-xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
          <p className="mb-2 text-xs font-semibold text-gray-700">Tăieri</p>
          <div className="space-y-1.5">
            {charts.cuts.map((s) => <MiniBar key={s.label} label={s.label} value={s.value} max={cutsMax}
              color={s.label.includes('ilegal') ? 'bg-red-400' : 'bg-amber-400'} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Coaching block interactiv ───────────────────────────────────────────────
function CoachingBlock({ coaching, onChipClick }) {
  if (!coaching) return null
  const { understood, missing, chips, level, score } = coaching
  return (
    <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <SparklesIcon className="size-3.5 text-emerald-600" />
        <span className="text-xs font-semibold text-emerald-700">Coaching prompt</span>
        <span className={clsx(
          'ml-auto rounded-full px-2 py-0.5 text-xs font-medium',
          score <= 1 ? 'bg-red-100 text-red-600' : score <= 3 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600',
        )}>
          {level}
        </span>
      </div>

      <p className="text-xs text-emerald-800">
        <span className="font-medium">Am înțeles că vrei:</span> {understood}.
      </p>

      {missing?.length > 0 && (
        <p className="mt-1 text-xs text-emerald-700">
          <span className="font-medium">Adaugă în prompt:</span> {missing.join(', ')}.
        </p>
      )}

      {chips?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick?.(chip)}
              className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-600 hover:text-white hover:ring-emerald-600 active:scale-95 transition-all cursor-pointer"
              title="Click pentru a adăuga în input"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <p className="mt-2 text-[10px] text-emerald-500">↑ Click pe un chip pentru a-l adăuga în input</p>
    </div>
  )
}

// ─── Mesaj de start ──────────────────────────────────────────────────────────
const seedMessage = {
  id: 1,
  role: 'assistant',
  content: 'Bună ziua! Sunt **Silviq**, asistentul AI pentru ingineri silvici.\n\nPoți să mă întrebi despre arbori, tăieri ilegale, rapoarte pe zone sau perioade. Răspund cu date reale din baza de date EcoSilva.',
  coaching: null,
  charts: null,
}

// ─── ChatPanel ───────────────────────────────────────────────────────────────
export function ChatPanel({
  conversationId,
  initialMessages,
  suggestedPrompt,
  onSuggestionUsed,
  onMessagesChange,
}) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages?.length > 0 ? initialMessages : [seedMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Notifică pagina de fiecare dată când mesajele se schimbă
  useEffect(() => {
    onMessagesChange?.(messages)
  }, [messages])

  useEffect(() => {
    if (suggestedPrompt) {
      setInput(suggestedPrompt)
      textareaRef.current?.focus()
      onSuggestionUsed?.()
    }
  }, [suggestedPrompt])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Chip coaching click → adaugă în input + focus
  function handleChipClick(chip) {
    const tag = chip.replace(/^\+\s*/, '').trim()
    setInput((prev) => {
      const base = prev.trimEnd()
      return base ? `${base} ${tag}` : tag
    })
    textareaRef.current?.focus()
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: text, coaching: null, charts: null }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { answer, coaching, charts } = await callAI(text)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: answer, coaching, charts },
      ])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: `**Eroare:** ${e.message}`, coaching: null, charts: null },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header — ascuns pe mobil (înlocuit de bara din chat/page.jsx) */}
      <div className="hidden sm:flex border-b border-gray-100 bg-white px-6 py-3 items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-gray-950">Silviq — AI Silvic</h2>
          </div>
          <p className="text-xs text-gray-400">Date reale Supabase · Gemini 2.5 Flash</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="size-4" />
          Ieșire
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx(
                  'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gray-950 text-white'
                    : 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5',
                )}>
                  {msg.role === 'user' ? msg.content : <MarkdownText text={msg.content} />}
                </div>
              </div>
              {msg.role === 'assistant' && msg.charts && (
                <ChartsBlock charts={msg.charts} />
              )}
              {msg.role === 'assistant' && msg.coaching && (
                <div className="mt-1 max-w-[88%]">
                  <CoachingBlock coaching={msg.coaching} onChipClick={handleChipClick} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 animate-bounce rounded-full bg-emerald-400"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-3 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-xl bg-gray-50 px-3 py-2.5 ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow sm:px-4 sm:py-3 sm:gap-3">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Întreabă despre arbori, tăieri, zone..."
              className="flex-1 resize-none bg-transparent text-sm text-gray-950 placeholder-gray-400 outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-all hover:bg-emerald-700 disabled:opacity-30 active:scale-95"
            >
              <PaperAirplaneIcon className="size-4" />
            </button>
          </div>
          <p className="mt-1.5 hidden text-center text-xs text-gray-400 sm:block">
            Enter pentru trimite · Shift+Enter pentru linie nouă
          </p>
        </div>
      </div>
    </div>
  )
}
