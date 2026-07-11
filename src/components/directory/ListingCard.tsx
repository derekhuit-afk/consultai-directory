import Link from 'next/link'
import { Listing } from '@/types'
import { MapPin, Clock, Star, CheckCircle } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

interface Props {
  listing: Listing
  categorySlug?: string
  stateSlug?: string
}

const availabilityConfig = {
  'accepting-clients': { label: 'Accepting clients', color: 'text-lime', dot: 'bg-lime' },
  'waitlist': { label: 'Waitlist', color: 'text-amber', dot: 'bg-amber' },
  'unavailable': { label: 'Unavailable', color: 'text-ember', dot: 'bg-ember' },
}

const priceTierLabel: Record<string, string> = {
  '$': 'Budget-friendly',
  '$$': 'Mid-range',
  '$$$': 'Premium',
  '$$$$': 'Enterprise',
}

export default function ListingCard({ listing, categorySlug, stateSlug }: Props) {
  const avail = availabilityConfig[listing.availability_status]
  const cat = categorySlug || listing.category_primary
  const statePath = stateSlug ? `/${stateSlug}` : ''
  const href = `/directory/${cat}${statePath}/${listing.slug}`

  const category = CATEGORIES.find(c => c.slug === listing.category_primary)

  return (
    <Link href={href} className="block group">
      <div className={`rounded-lg border border-border bg-panel p-5 card-hover h-full flex flex-col ${listing.is_sponsored ? 'border-signal/40' : ''}`}>
        {/* Sponsored badge */}
        {listing.is_sponsored && (
          <div className="mb-3 text-xs text-signal font-medium">Sponsored</div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-parchment group-hover:text-signal transition-colors truncate">
                {listing.business_name}
              </h3>
              {listing.verified_status && (
                <CheckCircle size={13} className="text-lime flex-shrink-0" />
              )}
              {listing.tier === 'pro' && (
                <span className="rounded-sm border border-signal/40 px-1.5 py-0.5 text-[10px] font-medium text-signal flex-shrink-0">
                  PRO
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${avail.dot}`} />
              <span className={`text-xs ${avail.color}`}>{avail.label}</span>
            </div>
          </div>

          {/* Rating */}
          {listing.avg_rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={12} className="text-amber fill-amber" />
              <span className="text-xs font-medium text-parchment">{listing.avg_rating.toFixed(1)}</span>
              <span className="text-xs text-muted">({listing.review_count})</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted leading-relaxed mb-4 flex-1">
          {listing.description_short}
        </p>

        {/* Tools */}
        {listing.tools_expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.tools_expertise.slice(0, 4).map(tool => (
              <span key={tool} className="rounded-sm bg-slate border border-border px-2 py-0.5 text-[10px] text-ghost">
                {tool}
              </span>
            ))}
            {listing.tools_expertise.length > 4 && (
              <span className="rounded-sm bg-slate border border-border px-2 py-0.5 text-[10px] text-muted">
                +{listing.tools_expertise.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} />
            <span>{listing.geo_primary}</span>
          </div>
          <div className="flex items-center gap-3">
            {listing.price_tier && (
              <span className="text-xs text-muted font-mono">{listing.price_tier}</span>
            )}
            {listing.response_time_avg && (
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock size={11} />
                <span>{listing.response_time_avg}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
