'use client'

import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { EcoSilvaLogo } from '@/components/ecosilva-logo'
import { supabase } from '@/lib/supabase'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      if (authError.message?.includes('Email not confirmed')) {
        setError('Emailul nu a fost confirmat. Verifică inbox-ul Yahoo și apasă linkul de confirmare.')
      } else if (authError.message?.includes('Invalid login credentials')) {
        setError('Email sau parolă incorectă.')
      } else {
        setError(`Eroare: ${authError.message}`)
      }
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="p-7 sm:p-11">
            <Link href="/" title="Acasă">
              <EcoSilvaLogo />
            </Link>

            <h1 className="mt-8 text-base/6 font-medium">Bun venit înapoi!</h1>
            <p className="mt-1 text-sm/5 text-gray-600">
              Autentifică-te cu contul tău instituțional pentru a continua.
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">Email instituțional</Label>
              <Input
                required
                autoFocus
                type="email"
                name="email"
                placeholder="inginer@osgurghiu.ro"
                className={clsx(
                  'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                )}
              />
            </Field>

            <Field className="mt-6 space-y-3">
              <Label className="text-sm/5 font-medium">Parolă</Label>
              <Input
                required
                type="password"
                name="password"
                className={clsx(
                  'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                )}
              />
            </Field>

            <div className="mt-6 flex items-center justify-between text-sm/5">
              <Field className="flex items-center gap-3">
                <Checkbox
                  name="remember-me"
                  className={clsx(
                    'group block size-4 rounded-sm border border-transparent shadow-sm ring-1 ring-black/10',
                    'data-checked:bg-black data-checked:ring-black',
                    'data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black',
                  )}
                >
                  <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
                </Checkbox>
                <Label>Ține-mă autentificat</Label>
              </Field>
              <Link href="#" className="font-medium hover:text-gray-600">
                Ai uitat parola?
              </Link>
            </div>

            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Se autentifică...' : 'Autentificare'}
              </Button>
            </div>
          </form>

          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
            Nu ai cont?{' '}
            <Link href="#" className="font-medium hover:text-gray-600">
              Contactează administratorul ocolului
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
