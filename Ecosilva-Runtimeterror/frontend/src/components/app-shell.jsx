'use client'

import clsx from 'clsx'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { GridPattern } from './grid-pattern'
import { EcoSilvaMark, EcoSilvaMarkInvert } from './ecosilva-logo'

const AppShellContext = createContext(null)

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z" />
      <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z" />
    </svg>
  )
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M2 6h20v2H2zM2 16h20v2H2z" />
    </svg>
  )
}

function AppHeader({ panelId, icon: Icon, expanded, onToggle, toggleRef, invert = false }) {
  let { logoHovered, setLogoHovered } = useContext(AppShellContext)

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-2"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          {invert
            ? <EcoSilvaMarkInvert className="h-9 w-9" />
            : <EcoSilvaMark className="h-9 w-9" />
          }
          <div>
            <p className={clsx('text-xs font-black tracking-wider leading-none', invert ? 'text-white' : 'text-neutral-950')}>
              ECOSILVA
            </p>
            <p className={clsx('text-[8px] tracking-widest leading-none mt-0.5', invert ? 'text-neutral-400' : 'text-neutral-500')}>
              FORESTRY
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-x-8">
          <Link
            href="/dashboard"
            className={clsx(
              'text-sm font-semibold transition',
              invert ? 'text-white hover:text-neutral-300' : 'text-neutral-950 hover:text-neutral-700',
            )}
          >
            Dashboard
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded ? 'true' : 'false'}
            aria-controls={panelId}
            className={clsx(
              'group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-neutral-950/10',
            )}
            aria-label="Toggle navigation"
          >
            <Icon
              className={clsx(
                'h-6 w-6',
                invert
                  ? 'fill-white group-hover:fill-neutral-200'
                  : 'fill-neutral-950 group-hover:fill-neutral-700',
              )}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function NavigationRow({ children }) {
  return (
    <div className="even:mt-px sm:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
      </div>
    </div>
  )
}

function NavigationItem({ href, children }) {
  return (
    <Link
      href={href}
      className="group relative isolate -mx-6 bg-neutral-950 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pr-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16"
    >
      {children}
      <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
    </Link>
  )
}

function Navigation() {
  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/dashboard">Dashboard</NavigationItem>
        <NavigationItem href="/chat">Silviq</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/setari">Setări</NavigationItem>
      </NavigationRow>
    </nav>
  )
}

function AppShellInner({ children }) {
  let panelId = useId()
  let [expanded, setExpanded] = useState(false)
  let [isTransitioning, setIsTransitioning] = useState(false)
  let openRef = useRef(null)
  let closeRef = useRef(null)
  let shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    function onClick(event) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('a')?.href === window.location.href
      ) {
        setIsTransitioning(false)
        setExpanded(false)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig
      transition={
        shouldReduceMotion || !isTransitioning ? { duration: 0 } : undefined
      }
    >
      <header>
        <div
          className="absolute top-2 right-0 left-0 z-40 pt-14"
          aria-hidden={expanded ? 'true' : undefined}
          inert={expanded ? true : undefined}
        >
          <AppHeader
            panelId={panelId}
            icon={MenuIcon}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setIsTransitioning(true)
              setExpanded((v) => !v)
              window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }))
            }}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-neutral-950 pt-2"
          aria-hidden={expanded ? undefined : 'true'}
          inert={expanded ? undefined : true}
        >
          <motion.div layout className="bg-neutral-800">
            <div className="bg-neutral-950 pt-14 pb-16">
              <AppHeader
                invert
                panelId={panelId}
                icon={XIcon}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setIsTransitioning(true)
                  setExpanded((v) => !v)
                  window.setTimeout(() => openRef.current?.focus({ preventScroll: true }))
                }}
              />
            </div>
            <Navigation />
            <div className="relative bg-neutral-950 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
              <div className="mx-auto max-w-7xl px-6 py-10 pb-16 lg:px-8">
                <p className="font-display text-base font-semibold text-white">OS Gurghiu</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Monitorizare păduri · Date Global Forest Watch
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex min-h-screen flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div layout className="relative isolate flex w-full flex-col pt-9">
          <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-neutral-50 stroke-neutral-950/5"
            yOffset={-96}
            interactive
          />
          <main className="w-full flex-auto">{children}</main>
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

export function AppShell({ children }) {
  let pathname = usePathname()
  let [logoHovered, setLogoHovered] = useState(false)

  return (
    <AppShellContext.Provider value={{ logoHovered, setLogoHovered }}>
      <AppShellInner key={pathname}>{children}</AppShellInner>
    </AppShellContext.Provider>
  )
}
