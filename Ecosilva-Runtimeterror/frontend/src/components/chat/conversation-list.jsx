'use client'

import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useState } from 'react'

export function ConversationList({ conversations, activeId, onSelect, onCreate }) {
  const [query, setQuery] = useState('')

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-950">Sesiuni AI</h2>
        <button
          onClick={onCreate}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          title="Sesiune nouă"
        >
          <PencilSquareIcon className="size-5" />
        </button>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
          <MagnifyingGlassIcon className="size-4 shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută sesiune..."
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 py-1">
        {filtered.map((conv) => (
          <li key={conv.id}>
            <button
              onClick={() => onSelect(conv.id)}
              className={clsx(
                'w-full rounded-lg px-3 py-2.5 text-left transition-colors',
                conv.id === activeId
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50',
              )}
            >
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-gray-900">{conv.title}</p>
                <span className="ml-2 shrink-0 text-xs text-gray-400">{conv.time}</span>
              </div>
              {conv.lastMessage && (
                <p className="mt-0.5 truncate text-xs text-gray-500">{conv.lastMessage}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
