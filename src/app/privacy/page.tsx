import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-parchment mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="space-y-6 text-muted">
        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">Information we collect</h2>
          <p className="text-sm leading-relaxed">We collect information you provide directly: listing submissions (business name, description, contact email), inquiry form submissions, and account registration via magic link authentication. We also collect standard server logs (IP address, browser type, pages visited).</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">How we use it</h2>
          <p className="text-sm leading-relaxed">Inquiry data is forwarded to the relevant listing owner and stored to prevent abuse. Listing data is displayed publicly in the directory. Contact emails are used only for account authentication and transactional communications (inquiry confirmations, billing reminders). We do not sell personal data.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">Data retention</h2>
          <p className="text-sm leading-relaxed">Inquiry records are retained for 12 months then deleted. Account data is retained until you request deletion. Listing data is retained until the listing is removed.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">Third parties</h2>
          <p className="text-sm leading-relaxed">We use Supabase (database and authentication), Stripe (payment processing), and Resend (transactional email). Each operates under their own privacy policy.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">Your rights</h2>
          <p className="text-sm leading-relaxed">You may request deletion of your account and associated data at any time by emailing <a href="mailto:derekhuit@gmail.com" className="text-signal hover:underline">derekhuit@gmail.com</a>. We will process requests within 30 days.</p>
        </section>
      </div>
    </div>
  )
}
