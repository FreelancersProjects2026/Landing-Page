import { Instagram, Mail, MessageCircle, type LucideIcon } from 'lucide-react'
import type { Contact, LandingContent } from '@modules/company-profile'

import { FooterContactLink } from './footer-contact-link'
import { sectionIds } from './section-ids'

const socialChannels: Record<string, { icon: LucideIcon; accent: string }> = {
  Instagram: { icon: Instagram, accent: '#E1306C' },
}

type FooterSectionProps = {
  company: Contact
  menu: LandingContent['menu']
  footer: LandingContent['footer']
  whatsappUrl: string
  emailUrl: string
  privacy: { label: string; href: string }
}

export function FooterSection({
  company,
  menu,
  footer,
  whatsappUrl,
  emailUrl,
  privacy,
}: FooterSectionProps) {
  const links = [
    { name: menu.services, href: `#${sectionIds.services}` },
    { name: menu.process, href: `#${sectionIds.process}` },
    { name: menu.projects, href: `#${sectionIds.projects}` },
    { name: menu.team, href: `#${sectionIds.team}` },
    { name: menu.faq, href: `#${sectionIds.faq}` },
  ]

  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
          src="/footer/footer.webp"
          width={1600}
          height={533}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3">
              <a
                href={`#${sectionIds.home}`}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="text-2xl font-display text-white">
                  {company.name}
                </span>
              </a>

              <p className="text-white/50 leading-relaxed max-w-xs text-sm">
                {footer.text}
              </p>
            </div>

            {/* Section links */}
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="col-span-2 md:col-span-2">
              <p className="text-sm font-medium text-white mb-6">
                {menu.contact}
              </p>
              <ul className="space-y-4 text-sm text-white/40">
                <li>{company.location}</li>
                <li>{footer.hours}</li>
                <li className="flex flex-wrap items-center gap-3">
                  <FooterContactLink
                    href={whatsappUrl}
                    external
                    icon={MessageCircle}
                    accent="#25D366"
                  >
                    WhatsApp {company.phone}
                  </FooterContactLink>
                  <FooterContactLink
                    href={emailUrl}
                    external
                    icon={Mail}
                    accent="#EA4335"
                  >
                    {company.email}
                  </FooterContactLink>
                  {company.socialProfiles.map(({ label, url }) => (
                    <FooterContactLink
                      key={url}
                      href={url}
                      external
                      {...socialChannels[label]}
                    >
                      {label}
                    </FooterContactLink>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">{footer.rights}</p>
          <a
            href={privacy.href}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            {privacy.label}
          </a>
        </div>
      </div>
    </footer>
  )
}
