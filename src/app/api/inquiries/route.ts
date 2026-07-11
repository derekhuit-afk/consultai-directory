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

    // Save inquiry to database
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

    // Get listing name for email
    const { data: listing } = await supabase
      .from('listings')
      .select('business_name')
      .eq('id', listing_id)
      .single()

    const businessName = listing?.business_name || 'a listing'
    const adminEmail = process.env.ADMIN_EMAIL || 'derekhuit@gmail.com'

    // Forward to admin (who manually routes to listing owner until claim flow is built out)
    await resend.emails.send({
      from: 'ConsultAI <noreply@huit.ai>',
      to: adminEmail,
      replyTo: email,
      subject: `New inquiry for ${businessName} via ConsultAI`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:600px;padding:24px;background:#fff">
        <h2 style="color:#0D0D12;margin-bottom:16px">New client inquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px;width:140px">From</td><td style="padding:8px 0;font-size:13px">${name}${company ? ` · ${company}` : ''}</td></tr>
          <tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px">Email</td><td style="padding:8px 0;font-size:13px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px">Listing</td><td style="padding:8px 0;font-size:13px">${businessName}</td></tr>
          <tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px">Project type</td><td style="padding:8px 0;font-size:13px">${project_type.replace(/-/g, ' ')}</td></tr>
          <tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px">Timeline</td><td style="padding:8px 0;font-size:13px">${timeline.replace(/-/g, ' ')}</td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#6B6B8A;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:13px">${message}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0">
        <p style="color:#9090A8;font-size:12px">Sent via ConsultAI. Reply to respond directly to ${name}.</p>
      </div>`,
    })

    // Confirmation to the person who submitted
    await resend.emails.send({
      from: 'ConsultAI <noreply@huit.ai>',
      to: email,
      subject: `Your inquiry to ${businessName} was received`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:600px;padding:24px;background:#fff">
        <h2 style="color:#0D0D12;margin-bottom:8px">Inquiry received</h2>
        <p style="color:#6B6B8A;font-size:14px;line-height:1.6">Hi ${name}, your inquiry to <strong>${businessName}</strong> has been forwarded. You can expect a response within their stated response time.</p>
        <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0">
        <p style="color:#9090A8;font-size:12px">Sent via ConsultAI</p>
      </div>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
