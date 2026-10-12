import type { Service } from '@modules/company-profile'

import { cn } from '@/lib/utils'

import { ParticleVisualization } from './particle-visualization'
import { revealClass } from './use-in-view'

type ServiceCardProps = {
  service: Service
  index: number
  isVisible: boolean
}

const serviceNumber = (index: number) => String(index + 1).padStart(2, '0')

export function FeaturedServiceCard({
  service,
  index,
  isVisible,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'lg:col-span-12 relative bg-black border border-foreground/10 min-h-[500px] overflow-hidden group transition-all duration-700 flex',
        revealClass(isVisible, 'translate-y-12'),
      )}
    >
      {/* Left: text content */}
      <div className="relative flex-1 p-8 lg:p-12 bg-black">
        <ParticleVisualization />
        <div className="relative z-10">
          <span className="font-mono text-sm text-muted-foreground">
            {serviceNumber(index)}
          </span>
          <h3 className="text-3xl lg:text-4xl font-display mt-4 mb-6 group-hover:translate-x-2 transition-transform duration-500">
            {service.title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
            {service.description}
          </p>
        </div>
      </div>

      {/* Right: mirrored image, full height */}
      <div className="hidden lg:block relative w-[42%] shrink-0 overflow-hidden">
        <img
          src="/Servicios/servicios.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transform: 'scaleX(-1)' }}
        />
        {/* Fade left edge into black */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>
    </div>
  )
}

export function ServiceCard({ service, index, isVisible }: ServiceCardProps) {
  return (
    <div
      className={cn(
        'lg:col-span-4 relative bg-black border border-foreground/10 p-8 lg:p-12 group transition-all duration-700',
        revealClass(isVisible, 'translate-y-12'),
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="font-mono text-sm text-muted-foreground">
        {serviceNumber(index)}
      </span>
      <h3 className="text-2xl lg:text-3xl font-display mt-4 mb-6 group-hover:translate-x-2 transition-transform duration-500">
        {service.title}
      </h3>
      <p className="text-lg text-muted-foreground leading-relaxed">
        {service.description}
      </p>
    </div>
  )
}
