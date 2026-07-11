import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { CATEGORIES, US_STATES, SITE_NAME } from '@/lib/constants'
import ListingCard from '@/components/directory/ListingCard'
import FilterBar from '@/components/directory/FilterBar'
import { Listing } from '@/types'

interface Props {
  params: { category: string }
  searchParams: Record<string, string | undefined>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) return {}

  return {
    title: `${cat.name} Consultants`,
    description: `Find verified ${cat.name.toLowerCase()} consultants. Filter by tools, industry, location, and real-time availability.`,
    alternates: { canonical: `/directory/${category}` },
  }
}

async function getListings(category: string, searchParams: Record<string, string | undefined>): Promise<Listing[]> {
  const supabase = await createServerSupabaseClient()
  let query = supabase.from('listings').select('*').eq('category_primary', category)

  if (searchParams.availability) query = query.eq('availability_status', searchParams.availability)
  if (searchParams.price) query = query.eq('price_tier', searchParams.price)
  if (searchParams.delivery) query = query.eq('service_delivery', searchParams.delivery)

  const { data } = await query
    .order('is_sponsored', { ascending: false })
    .order('tier', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(100)

  return data || []
}

async function getStateBreakdown(category: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('listings')
    .select('geo_primary')
    .eq('category_primary', category)

  const states: Record<string, number> = {}
  data?.forEach(l => {
    const state = l.geo_primary?.split(', ')[1]
    if (state) states[state] = (states[state] || 0) + 1
  })
  return Object.entries(states).sort((a, b) => b[1] - a[1]).slice(0, 8)
}

const stateToSlug: Record<string, string> = {
  'TX': 'texas', 'CA': 'california', 'NY': 'new-york', 'IL': 'illinois',
  'WA': 'washington', 'GA': 'georgia', 'OR': 'oregon', 'MN': 'minnesota',
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = params
  const sp = searchParams
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) notFound()

  const [listings, stateBreakdown] = await Promise.all([
    getListings(category, sp),
    getStateBreakdown(category),
  ])

  // JSON-LD for ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.name} Consultants`,
    description: `Curated directory of verified ${cat.name.toLowerCase()} consultants.`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/directory/${category}/${l.slug}`,
      name: l.business_name,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
          <Link href="/directory" className="hover:text-parchment transition-colors">Directory</Link>
          <span>/</span>
          <span className="text-ghost">{cat.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{cat.icon}</span>
            <h1 className="text-2xl font-semibold text-parchment">{cat.name} Consultants</h1>
          </div>

          {/* Editorial intro */}
          <div className="mt-4 rounded-lg border border-border bg-panel p-5">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Finding the right {cat.name.toLowerCase()} consultant means more than a Google search.
              The market varies significantly by tools expertise, industry focus, and actual availability.
              This directory lists only verified, actively maintained profiles — no stale agencies or generalists who dabble.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Before booking a discovery call: check which tools they are certified in (not just "automation" generically),
              whether case studies name measurable outcomes, and their current availability status.
              A consultant on waitlist is often a quality signal. Use the filters to narrow to what matters for your project.
            </p>
            <p className="mt-3 text-xs text-ghost">
              {listings.length} verified listings · Updated quarterly
            </p>
          </div>
        </div>

        {/* State filter pills */}
        {stateBreakdown.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-xs text-muted py-1">By state:</span>
            {stateBreakdown.map(([state, count]) => {
              const slug = stateToSlug[state]
              if (!slug) return null
              return (
                <Link
                  key={state}
                  href={`/directory/${category}/${slug}`}
                  className="rounded-full border border-border px-3 py-1 text-xs text-ghost hover:border-signal hover:text-parchment transition-colors"
                >
                  {state} <span className="text-muted">({count})</span>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <FilterBar currentParams={sp} basePath={`/directory/${category}`} />
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {listings.length === 0 ? (
              <div className="rounded-lg border border-border bg-panel p-12 text-center">
                <p className="text-muted text-sm">No listings match your filters.</p>
                <Link href={`/directory/${category}`} className="mt-3 inline-block text-xs text-signal hover:text-signal-light">
                  Clear filters →
                </Link>
              </div>
            ) : (
              <div className="grid-listing">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} categorySlug={category} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-14 max-w-2xl">
          <h2 className="text-base font-semibold text-parchment mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            <details className="rounded-lg border border-border bg-panel p-4">
              <summary className="cursor-pointer text-sm font-medium text-parchment">
                How much does a {cat.name.toLowerCase()} consultant typically cost?
              </summary>
              <p className="mt-3 text-xs text-muted leading-relaxed">
                Rates range from $500 for small project-based work to $25,000+ for enterprise engagements. Use the price tier filter to narrow results to your budget. Most consultants listed here offer a free discovery call before committing to a scope.
              </p>
            </details>
            <details className="rounded-lg border border-border bg-panel p-4">
              <summary className="cursor-pointer text-sm font-medium text-parchment">
                How do I find a {cat.name.toLowerCase()} consultant available right now?
              </summary>
              <p className="mt-3 text-xs text-muted leading-relaxed">
                Filter by Availability → Accepting clients. Of the {listings.length} consultants in this category, those marked with a green indicator are actively taking new projects. Waitlisted consultants are worth contacting for projects starting in 30–60 days.
              </p>
            </details>
            <details className="rounded-lg border border-border bg-panel p-4">
              <summary className="cursor-pointer text-sm font-medium text-parchment">
                Do I need a local consultant or can I work remotely?
              </summary>
              <p className="mt-3 text-xs text-muted leading-relaxed">
                Most {cat.name.toLowerCase()} consultants work fully remote. Filter by Service Delivery → Remote only to see all consultants who can serve any location. Remote engagements significantly expand your options beyond your local market.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  )
}
