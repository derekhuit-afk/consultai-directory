import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import { Listing } from '@/types'
import ListingCard from '@/components/directory/ListingCard'
import { Search, CheckCircle, Zap } from 'lucide-react'

async function getFeaturedListings(): Promise<Listing[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('tier', 'pro')
    .eq('availability_status', 'accepting-clients')
    .order('avg_rating', { ascending: false })
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const featured = await getFeaturedListings()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#4F6EF720_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              {featured.length > 0 ? `${featured.length} verified consultants accepting clients now` : 'Verified consultant directory'}
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-parchment sm:text-5xl md:text-6xl">
              Find the right{' '}
              <span className="text-gradient">AI consultant</span>{' '}
              for your business
            </h1>

            <p className="mt-5 text-lg text-muted max-w-xl">
              Curated directory of verified AI automation specialists. Filter by tools, industry, location, and real-time availability — not stale listings.
            </p>

            {/* Search bar (decorative, links to directory) */}
            <Link
              href="/directory"
              className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-panel px-4 py-3 text-ghost hover:border-signal transition-colors max-w-lg"
            >
              <Search size={16} className="text-muted flex-shrink-0" />
              <span className="text-sm">Search consultants by tools, industry, or location...</span>
            </Link>

            {/* Quick filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Zapier', 'Make', 'OpenAI API', 'n8n', 'Salesforce', 'dbt'].map(tool => (
                <Link
                  key={tool}
                  href={`/directory?tool=${tool.toLowerCase().replace(' ', '-')}`}
                  className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-ghost hover:border-signal hover:text-parchment transition-colors"
                >
                  {tool}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-slate">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-8 text-xs text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle size={13} className="text-lime" />
              <span>Manually verified listings</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-signal" />
              <span>Real-time availability status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              <span>Updated quarterly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-lg font-semibold text-parchment mb-6">Browse by specialty</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/directory/${cat.slug}`}
              className="group rounded-lg border border-border bg-panel p-4 card-hover"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-parchment group-hover:text-signal transition-colors leading-snug">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-parchment">Featured consultants</h2>
            <Link href="/directory" className="text-sm text-signal hover:text-signal-light transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid-listing">
            {featured.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* CTA — Add listing */}
      <section className="border-t border-border bg-slate">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-parchment">Are you an AI automation consultant?</h2>
              <p className="text-sm text-muted mt-1">Add your listing and reach clients actively searching for your expertise.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/submit" className="rounded border border-border px-4 py-2 text-sm text-ghost hover:border-signal hover:text-parchment transition-colors">
                Free listing
              </Link>
              <Link href="/submit?tier=pro" className="rounded bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-light transition-colors">
                Pro listing — $79/mo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
