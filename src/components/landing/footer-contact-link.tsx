import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

import { externalLinkProps } from './external-link'

type FooterContactLinkProps = {
  href: string
  external?: boolean
  children: ReactNode
}

export function FooterContactLink({
  href,
  external = false,
  children,
}: FooterContactLinkProps) {
  return (
    <a
      href={href}
      {...(external ? externalLinkProps : {})}
      className="hover:text-white transition-colors inline-flex items-center gap-1 group"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
      />
    </a>
  )
}
