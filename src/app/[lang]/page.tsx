import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
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
import { getLandingContent } from '@modules/company-profile'

import { buildStructuredData, serializeJsonLd } from './structured-data'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const structuredData = serializeJsonLd(
    buildStructuredData(getLandingContent(lang)),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InfrastructureSection />
        <MetricsSection />
        <IntegrationsSection />
        <SecuritySection />
        <DevelopersSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
        <FooterSection />
      </main>
    </>
  )
}
