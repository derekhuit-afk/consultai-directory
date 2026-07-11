'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tracking-wider text-signal">
              CONSULT<span className="text-lime">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/directory" className="text-sm text-ghost hover:text-parchment transition-colors">
              Browse
            </Link>
            <Link href="/directory/workflow-automation" className="text-sm text-ghost hover:text-parchment transition-colors">
              Automation
            </Link>
            <Link href="/directory/ai-integration" className="text-sm text-ghost hover:text-parchment transition-colors">
              AI Integration
            </Link>
            <Link href="/directory/ai-strategy" className="text-sm text-ghost hover:text-parchment transition-colors">
              Strategy
            </Link>
          </div>

          {/* CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/submit"
              className="rounded border border-border px-3 py-1.5 text-sm text-ghost transition-colors hover:border-signal hover:text-parchment"
            >
              Add Listing
            </Link>
            <Link
              href="/dashboard"
              className="rounded bg-signal px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-signal-light"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-ghost hover:text-parchment"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link href="/directory" className="text-sm text-ghost hover:text-parchment" onClick={() => setOpen(false)}>Browse All</Link>
              <Link href="/directory/workflow-automation" className="text-sm text-ghost hover:text-parchment" onClick={() => setOpen(false)}>Workflow Automation</Link>
              <Link href="/directory/ai-integration" className="text-sm text-ghost hover:text-parchment" onClick={() => setOpen(false)}>AI Integration</Link>
              <Link href="/directory/ai-strategy" className="text-sm text-ghost hover:text-parchment" onClick={() => setOpen(false)}>AI Strategy</Link>
              <Link href="/submit" className="text-sm text-ghost hover:text-parchment" onClick={() => setOpen(false)}>Add Listing</Link>
              <Link href="/dashboard" className="text-sm font-medium text-signal" onClick={() => setOpen(false)}>Dashboard →</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
