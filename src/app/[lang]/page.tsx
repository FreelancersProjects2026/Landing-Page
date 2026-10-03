import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { ServicesSection } from '@/components/landing/services-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { InfrastructureSection } from '@/components/landing/infrastructure-section'
import { MetricsSection } from '@/components/landing/metrics-section'
import { IntegrationsSection } from '@/components/landing/integrations-section'
import { SecuritySection } from '@/components/landing/security-section'
import { DevelopersSection } from '@/components/landing/developers-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'
import {
  buildWhatsAppUrl,
  getLandingContent,
  type Locale,
} from '@modules/company-profile'

import { buildStructuredData, serializeJsonLd } from './structured-data'

// Etiqueta accesible del botón del menú móvil (texto de interfaz, no de contenido).
const menuToggleLabel: Record<Locale, string> = { es: 'Menú', en: 'Menu' }

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
          toggleLabel={menuToggleLabel[content.locale]}
        />
        <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />
        <ServicesSection label={content.menu.services} {...content.services} />
        <HowItWorksSection label={content.menu.process} {...content.process} />
        <InfrastructureSection />
        <MetricsSection />
        <IntegrationsSection />
        <SecuritySection />
        <DevelopersSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection {...content.contact} whatsappUrl={whatsappUrl} />
        <FooterSection
          company={content.company}
          menu={content.menu}
          footer={content.footer}
          whatsappUrl={whatsappUrl}
        />
      </main>
    </>
  )
}
