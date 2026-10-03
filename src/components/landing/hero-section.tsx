'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { LandingContent } from '@modules/company-profile'

import { externalLinkProps } from './external-link'

type HeroSectionProps = {
  hero: LandingContent['hero']
  whatsappUrl: string
}

export function HeroSection({ hero, whatsappUrl }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- activa la animación de entrada tras el montaje
    setIsVisible(true)
  }, [])

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-80"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div className="lg:max-w-[55%]">
          {/* Eyebrow: H1 con la palabra clave principal */}
          <div
            className={`mb-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <h1
              id="inicio-titulo"
              className="inline-flex items-center gap-3 text-sm font-mono text-white/60"
            >
              <span className="w-8 h-px bg-white/30" />
              {hero.heading}
            </h1>
          </div>

          {/* Main headline */}
          <div className="mb-12">
            <p
              className={`text-left text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {hero.slogan}
            </p>
          </div>

          <p
            className={`text-lg lg:text-xl text-white/70 leading-relaxed max-w-xl mb-10 transition-all duration-1000 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {hero.subtitle}
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-white/90 text-black px-8 h-14 text-base rounded-full"
          >
            <a href={whatsappUrl} {...externalLinkProps}>
              {hero.cta}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
