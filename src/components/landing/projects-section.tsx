'use client'

import { useState, useEffect, useRef } from 'react'
import type { Project } from '@modules/company-profile'

type ProjectsSectionProps = {
  label: string
  title: string
  items: readonly Project[]
}

export function ProjectsSection({ label, title, items }: ProjectsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Image — absolute, bottom-right, behind all content */}
      <div
        className={`absolute bottom-0 right-0 w-[55%] h-[85%] pointer-events-none transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-left-top"
        />
        {/* Fade left edge */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        {/* Fade top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* All text content sits on top */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — Full width */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {label}
          </span>
          <h2
            id="proyectos-titulo"
            className="text-5xl md:text-6xl lg:text-[88px] font-display tracking-tight leading-[0.9] lg:max-w-[70%]"
          >
            {title}
          </h2>
        </div>

        {/* Projects — left half only on large screens */}
        <div className="lg:max-w-[50%] grid gap-10">
          {items.map((project, index) => (
            <article
              key={project.name}
              className={`transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 50 + 200}ms` }}
            >
              <h3 className="text-2xl lg:text-3xl font-display mb-1">
                {project.name}
              </h3>
              {project.nameTranslation && (
                <p className="text-sm font-mono text-muted-foreground mb-3">
                  {project.nameTranslation}
                </p>
              )}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
