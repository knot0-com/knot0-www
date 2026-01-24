import Link from 'next/link'
import { Container } from '@/components/ui'

const footerLinks = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/security', label: 'Security' },
    { href: '/enterprise', label: 'Enterprise' },
  ],
  Resources: [
    { href: '/docs', label: 'Docs' },
    { href: '/writing', label: 'Writing' },
    { href: '/changelog', label: 'Changelog' },
    { href: '/status', label: 'Status' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ],
  Connect: [
    { href: 'https://github.com/knot0', label: 'GitHub' },
    { href: 'https://twitter.com/knot0', label: 'Twitter' },
    { href: 'https://discord.gg/knot0', label: 'Discord' },
  ],
}

export function Footer() {
  return (
    <footer className="py-16 bg-ink text-white">
      <Container>
        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold mb-2">Knot0</div>
            <p className="text-sm text-white/60">
              AI that builds and runs automations. Governed.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-orange rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Knot0, Inc.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-orange rounded">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-orange rounded">
              Terms
            </Link>
            <Link href="/security" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-orange rounded">
              Security
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
