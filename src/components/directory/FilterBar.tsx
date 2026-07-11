'use client'
import { useRouter } from 'next/navigation'
import { PRICE_TIERS, AVAILABILITY_OPTIONS, SERVICE_DELIVERY_OPTIONS } from '@/lib/constants'

interface Props {
  currentParams: Record<string, string | undefined>
  basePath: string
}

const availabilityLabels: Record<string, string> = {
  'accepting-clients': 'Accepting clients',
  'waitlist': 'Waitlist',
  'unavailable': 'Unavailable',
}

const deliveryLabels: Record<string, string> = {
  'remote-only': 'Remote only',
  'hybrid': 'Hybrid',
  'on-site': 'On-site',
}

export default function FilterBar({ currentParams, basePath }: Props) {
  const router = useRouter()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key) params.set(k, v)
    })
    if (value && currentParams[key] !== value) params.set(key, value)
    const qs = params.toString()
    router.push(`${basePath}${qs ? `?${qs}` : ''}`)
  }

  function clearAll() {
    router.push(basePath)
  }

  const hasFilters = Object.values(currentParams).some(Boolean)

  return (
    <div className="space-y-6">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-signal hover:text-signal-light transition-colors"
        >
          ← Clear all filters
        </button>
      )}

      {/* Availability */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Availability</h3>
        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => updateFilter('availability', opt)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors text-left ${
                currentParams.availability === opt
                  ? 'bg-signal/10 text-signal'
                  : 'text-ghost hover:text-parchment'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                opt === 'accepting-clients' ? 'bg-lime' :
                opt === 'waitlist' ? 'bg-amber' : 'bg-ember'
              }`} />
              {availabilityLabels[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* Price tier */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Price tier</h3>
        <div className="flex gap-1.5 flex-wrap">
          {PRICE_TIERS.map(tier => (
            <button
              key={tier}
              onClick={() => updateFilter('price', tier)}
              className={`rounded border px-2.5 py-1 text-xs font-mono transition-colors ${
                currentParams.price === tier
                  ? 'border-signal bg-signal/10 text-signal'
                  : 'border-border text-ghost hover:border-signal hover:text-parchment'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Service delivery */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Service delivery</h3>
        <div className="space-y-2">
          {SERVICE_DELIVERY_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => updateFilter('delivery', opt)}
              className={`flex w-full rounded px-2 py-1.5 text-xs transition-colors text-left ${
                currentParams.delivery === opt
                  ? 'bg-signal/10 text-signal'
                  : 'text-ghost hover:text-parchment'
              }`}
            >
              {deliveryLabels[opt]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
