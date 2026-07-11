import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { CATEGORIES, SITE_URL } from '@/lib/constants'
import { Listing, Review } from '@/types'
import { MapPin, Clock, Star, CheckCircle, ExternalLink, Linkedin } from 'lucide-react'
import InquiryForm from '@/components/directory/InquiryForm'

interface Props {
  params: { category: string; slug: string }
}

async function getListing(slug: string): Promise<Listing | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('listings').select('*').eq('slug', slug).single()
  return data
}

async function getReviews(listingId: string): Promise<Review[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('reviews').select('*').eq('listing_id', listingId).order('created_at', { ascending: false }).limit(5)
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const listing = await getListing(slug)
  if (!listing) return {}
  return {
    title: `${listing.business_name} — AI Automation Consultant`,
    description: listing.description_short,
    alternates: { canonical: `/directory/${listing.category_primary}/${slug}` },
  }
}

const availabilityConfig = {
  'accepting-clients': { label: 'Accepting clients', color: 'text-lime', bg: 'bg-lime/10', dot: 'bg-lime' },
  'waitlist': { label: 'Waitlist', color: 'text-amber', bg: 'bg-amber/10', dot: 'bg-amber' },
  'unavailable': { label: 'Unavailable', color: 'text-ember', bg: 'bg-ember/10', dot: 'bg-ember' },
}

