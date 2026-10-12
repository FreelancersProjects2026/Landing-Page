'use client'

import Image from 'next/image'
import { useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  locales,
  type LandingContent,
  type Locale,
} from '@modules/company-profile'

import { externalLinkProps } from './external-link'
import { LanguageLinks } from './language-links'
import { MobileMenu, MobileMenuToggle } from './mobile-menu'
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
    { name: menu.services, href: `#${sectionIds.services}`, primary: true },
    { name: menu.process, href: `#${sectionIds.process}`, primary: true },
    { name: menu.projects, href: `#${sectionIds.projects}`, primary: true },
    { name: menu.team, href: `#${sectionIds.team}`, primary: false },
    { name: menu.faq, href: `#${sectionIds.faq}`, primary: false },
    { name: menu.contact, href: `#${sectionIds.contact}`, primary: true },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? 'top-4 left-4 right-4' : 'top-0 left-0 right-0'
      }`}
    >
      <nav
        className={`relative z-50 mx-auto transition-all duration-500 ${
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
            <Image
              src="/logo/icono/LOGOsolutionsPJM.jpeg"
              alt=""
              width={40}
              height={40}
              preload
              className={`rounded-lg object-cover transition-all duration-500 ${isScrolled ? 'size-8' : 'size-10'}`}
            />
            <span
              className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? 'text-xl text-foreground' : 'text-2xl text-white'}`}
            >
              {brand}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => link.primary)
              .map((link) => (
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
              <LanguageLinks
                langs={locales.filter((lang) => lang !== locale)}
                current={locale}
              />
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
          <MobileMenuToggle
            open={isMobileMenuOpen}
            scrolled={isScrolled}
            label={menu.toggleLabel}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </nav>

      <MobileMenu
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
        links={navLinks}
        locale={locale}
        cta={{ label: cta, href: whatsappUrl }}
      />
    </header>
  )
}
