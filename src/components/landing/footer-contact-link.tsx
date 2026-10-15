import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

import { externalLinkProps } from './external-link'

type FooterContactLinkProps = {
  href: string
  external?: boolean
  icon?: LucideIcon
  accent?: string
  children: ReactNode
}

export function FooterContactLink({
  href,
  external = false,
  icon: Icon = ArrowUpRight,
  accent = '#ffffff',
  children,
}: FooterContactLinkProps) {
  return (
    <a
      href={href}
      {...(external ? externalLinkProps : {})}
      className="group inline-flex items-center min-h-12 rounded-full hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <span
        aria-hidden="true"
        className="contact-orb"
        style={{ '--orb-accent': accent } as CSSProperties}
      >
        <Icon aria-hidden="true" className="w-5 h-5" />
      </span>
      <span className="sr-only">{children}</span>
    </a>
  )
}
