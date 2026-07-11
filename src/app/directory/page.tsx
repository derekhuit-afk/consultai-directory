import { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import ListingCard from '@/components/directory/ListingCard'
import FilterBar from '@/components/directory/FilterBar'
import { Listing } from '@/types'

export const metadata: Metadata = {
  title: 'Browse All AI Automation Consultants',
  description: 'Find verified AI automation consultants across workflow automation, AI integration, data analytics, AI copywriting, and strategy.',
}

type SearchParams = Record<string, string | undefined>

async function getListings(params: SearchParams): Promise<Listing[]> {
  const supabase = await createServerSupabaseClient()
  let query = supabase.from('listings').select('*')

  if (params.availability) query = query.eq('availability_status', params.availability)
  if (params.price) query = query.eq('price_tier', params.price)
  if (params.delivery) query = query.eq('service_delivery', params.delivery)

  const { data } = await query
    .order('is_sponsored', { ascending: false })
    .order('tier', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(100)

  return data || []
}

export default async function DirectoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = searchParams
  const listings = await getListings(params)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-parchment">AI Automation Consultants</h1>
        <p className="mt-1.5 text-sm text-muted">
          {listings.length} verified consultants across {CATEGORIES.length} specialties
        </p>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/directory" className="rounded-full border border-signal bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
          All
        </Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/directory/${cat.slug}`}
            className="rounded-full border border-border px-3 py-1 text-xs text-ghost hover:border-signal hover:text-parchment transition-colors"
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <FilterBar currentParams={params} basePath="/directory" />
        </aside>

        {/* Listings grid */}
        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="rounded-lg border border-border bg-panel p-12 text-center">
              <p className="text-muted text-sm">No listings match your filters.</p>
              <Link href="/directory" className="mt-3 inline-block text-xs text-signal hover:text-signal-light">
                Clear filters →
              </Link>
            </div>
          ) : (
            <div className="grid-listing">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
