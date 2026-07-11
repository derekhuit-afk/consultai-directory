import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: ownership } = await supabase
      .from('listing_owners')
      .select('listing_id')
      .eq('user_id', user.id)
      .single()

    if (!ownership) return NextResponse.json({ error: 'No listing found' }, { status: 404 })

    const { data: listing } = await supabase
      .from('listings')
      .select('stripe_subscription_id')
      .eq('id', ownership.listing_id)
      .single()

    if (!listing?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    // Cancel at period end (not immediately)
    await stripe.subscriptions.update(listing.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Cancel error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
