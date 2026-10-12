'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { locales, type Locale } from '@modules/company-profile'

import { externalLinkProps } from './external-link'
import { LanguageLinks } from './language-links'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  links: readonly { name: string; href: string }[]
  locale: Locale
  cta: { label: string; href: string }
}

const revealClass = (open: boolean) =>
  open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'

export function MobileMenu({
  open,
  onClose,
  links,
  locale,
  cta,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
        open
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      style={{ top: 0 }}
    >
      <div className="flex flex-col h-full px-8 pt-28 pb-8">
        <div className="flex-1 flex flex-col justify-center gap-8">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${revealClass(open)}`}
              style={{ transitionDelay: open ? `${i * 75}ms` : '0ms' }}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div
          className={`flex items-center gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${revealClass(open)}`}
          style={{ transitionDelay: open ? '300ms' : '0ms' }}
        >
          <div className="flex items-center gap-4 text-base text-foreground">
            <LanguageLinks langs={locales} current={locale} />
          </div>
          <Button
            asChild
            className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
          >
            <a href={cta.href} {...externalLinkProps} onClick={onClose}>
              {cta.label}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

type MobileMenuToggleProps = {
  open: boolean
  scrolled: boolean
  label: string
  onToggle: () => void
}

export function MobileMenuToggle({
  open,
  scrolled,
  label,
  onToggle,
}: MobileMenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`md:hidden p-2 transition-colors duration-500 ${scrolled || open ? 'text-foreground' : 'text-white'}`}
      aria-label={label}
      aria-expanded={open}
    >
      {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  )
}
