'use client'

import { ChatPanel } from '@/components/chat/chat-panel'
import { ConversationList } from '@/components/chat/conversation-list'
import { supabase } from '@/lib/supabase'
import { promptSuggestions } from '@/lib/mock-data'
import { LightBulbIcon, Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function storageKey(userId) {
  return `ecosilva_conversations_${userId}`
}

function loadFromStorage(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(userId, data) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data))
  } catch {}
}

const makeConv = (id, title = 'Sesiune nouă') => ({
  id,
  title,
  lastMessage: '',
  time: 'Acum',
})

export default function ChatPage() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [allMessages, setAllMessages] = useState({})
  const [suggestedPrompt, setSuggestedPrompt] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id || 'guest'
      setUserId(uid)

      const saved = loadFromStorage(uid)
      if (saved?.conversations?.length > 0) {
        setConversations(saved.conversations)
        setAllMessages(saved.messages || {})
        setActiveId(saved.conversations[0].id)
      } else {
        const firstId = Date.now()
        const firstConv = makeConv(firstId, 'Prima sesiune')
        setConversations([firstConv])
        setActiveId(firstId)
      }
    })
  }, [])

  useEffect(() => {
    if (!userId || conversations.length === 0) return
    saveToStorage(userId, { conversations, messages: allMessages })
  }, [userId, conversations, allMessages])

  function createConversation() {
    const id = Date.now()
    const conv = makeConv(id)
    setConversations((prev) => [conv, ...prev])
    setActiveId(id)
    setSidebarOpen(false)
  }

  function handleSelectConversation(id) {
    setActiveId(id)
    setSidebarOpen(false)
  }

  function handleMessages(convId, messages) {
    setAllMessages((prev) => ({ ...prev, [convId]: messages }))

    const userMsgs = messages.filter((m) => m.role === 'user')
    if (userMsgs.length === 0) return

    const firstUserMsg = userMsgs[0].content.slice(0, 40)
    const lastMsg = messages[messages.length - 1]

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: firstUserMsg + (firstUserMsg.length >= 40 ? '...' : ''),
              lastMessage: lastMsg?.role === 'assistant'
                ? lastMsg.content.replace(/\*\*/g, '').slice(0, 50) + '...'
                : '',
              time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
            }
          : c,
      ),
    )
  }

  if (!activeId) return null

  return (
    <div className="fixed inset-x-0 bottom-0 top-[6.25rem] flex overflow-hidden bg-white">

      {/* ── Sidebar overlay pe mobil ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={[
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 sm:relative sm:translate-x-0 sm:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
      ].join(' ')}>
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onCreate={createConversation}
        />

        {/* Sugestii prompturi */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => setShowSuggestions((v) => !v)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
          >
            <LightBulbIcon className="size-3.5" />
            Sugestii prompturi
            <span className="ml-auto">{showSuggestions ? '▲' : '▼'}</span>
          </button>
          {showSuggestions && (
            <ul className="mt-1 space-y-0.5">
              {promptSuggestions.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => { setSuggestedPrompt(s); setSidebarOpen(false) }}
                    className="w-full rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* ── Chat ── */}
      <div className="flex min-w-0 flex-1 flex-col bg-gray-50">
        {/* Header mobil */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2 sm:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon className="size-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-gray-950">Silviq AI</span>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.replace('/login') }}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowRightOnRectangleIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatPanel
            key={activeId}
            conversationId={activeId}
            initialMessages={allMessages[activeId]}
            suggestedPrompt={suggestedPrompt}
            onSuggestionUsed={() => setSuggestedPrompt(null)}
            onMessagesChange={(msgs) => handleMessages(activeId, msgs)}
          />
        </div>
      </div>
    </div>
  )
}
