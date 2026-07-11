'use client'
import { useState } from 'react'
import { CATEGORIES, US_STATES } from '@/lib/constants'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consented, setConsented] = useState(false)
  const [billingConsented, setBillingConsented] = useState(false)
  const [tier, setTier] = useState<'free' | 'pro'>('free')

  const [form, setForm] = useState({
    business_name: '',
    category_primary: '',
    description_short: '',
    description_long: '',
    geo_primary: '',
    service_delivery: 'remote-only',
    price_tier: '',
    tools_expertise: '',
    email: '',
    website: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const canSubmit = consented && (tier === 'free' || billingConsented)

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    // TODO: wire to submit API
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6 text-center">
        <CheckCircle size={32} className="text-lime mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-parchment mb-2">Listing submitted</h1>
        <p className="text-sm text-muted mb-6">We'll review your listing and publish it within 2 business days. You'll receive a confirmation email at the address you provided.</p>
        <Link href="/directory" className="text-sm text-signal hover:text-signal-light">
          Browse the directory →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-parchment">Add your listing</h1>
        <p className="mt-1.5 text-sm text-muted">
          Get discovered by businesses searching for AI automation expertise.
        </p>
      </div>

      {/* Tier selector */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <button
          onClick={() => setTier('free')}
          className={`rounded-lg border p-4 text-left transition-colors ${tier === 'free' ? 'border-signal bg-signal/5' : 'border-border bg-panel hover:border-ghost'}`}
        >
          <div className="text-sm font-semibold text-parchment mb-1">Free listing</div>
          <div className="text-xs text-muted">Basic profile, inquiry form, standard placement</div>
          <div className="mt-2 text-lg font-mono font-semibold text-parchment">$0</div>
        </button>
        <button
          onClick={() => setTier('pro')}
          className={`rounded-lg border p-4 text-left transition-colors ${tier === 'pro' ? 'border-signal bg-signal/5' : 'border-border bg-panel hover:border-ghost'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-parchment">Pro listing</span>
            <span className="rounded border border-signal/40 px-1.5 py-0.5 text-[10px] font-medium text-signal">PRO</span>
          </div>
          <div className="text-xs text-muted">Priority placement, verified badge, analytics</div>
          <div className="mt-2 text-lg font-mono font-semibold text-parchment">$79<span className="text-sm text-muted">/mo</span></div>
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Business name *</label>
            <input
              type="text"
              value={form.business_name}
              onChange={e => update('business_name', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
              placeholder="Apex Automation Co."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Contact email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Primary category *</label>
            <select
              value={form.category_primary}
              onChange={e => update('category_primary', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment focus:border-signal focus:outline-none"
            >
              <option value="">Select...</option>
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Primary location *</label>
            <input
              type="text"
              value={form.geo_primary}
              onChange={e => update('geo_primary', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
              placeholder="Austin, TX"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Short description * <span className="text-muted normal-case font-normal">(max 160 chars)</span></label>
          <input
            type="text"
            value={form.description_short}
            onChange={e => update('description_short', e.target.value.slice(0, 160))}
            className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
            placeholder="One-line summary shown in directory listings"
          />
          <div className="mt-1 text-right text-[10px] text-muted">{form.description_short.length}/160</div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Full description *</label>
          <textarea
            value={form.description_long}
            onChange={e => update('description_long', e.target.value)}
            rows={5}
            className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none resize-none"
            placeholder="Describe your services, expertise, typical clients, and outcomes. 200–400 words recommended."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Service delivery</label>
            <select
              value={form.service_delivery}
              onChange={e => update('service_delivery', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment focus:border-signal focus:outline-none"
            >
              <option value="remote-only">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Price tier</label>
            <select
              value={form.price_tier}
              onChange={e => update('price_tier', e.target.value)}
              className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment focus:border-signal focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="$">$ — Budget-friendly</option>
              <option value="$$">$$ — Mid-range</option>
              <option value="$$$">$$$ — Premium</option>
              <option value="$$$$">$$$$ — Enterprise</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-ghost mb-1.5 block">Tools & expertise <span className="text-muted normal-case font-normal">(comma-separated)</span></label>
          <input
            type="text"
            value={form.tools_expertise}
            onChange={e => update('tools_expertise', e.target.value)}
            className="w-full rounded border border-border bg-panel px-3 py-2 text-sm text-parchment placeholder:text-muted focus:border-signal focus:outline-none"
            placeholder="Zapier, Make, n8n, OpenAI API, HubSpot"
          />
        </div>

        {/* Pro pricing notice */}
        {tier === 'pro' && (
          <div className="rounded-lg border border-signal/30 bg-signal/5 p-4 text-sm">
            <div className="font-medium text-parchment mb-1">Pro listing — $79/month</div>
            <ul className="text-xs text-muted space-y-1 list-disc list-inside">
              <li>Priority placement in category and search results</li>
              <li>Verified badge after manual review</li>
              <li>Analytics dashboard — views and inquiry counts</li>
              <li>Up to 5 portfolio links and certifications display</li>
              <li>Cancel anytime via your dashboard</li>
            </ul>
          </div>
        )}

        {/* FTC compliance checkboxes */}
        <div className="rounded-lg border border-border bg-panel p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consented}
              onChange={e => setConsented(e.target.checked)}
              className="mt-0.5 flex-shrink-0 accent-signal"
            />
            <span className="text-xs text-muted leading-relaxed">
              I agree to the ConsultAI{' '}
              <Link href="/terms" className="text-signal hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-signal hover:underline">Privacy Policy</Link>.
              I confirm that the information I am submitting is accurate and belongs to a real business.
            </span>
          </label>

          {tier === 'pro' && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={billingConsented}
                onChange={e => setBillingConsented(e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-signal"
              />
              <span className="text-xs text-muted leading-relaxed">
                I authorize ConsultAI to charge <strong className="text-parchment">$79/month</strong> to my payment method for a Pro listing.
                I understand I can cancel at any time from my dashboard with no penalty. Billing begins after listing review and approval.
              </span>
            </label>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full rounded bg-signal py-3 text-sm font-medium text-white hover:bg-signal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : tier === 'pro' ? 'Submit Pro listing — $79/mo' : 'Submit free listing'}
        </button>

        <p className="text-xs text-muted text-center">
          Free listings are reviewed within 2 business days. Pro listings include payment setup after approval.
        </p>
      </div>
    </div>
  )
}
