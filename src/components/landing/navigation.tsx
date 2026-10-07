'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import {
  locales,
  type LandingContent,
  type Locale,
} from '@modules/company-profile'

import { externalLinkProps } from './external-link'
import { sectionIds } from './section-ids'

type NavigationProps = {
  brand: string
  menu: LandingContent['menu']
  cta: string
  whatsappUrl: string
  locale: Locale
}

export function Navigation({
  brand,
  menu,
  cta,
  whatsappUrl,
  locale,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: menu.services, href: `#${sectionIds.services}` },
    { name: menu.process, href: `#${sectionIds.process}` },
    { name: menu.projects, href: `#${sectionIds.projects}` },
    { name: menu.team, href: `#${sectionIds.team}` },
    { name: menu.faq, href: `#${sectionIds.faq}` },
    { name: menu.contact, href: `#${sectionIds.contact}` },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languageLinks = (className: string) =>
    locales.map((lang) => (
      <a
        key={lang}
        href={`/${lang}`}
        hrefLang={lang}
        lang={lang}
        aria-current={lang === locale ? 'page' : undefined}
        className={`${className} ${lang === locale ? 'font-medium' : 'opacity-60 hover:opacity-100'}`}
      >
        {lang.toUpperCase()}
      </a>
    ))

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? 'top-4 left-4 right-4' : 'top-0 left-0 right-0'
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]'
            : 'bg-transparent max-w-[1400px]'
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? 'h-14' : 'h-20'
          }`}
        >
          {/* Logo */}
          <a
            href={`#${sectionIds.home}`}
            className="flex items-center gap-2 group"
          >
            <span
              className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? 'text-xl text-foreground' : 'text-2xl text-white'}`}
            >
              {brand}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-300 relative group ${isScrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-foreground' : 'bg-white'}`}
                />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div
              className={`flex items-center gap-3 transition-all duration-500 ${isScrolled ? 'text-xs text-foreground' : 'text-sm text-white'}`}
            >
              {languageLinks('transition-opacity')}
            </div>
            <Button
              asChild
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? 'bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs' : 'bg-white hover:bg-white/90 text-black px-6'}`}
            >
              <a href={whatsappUrl} {...externalLinkProps}>
                {cta}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-500 ${isScrolled || isMobileMenuOpen ? 'text-foreground' : 'text-white'}`}
            aria-label={menu.toggleLabel}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : '0ms',
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div
            className={`flex items-center gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '300ms' : '0ms' }}
          >
            <div className="flex items-center gap-4 text-base text-foreground">
              {languageLinks('transition-opacity')}
            </div>
            <Button
              asChild
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
            >
              <a
                href={whatsappUrl}
                {...externalLinkProps}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cta}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