export default async function ListingPage({ params }: Props) {
  const { category, slug } = params
  const [listing, cat] = await Promise.all([
    getListing(slug),
    Promise.resolve(CATEGORIES.find(c => c.slug === category)),
  ])

  if (!listing || !cat) notFound()

  const reviews = await getReviews(listing.id)
  const avail = availabilityConfig[listing.availability_status]

  // JSON-LD ProfessionalService schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    name: listing.business_name,
    url: `${SITE_URL}/directory/${category}/${slug}`,
    description: listing.description_long,
    image: listing.logo_url || undefined,
    priceRange: listing.price_tier,
    areaServed: listing.geo_coverage.map(geo => ({ '@type': 'State', name: geo })),
    knowsAbout: listing.tools_expertise,
    ...(listing.certifications.length > 0 && {
      hasCredential: listing.certifications.map(cert => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert,
      })),
    }),
    ...(listing.avg_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: listing.avg_rating,
        reviewCount: listing.review_count,
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 3).map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.reviewer_name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating },
        reviewBody: r.body,
      })),
    }),
    ...(listing.social_linkedin && { sameAs: [listing.social_linkedin] }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
          <Link href="/directory" className="hover:text-parchment transition-colors">Directory</Link>
          <span>/</span>
          <Link href={`/directory/${category}`} className="hover:text-parchment transition-colors">{cat.name}</Link>
          <span>/</span>
          <span className="text-ghost truncate">{listing.business_name}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header card */}
            <div className="rounded-lg border border-border bg-panel p-6 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h1 className="text-xl font-semibold text-parchment">{listing.business_name}</h1>
                    {listing.verified_status && (
                      <div className="flex items-center gap-1 rounded-full border border-lime/30 bg-lime/10 px-2 py-0.5">
                        <CheckCircle size={10} className="text-lime" />
                        <span className="text-[10px] font-medium text-lime">Verified</span>
                      </div>
                    )}
                    {listing.tier === 'pro' && (
                      <span className="rounded border border-signal/40 bg-signal/10 px-2 py-0.5 text-[10px] font-medium text-signal">PRO</span>
                    )}
                  </div>

                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${avail.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${avail.dot}`} />
                    <span className={`text-xs font-medium ${avail.color}`}>{avail.label}</span>
                  </div>
                </div>

                {listing.avg_rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber fill-amber" />
                    <span className="text-base font-semibold text-parchment">{listing.avg_rating.toFixed(1)}</span>
                    <span className="text-sm text-muted">({listing.review_count} reviews)</span>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted border-t border-border pt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span>{listing.geo_primary}</span>
                </div>
                {listing.service_delivery && (
                  <div className="flex items-center gap-1.5">
                    <span className="capitalize">{listing.service_delivery.replace('-', ' ')}</span>
                  </div>
                )}
                {listing.response_time_avg && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>Responds {listing.response_time_avg}</span>
                  </div>
                )}
                {listing.founded_year && <span>Est. {listing.founded_year}</span>}
                {listing.team_size_range && <span>{listing.team_size_range} person team</span>}
                {listing.case_study_count > 0 && <span>{listing.case_study_count} case studies</span>}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border border-border bg-panel p-6 mb-6">
              <h2 className="text-sm font-semibold text-parchment mb-3">About</h2>
              <p className="text-sm text-muted leading-relaxed">{listing.description_long}</p>
            </div>

            {/* Tools & expertise */}
            {listing.tools_expertise.length > 0 && (
              <div className="rounded-lg border border-border bg-panel p-6 mb-6">
                <h2 className="text-sm font-semibold text-parchment mb-3">Tools & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.tools_expertise.map(tool => (
                    <span key={tool} className="rounded border border-border bg-slate px-2.5 py-1 text-xs text-ghost">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {listing.certifications.length > 0 && (
              <div className="rounded-lg border border-border bg-panel p-6 mb-6">
                <h2 className="text-sm font-semibold text-parchment mb-3">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.certifications.map(cert => (
                    <div key={cert} className="flex items-center gap-1.5 rounded border border-lime/30 bg-lime/5 px-2.5 py-1">
                      <CheckCircle size={10} className="text-lime" />
                      <span className="text-xs text-lime">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industries served */}
            {listing.industry_verticals.length > 0 && (
              <div className="rounded-lg border border-border bg-panel p-6 mb-6">
                <h2 className="text-sm font-semibold text-parchment mb-3">Industries Served</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.industry_verticals.map(v => (
                    <span key={v} className="rounded border border-border bg-slate px-2.5 py-1 text-xs text-ghost capitalize">
                      {v.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="rounded-lg border border-border bg-panel p-6 mb-6">
                <h2 className="text-sm font-semibold text-parchment mb-4">Client Reviews</h2>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < review.rating ? 'text-amber fill-amber' : 'text-border'} />
                          ))}
                        </div>
                        <span className="text-xs text-ghost">{review.reviewer_name}</span>
                        {review.verified && (
                          <span className="text-[10px] text-lime">verified</span>
                        )}
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unclaimed CTA */}
            {!listing.claimed_status && (
              <div className="rounded-lg border border-border bg-panel p-5 text-center">
                <p className="text-sm text-ghost mb-2">Is this your business?</p>
                <Link
                  href={`/claim/${listing.slug}`}
                  className="inline-flex items-center gap-1.5 rounded border border-signal/40 px-4 py-2 text-xs font-medium text-signal hover:bg-signal/10 transition-colors"
                >
                  Claim this listing →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar — Inquiry + meta */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            {/* Inquiry form */}
            <InquiryForm listingId={listing.id} businessName={listing.business_name} />

            {/* Links */}
            <div className="rounded-lg border border-border bg-panel p-5 space-y-3">
              {listing.portfolio_url && (
                <a
                  href={listing.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-signal hover:text-signal-light transition-colors"
                >
                  <ExternalLink size={12} />
                  View portfolio
                </a>
              )}
              {listing.social_linkedin && (
                <a
                  href={listing.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-ghost hover:text-parchment transition-colors"
                >
                  <Linkedin size={12} />
                  LinkedIn profile
                </a>
              )}
              {listing.external_reviews_url && (
                <a
                  href={listing.external_reviews_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-ghost hover:text-parchment transition-colors"
                >
                  <ExternalLink size={12} />
                  View external reviews
                </a>
              )}
            </div>

            {/* Coverage */}
            {listing.geo_coverage.length > 0 && (
              <div className="rounded-lg border border-border bg-panel p-5">
                <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mb-3">Coverage</h3>
                <div className="flex flex-wrap gap-1.5">
                  {listing.geo_coverage.map(geo => (
                    <span key={geo} className="rounded-sm border border-border px-2 py-0.5 text-[10px] text-muted">
                      {geo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {listing.price_tier && (
              <div className="rounded-lg border border-border bg-panel p-5">
                <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mb-2">Pricing</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-mono font-semibold text-parchment">{listing.price_tier}</span>
                  {listing.price_starting_at && (
                    <span className="text-xs text-muted">Starting at ${listing.price_starting_at.toLocaleString()}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
