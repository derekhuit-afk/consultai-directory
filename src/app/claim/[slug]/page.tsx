'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Mail, CheckCircle } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export default function ClaimPage({ params }: Props) {
  const { slug } = params
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClaim() {
    if (!email) { setError('Email is required.'); return }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard?claim=${slug}`,
        },
      })
      if (authError) throw authError
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 text-center">
        <CheckCircle size={32} className="text-lime mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-parchment mb-2">Check your email</h1>
        <p className="text-sm text-muted">
          Magic link sent to <strong className="text-parchment">{email}</strong>. Click it to verify and access your dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-panel">
          <Mail size={20} className="text-signal" />
        </div>
        <h1 className="text-xl font-semibold text-parchment">Claim your listing</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your business email. We will send a verification link to confirm ownership.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-panel p-6 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">
            Business email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded border border-border bg-slate px-3 py-2.5 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
            placeholder="you@yourcompany.com"
          />
        </div>

        {error && <p className="text-xs text-ember">{error}</p>}

        <button
          onClick={handleClaim}
          disabled={loading || !email}
          className="w-full rounded bg-signal py-2.5 text-sm font-medium text-white hover:bg-signal-light transition-colors disabled:opacity-40"
        >
          {loading ? 'Sending...' : 'Send verification link'}
        </button>

        <p className="text-[10px] text-muted text-center">
          Listing: <span className="font-mono text-ghost">{slug}</span>
        </p>
      </div>
    </div>
  )
}
