'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function CancelPage() {
  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' })
      if (!res.ok) throw new Error('Cancellation failed')
      setCancelled(true)
    } catch {
      setError('Cancellation failed. Please email derekhuit@gmail.com for immediate assistance.')
    } finally {
      setLoading(false)
    }
  }

  if (cancelled) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 text-center">
        <CheckCircle size={32} className="text-lime mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-parchment mb-2">Subscription cancelled</h1>
        <p className="text-sm text-muted">
          Your Pro listing subscription has been cancelled. Your listing will revert to free tier at the end of your current billing period.
          No further charges will be made.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm text-signal hover:text-signal-light">
          Back to dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber/30 bg-amber/10">
          <AlertTriangle size={20} className="text-amber" />
        </div>
        <h1 className="text-xl font-semibold text-parchment">Cancel Pro subscription</h1>
        <p className="mt-2 text-sm text-muted">
          Your listing will revert to the free tier at the end of your current billing period. All your listing data is preserved.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-panel p-6 space-y-4">
        <div className="text-sm text-muted space-y-2">
          <p>What happens when you cancel:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Pro listing badge and priority placement are removed at period end</li>
            <li>Your listing remains live on the free tier</li>
            <li>Inquiry form continues to work</li>
            <li>No further charges</li>
          </ul>
        </div>

        {error && <p className="text-xs text-ember">{error}</p>}

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full rounded border border-ember/40 bg-ember/10 py-2.5 text-sm font-medium text-ember hover:bg-ember/20 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cancelling...' : 'Confirm cancellation'}
        </button>

        <Link
          href="/dashboard"
          className="block w-full rounded border border-border py-2.5 text-center text-sm text-ghost hover:text-parchment transition-colors"
        >
          Keep my Pro listing
        </Link>
      </div>
    </div>
  )
}
