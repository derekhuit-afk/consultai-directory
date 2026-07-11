import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { MessageSquare, Edit, BarChart2, Shield } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/claim/dashboard-login')
  }

  // Get owned listing
  const { data: ownership } = await supabase
    .from('listing_owners')
    .select('listing_id')
    .eq('user_id', user.id)
    .single()

  let listing = null
  let inquiryCount = 0

  if (ownership) {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('id', ownership.listing_id)
      .single()
    listing = data

    const { count } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', ownership.listing_id)

    inquiryCount = count || 0
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-parchment">Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">{user.email}</p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="text-xs text-muted hover:text-parchment transition-colors">
            Sign out
          </button>
        </form>
      </div>

      {!listing ? (
        <div className="rounded-lg border border-border bg-panel p-8 text-center">
          <h2 className="text-base font-semibold text-parchment mb-2">No listing found</h2>
          <p className="text-sm text-muted mb-4">You don't have a listing yet. Submit one to get started.</p>
          <Link href="/submit" className="rounded bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-light transition-colors">
            Submit a listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Listing header */}
          <div className="rounded-lg border border-border bg-panel p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-parchment">{listing.business_name}</h2>
                <p className="text-xs text-muted mt-1">{listing.category_primary} · {listing.geo_primary}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  listing.tier === 'pro'
                    ? 'border border-signal/40 bg-signal/10 text-signal'
                    : 'border border-border bg-slate text-ghost'
                }`}>
                  {listing.tier === 'pro' ? 'PRO' : 'FREE'}
                </span>
                {listing.verified_status && (
                  <span className="flex items-center gap-1 rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 text-[10px] text-lime">
                    <Shield size={9} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-panel p-5">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={14} className="text-signal" />
                <span className="text-xs text-ghost">Total inquiries</span>
              </div>
              <div className="text-2xl font-semibold text-parchment">{inquiryCount}</div>
            </div>
            <div className="rounded-lg border border-border bg-panel p-5">
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 size={14} className="text-signal" />
                <span className="text-xs text-ghost">Avg rating</span>
              </div>
              <div className="text-2xl font-semibold text-parchment">
                {listing.avg_rating ? listing.avg_rating.toFixed(1) : '—'}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-panel p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-ghost">Availability</span>
              </div>
              <div className="text-sm font-medium text-parchment capitalize">
                {listing.availability_status.replace(/-/g, ' ')}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-border bg-panel p-6">
            <h3 className="text-sm font-semibold text-parchment mb-4">Manage listing</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/listing"
                className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm text-ghost hover:border-signal hover:text-parchment transition-colors"
              >
                <Edit size={13} />
                Edit profile
              </Link>
              <Link
                href="/dashboard/inquiries"
                className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm text-ghost hover:border-signal hover:text-parchment transition-colors"
              >
                <MessageSquare size={13} />
                View inquiries
                {inquiryCount > 0 && (
                  <span className="rounded-full bg-signal px-1.5 py-0.5 text-[10px] font-medium text-white">{inquiryCount}</span>
                )}
              </Link>
              {listing.tier === 'free' && (
                <Link
                  href="/submit?tier=pro&upgrade=true"
                  className="flex items-center gap-2 rounded bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-light transition-colors"
                >
                  Upgrade to Pro — $79/mo
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
