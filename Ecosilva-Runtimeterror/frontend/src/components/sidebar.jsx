'use client'

import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EcoSilvaMark } from './ecosilva-logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Silviq', href: '/chat', icon: ChatBubbleLeftRightIcon },
]

const secondaryNav = [{ name: 'Setări', href: '/setari', icon: Cog6ToothIcon }]

function NavItem({ item, pathname }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  return (
    <Link
      href={item.href}
      className={clsx(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-neutral-400 hover:bg-white/5 hover:text-white',
      )}
    >
      <item.icon
        className={clsx(
          'size-5 shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white',
        )}
      />
      {item.name}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-neutral-950">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6">
        <EcoSilvaMark className="h-8 w-8" />
        <span className="text-sm font-semibold text-white">EcoSilva</span>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-4">
        <ul className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavItem item={item} pathname={pathname} />
            </li>
          ))}

          <li className="mt-auto border-t border-white/10 pt-4">
            {secondaryNav.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </li>
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t border-white/10 px-4 py-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-neutral-700">
          <span className="text-xs font-medium text-white">U</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">User</p>
          <p className="truncate text-xs text-neutral-400">user@example.com</p>
        </div>
      </div>
    </div>
  )
}
