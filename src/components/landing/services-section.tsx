'use client'

import type { Service } from '@modules/company-profile'

import { sectionIds } from './section-ids'
import { FeaturedServiceCard, ServiceCard } from './service-cards'
import { ServicesHeader } from './services-header'
import { useInView } from './use-in-view'

type ServicesSectionProps = {
  label: string
  title: string
  intro: string
  items: readonly Service[]
}

export function ServicesSection({
  label,
  title,
  intro,
  items,
}: ServicesSectionProps) {
  const { ref, isVisible } = useInView<HTMLElement>(0.1)
  const [featured, ...rest] = items

  return (
    <section
      id={sectionIds.services}
      aria-labelledby={`${sectionIds.services}-titulo`}
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ServicesHeader
          label={label}
          title={title}
          intro={intro}
          isVisible={isVisible}
        />

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
          {featured && (
            <FeaturedServiceCard
              service={featured}
              index={0}
              isVisible={isVisible}
            />
          )}
          {rest.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index + 1}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
