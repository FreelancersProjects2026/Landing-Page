import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { ServicesSection } from '@/components/landing/services-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { ProjectsSection } from '@/components/landing/projects-section'
import { TeamSection } from '@/components/landing/team-section'
import { CtaSection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'
import { WhatsAppButton } from '@/components/landing/whatsapp-button'
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  getLandingContent,
} from '@modules/company-profile'

import { buildStructuredData, serializeJsonLd } from './structured-data'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const content = getLandingContent(lang)
  const whatsappUrl = buildWhatsAppUrl(
    content.company.phone,
    content.whatsappMessage,
  )
  const whatsappOptions = content.whatsapp.options.map(
    ({ label, message }) => ({
      label,
      url: buildWhatsAppUrl(content.company.phone, message),
    }),
  )
  const emailUrl = buildMailtoUrl(content.company.email)
  const structuredData = serializeJsonLd(buildStructuredData(content))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation
          brand={content.company.name}
          menu={content.menu}
          cta={content.hero.cta}
          whatsappUrl={whatsappUrl}
          locale={content.locale}
        />
        <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />
        <ServicesSection label={content.menu.services} {...content.services} />
        <HowItWorksSection label={content.menu.process} {...content.process} />
        <ProjectsSection label={content.menu.projects} {...content.projects} />
        <TeamSection label={content.menu.team} {...content.team} />
        <CtaSection
          {...content.contact}
          whatsappUrl={whatsappUrl}
          email={content.company.email}
          emailUrl={emailUrl}
        />
        <FooterSection
          company={content.company}
          menu={content.menu}
          footer={content.footer}
          whatsappUrl={whatsappUrl}
          emailUrl={emailUrl}
        />
        <WhatsAppButton
          label={content.whatsapp.label}
          name={content.company.name}
          greeting={content.contact.text}
          options={whatsappOptions}
        />
      </main>
    </>
  )
}
