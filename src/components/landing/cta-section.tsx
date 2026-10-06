'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { externalLinkProps } from './external-link'
import { sectionIds } from './section-ids'

type CtaSectionProps = {
  title: string
  text: string
  cta: string
  whatsappUrl: string
  emailLabel: string
  email: string
  emailUrl: string
}

export function CtaSection({
  title,
  text,
  cta,
  whatsappUrl,
  emailLabel,
  email,
  emailUrl,
}: CtaSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      id={sectionIds.contact}
      aria-labelledby={`${sectionIds.contact}-titulo`}
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <h2
                  id={`${sectionIds.contact}-titulo`}
                  className="text-6xl md:text-7xl lg:text-[72px] font-display tracking-tight mb-8 leading-[0.95]"
                >
                  {title}
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  {text}
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
                  >
                    <a href={whatsappUrl} {...externalLinkProps}>
                      {cta}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Correo: columna derecha en escritorio, debajo de WhatsApp en móvil */}
              <div
                className={`w-full lg:w-auto lg:self-stretch flex flex-col justify-end lg:border-l border-foreground/10 lg:pl-12 transition-all duration-1000 delay-300 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  {emailLabel}
                </p>
                <a
                  href={emailUrl}
                  className="group inline-flex items-start gap-2 font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight break-all rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px] motion-safe:transition-[background-size] motion-safe:duration-700 motion-safe:ease-out">
                    {email}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 md:size-6 shrink-0 mt-1 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  )
}
