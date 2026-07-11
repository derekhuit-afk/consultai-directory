import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function InquiriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/claim/dashboard-login')

  const { data: ownership } = await supabase
    .from('listing_owners')
    .select('listing_id')
    .eq('user_id', user.id)
    .single()

  if (!ownership) redirect('/dashboard')

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('listing_id', ownership.listing_id)
    .order('created_at', { ascending: false })
    .limit(50)

  const projectTypeLabels: Record<string, string> = {
    'automation-audit': 'Automation Audit',
    'new-build': 'New Build',
    'ongoing-support': 'Ongoing Support',
    'strategy': 'Strategy / Advisory',
    'other': 'Other',
  }

  const timelineLabels: Record<string, string> = {
    'asap': 'ASAP',
    '1-3-months': '1–3 months',
    '3-6-months': '3–6 months',
    'exploring': 'Just exploring',
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/dashboard" className="text-ghost hover:text-parchment transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-xl font-semibold text-parchment">Inquiries</h1>
        <span className="rounded-full bg-signal px-2 py-0.5 text-xs font-medium text-white">
          {inquiries?.length || 0}
        </span>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <div className="rounded-lg border border-border bg-panel p-12 text-center">
          <p className="text-sm text-muted">No inquiries yet. They'll appear here when someone contacts you through your listing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => (
            <div key={inq.id} className="rounded-lg border border-border bg-panel p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-sm font-medium text-parchment">
                    {inq.name}{inq.company ? ` · ${inq.company}` : ''}
                  </div>
                  <a href={`mailto:${inq.email}`} className="text-xs text-signal hover:text-signal-light">
                    {inq.email}
                  </a>
                </div>
                <div className="text-[10px] text-muted flex-shrink-0">
                  {new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-sm border border-border bg-slate px-2 py-0.5 text-[10px] text-ghost">
                  {projectTypeLabels[inq.project_type] || inq.project_type}
                </span>
                <span className="rounded-sm border border-border bg-slate px-2 py-0.5 text-[10px] text-ghost">
                  {timelineLabels[inq.timeline] || inq.timeline}
                </span>
              </div>

              {inq.message && (
                <p className="text-xs text-muted leading-relaxed">{inq.message}</p>
              )}

              <div className="mt-3 pt-3 border-t border-border">
                <a
                  href={`mailto:${inq.email}?subject=Re: Your ConsultAI inquiry`}
                  className="text-xs text-signal hover:text-signal-light transition-colors"
                >
                  Reply via email →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
