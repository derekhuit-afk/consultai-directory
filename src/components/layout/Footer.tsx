import Link from 'next/link'
import { SITE_NAME, CATEGORIES } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-slate">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-mono text-sm font-semibold tracking-wider text-signal">
              CONSULT<span className="text-lime">AI</span>
            </span>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              The curated directory of verified AI automation consultants. Find specialists by tools, industry, and location.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(c => (
                <li key={c.slug}>
                  <Link href={`/directory/${c.slug}`} className="text-xs text-muted hover:text-parchment transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Directory</h4>
            <ul className="space-y-2">
              <li><Link href="/directory" className="text-xs text-muted hover:text-parchment transition-colors">Browse All</Link></li>
              <li><Link href="/submit" className="text-xs text-muted hover:text-parchment transition-colors">Submit a Listing</Link></li>
              <li><Link href="/dashboard" className="text-xs text-muted hover:text-parchment transition-colors">Claim Your Listing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ghost mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-xs text-muted hover:text-parchment transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-xs text-muted hover:text-parchment transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cancel" className="text-xs text-muted hover:text-parchment transition-colors">Cancel Subscription</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. A Huitai LLC product.
          </p>
          <p className="text-xs text-muted">
            Listings are independently verified. Sponsored listings are clearly marked.
          </p>
        </div>
      </div>
    </footer>
  )
}
