import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-parchment mb-2">Terms of Service</h1>
      <p className="text-xs text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted">
        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">1. Acceptance</h2>
          <p className="text-sm leading-relaxed">By accessing or using ConsultAI ("Service"), operated by Huitai LLC, you agree to these Terms. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">2. Directory listings</h2>
          <p className="text-sm leading-relaxed">Listings represent independent consultants and businesses. ConsultAI does not employ, endorse, or guarantee the services of any listed consultant. You are responsible for verifying credentials before engaging any consultant.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">3. Pro listing subscriptions</h2>
          <p className="text-sm leading-relaxed">Pro listings are billed at $79/month. Billing begins after listing review and approval. You may cancel at any time from your dashboard — cancellation takes effect at the end of the current billing period. No refunds for partial periods.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">4. User conduct</h2>
          <p className="text-sm leading-relaxed">You agree not to submit false listings, spam inquiries, or misrepresent your business. ConsultAI reserves the right to remove listings that violate these terms without refund.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">5. Limitation of liability</h2>
          <p className="text-sm leading-relaxed">ConsultAI is provided "as is." Huitai LLC is not liable for any damages arising from use of the directory or any transactions between users and listed consultants.</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-parchment mb-2">6. Contact</h2>
          <p className="text-sm leading-relaxed">Questions: <a href="mailto:derekhuit@gmail.com" className="text-signal hover:underline">derekhuit@gmail.com</a></p>
        </section>
      </div>
    </div>
  )
}
