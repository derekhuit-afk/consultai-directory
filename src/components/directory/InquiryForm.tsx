'use client'
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

interface Props {
  listingId: string
  businessName: string
}

export default function InquiryForm({ listingId, businessName }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    project_type: '',
    timeline: '',
    message: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.project_type || !form.timeline) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_id: listingId }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-lime/30 bg-lime/5 p-6 text-center">
        <CheckCircle size={24} className="text-lime mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-parchment mb-1">Inquiry sent</h3>
        <p className="text-xs text-muted">
          {businessName} will be in touch shortly. You'll receive a confirmation at the email you provided.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <h3 className="text-sm font-semibold text-parchment mb-4">Send an inquiry</h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={e => update('company', e.target.value)}
            className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Project type *</label>
          <select
            value={form.project_type}
            onChange={e => update('project_type', e.target.value)}
            className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment focus:border-signal focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="automation-audit">Automation Audit</option>
            <option value="new-build">New Build</option>
            <option value="ongoing-support">Ongoing Support</option>
            <option value="strategy">Strategy / Advisory</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Timeline *</label>
          <select
            value={form.timeline}
            onChange={e => update('timeline', e.target.value)}
            className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment focus:border-signal focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="asap">ASAP</option>
            <option value="1-3-months">1–3 months</option>
            <option value="3-6-months">3–6 months</option>
            <option value="exploring">Just exploring</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1 block">Message</label>
          <textarea
            value={form.message}
            onChange={e => update('message', e.target.value)}
            rows={3}
            className="w-full rounded border border-border bg-slate px-3 py-2 text-xs text-parchment placeholder:text-muted focus:border-signal focus:outline-none resize-none"
            placeholder="Brief description of your project or question..."
          />
        </div>

        {error && <p className="text-xs text-ember">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-signal py-2.5 text-xs font-medium text-white hover:bg-signal-light transition-colors disabled:opacity-50"
        >
          <Send size={12} />
          {loading ? 'Sending...' : 'Send inquiry'}
        </button>

        <p className="text-[10px] text-muted text-center leading-relaxed">
          Your message is forwarded directly to {businessName}. No spam, ever.
        </p>
      </div>
    </div>
  )
}
