import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { listing_id, name, email, company, project_type, timeline, message } = body

    if (!listing_id || !name || !email || !project_type || !timeline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Save inquiry
    const { error: insertError } = await supabase.from('inquiries').insert({
      listing_id,
      name,
      email,
      company: company || null,
      project_type,
      timeline,
      message: message || null,
    })

    if (insertError) throw insertError

    // Get listing details for forwarding
    const { data: listing } = await supabase
      .from('listings')
      .select('business_name, claimed_status')
      .eq('id', listing_id)
      .single()

    // Get owner email if claimed
    let ownerEmail: string | null = null
    if (listing?.claimed_status) {
      const { data: owner } = await supabase
        .from('listing_owners')
        .select('user_id')
        .eq('listing_id', listing_id)
        .single()

      if (owner) {
        const { data: userData } = await supabase.auth.admin.getUserById(owner.user_id)
        ownerEmail = userData?.user?.email || null
      }
    }

    // Forward inquiry email
    const forwardTo = ownerEmail || process.env.ADMIN_EMAIL || 'derekhuit@gmail.com'

    await resend.emails.send({
      from: 'ConsultAI <noreply@huit.ai>',
      to: forwardTo,
      replyTo: email,
      subject: `New inquiry for ${listing?.business_name || 'your listing'} via ConsultAI`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0D0D12; margin-bottom: 16px;">New client inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6B6B8A; font-size: 13px; width: 140px;">From</td><td style="padding: 8px 0; font-size: 13px;">${name}${company ? ` · ${company}` : ''}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6B8A; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6B6B8A; font-size: 13px;">Project type</td><td style="padding: 8px 0; font-size: 13px;">${project_type.replace(/-/g, ' ')}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6B8A; font-size: 13px;">Timeline</td><td style="padding: 8px 0; font-size: 13px;">${timeline.replace(/-/g, ' ')}</td></tr>
            ${message ? `<tr><td style="padding: 8px 0; color: #6B6B8A; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0; font-size: 13px;">${message}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #9090A8; font-size: 12px;">This inquiry was submitted through ConsultAI. Reply to this email to respond directly to ${name}.</p>
        </div>
      `,
    })

    // Confirmation to inquirer
    await resend.emails.send({
      from: 'ConsultAI <noreply@huit.ai>',
      to: email,
      subject: `Your inquiry to ${listing?.business_name || 'the consultant'} was received`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0D0D12; margin-bottom: 8px;">Inquiry received</h2>
          <p style="color: #6B6B8A; font-size: 14px; line-height: 1.6;">Hi ${name}, your inquiry to <strong>${listing?.business_name}</strong> has been forwarded. You can expect a response within their stated response time.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #9090A8; font-size: 12px;">Sent via ConsultAI · <a href="${process.env.NEXT_PUBLIC_SITE_URL}/directory" style="color: #4F6EF7;">Browse more consultants</a></p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
