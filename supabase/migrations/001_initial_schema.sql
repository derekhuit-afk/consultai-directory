-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type service_delivery as enum ('remote-only', 'on-site', 'hybrid');
create type price_tier as enum ('$', '$$', '$$$', '$$$$');
create type team_size_range as enum ('solo', '2-10', '11-50');
create type availability_status as enum ('accepting-clients', 'waitlist', 'unavailable');
create type listing_tier as enum ('free', 'pro');
create type claim_status as enum ('pending', 'approved', 'rejected');

-- Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null,
  icon text not null,
  created_at timestamptz default now()
);

-- Listings (core table)
create table listings (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  business_name text not null,
  category_primary text not null references categories(slug),
  category_tags text[] default '{}',
  service_delivery service_delivery not null default 'remote-only',
  industry_verticals text[] default '{}',
  tools_expertise text[] default '{}',
  price_tier price_tier,
  price_starting_at integer,
  geo_primary text not null,
  geo_coverage text[] default '{}',
  verified_status boolean default false,
  claimed_status boolean default false,
  availability_status availability_status not null default 'accepting-clients',
  founded_year integer,
  team_size_range team_size_range,
  certifications text[] default '{}',
  description_short text not null check (char_length(description_short) <= 160),
  description_long text not null,
  logo_url text,
  portfolio_url text,
  social_linkedin text,
  external_reviews_url text,
  case_study_count integer default 0,
  response_time_avg text,
  avg_rating numeric(3,2),
  review_count integer default 0,
  is_sponsored boolean default false,
  tier listing_tier default 'free',
  stripe_subscription_id text,
  last_verified_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Inquiries
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  name text not null,
  email text not null,
  company text,
  project_type text not null,
  timeline text not null,
  message text,
  forwarded boolean default false,
  created_at timestamptz default now()
);

-- Claims
create table claims (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status claim_status default 'pending',
  created_at timestamptz default now(),
  unique(listing_id, user_id)
);

-- Listing owners (approved claims)
create table listing_owners (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- Indexes for performance
create index idx_listings_category on listings(category_primary);
create index idx_listings_geo on listings(geo_primary);
create index idx_listings_availability on listings(availability_status);
create index idx_listings_tier on listings(tier);
create index idx_listings_sponsored on listings(is_sponsored);
create index idx_listings_verified on listings(verified_status);
create index idx_reviews_listing on reviews(listing_id);
create index idx_inquiries_listing on inquiries(listing_id);
create index idx_claims_user on claims(user_id);
create index idx_listing_owners_user on listing_owners(user_id);

-- Row Level Security
alter table listings enable row level security;
alter table reviews enable row level security;
alter table inquiries enable row level security;
alter table claims enable row level security;
alter table listing_owners enable row level security;
alter table categories enable row level security;

-- Public read on listings and categories
create policy "Public can read listings" on listings for select using (true);
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read reviews" on reviews for select using (true);

-- Inquiries: anyone can insert, only listing owners can read
create policy "Anyone can submit inquiries" on inquiries for insert with check (true);
create policy "Owners can read their inquiries" on inquiries for select
  using (listing_id in (
    select listing_id from listing_owners where user_id = auth.uid()
  ));

-- Claims: authenticated users can insert and read their own
create policy "Authenticated can create claims" on claims for insert
  with check (auth.uid() = user_id);
create policy "Users can read own claims" on claims for select
  using (auth.uid() = user_id);

-- Listing owners: users can read their own
create policy "Users can read own ownership" on listing_owners for select
  using (auth.uid() = user_id);

-- Owners can update their own listing
create policy "Owners can update their listing" on listings for update
  using (id in (
    select listing_id from listing_owners where user_id = auth.uid()
  ));
