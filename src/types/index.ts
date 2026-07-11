export type ServiceDelivery = 'remote-only' | 'on-site' | 'hybrid'
export type PriceTier = '$' | '$$' | '$$$' | '$$$$'
export type TeamSizeRange = 'solo' | '2-10' | '11-50'
export type AvailabilityStatus = 'accepting-clients' | 'waitlist' | 'unavailable'
export type ListingTier = 'free' | 'pro'
export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface Listing {
  id: string
  slug: string
  business_name: string
  category_primary: string
  category_tags: string[]
  service_delivery: ServiceDelivery
  industry_verticals: string[]
  tools_expertise: string[]
  price_tier: PriceTier
  price_starting_at: number | null
  geo_primary: string
  geo_coverage: string[]
  verified_status: boolean
  claimed_status: boolean
  availability_status: AvailabilityStatus
  founded_year: number | null
  team_size_range: TeamSizeRange | null
  certifications: string[]
  description_short: string
  description_long: string
  logo_url: string | null
  portfolio_url: string | null
  social_linkedin: string | null
  external_reviews_url: string | null
  case_study_count: number
  response_time_avg: string | null
  avg_rating: number | null
  review_count: number
  is_sponsored: boolean
  tier: ListingTier
  stripe_subscription_id: string | null
  last_verified_at: string | null
  created_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
}

export interface Review {
  id: string
  listing_id: string
  reviewer_name: string
  rating: number
  body: string
  verified: boolean
  created_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  name: string
  email: string
  company: string | null
  project_type: string
  timeline: string
  message: string | null
  forwarded: boolean
  created_at: string
}
