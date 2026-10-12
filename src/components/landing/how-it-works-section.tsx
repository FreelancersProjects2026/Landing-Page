'use client'

import { useState } from 'react'
import type { Step } from '@modules/company-profile'
import { ProcessStepCard } from './process-step-card'
import { sectionIds } from './section-ids'
import { useInView } from './use-in-view'

type HowItWorksSectionProps = {
  label: string
  title: string
  steps: readonly Step[]
  differentiatorsTitle: string
  differentiators: readonly string[]
}

export function HowItWorksSection({
  label,
  title,
  steps,
  differentiatorsTitle,
  differentiators,
}: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState(0)
  const { ref: sectionRef, isVisible } = useInView<HTMLElement>(0.1)

  return (
    <section
      id={sectionIds.process}
      aria-labelledby={`${sectionIds.process}-titulo`}
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[oklch(0.09_0.01_260)] text-white overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — título + imagen */}
        <div className="relative mb-0 lg:mb-0 grid lg:grid-cols-2 gap-4 lg:gap-12 items-end">
          <div className="overflow-hidden pb-0 lg:pb-32">
            <div
              className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-8">
                <span className="w-12 h-px bg-white/20" />
                {label}
              </span>
            </div>

            <h2
              id={`${sectionIds.process}-titulo`}
              className={`text-5xl md:text-6xl lg:text-[88px] font-display tracking-tight leading-[0.9] transition-all duration-1000 delay-100 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-16 opacity-0'
              }`}
            >
              {title}
            </h2>
          </div>

          {/* Imagen decorativa apoyada sobre las tarjetas */}
          <div
            className={`relative h-[320px] lg:h-[640px] overflow-hidden transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src="/ComoTrabajamos/como-trabajamos.webp"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-full h-full object-contain object-bottom"
            />
            {/* Degradado en el borde izquierdo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.09_0.01_260)] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Steps Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <ProcessStepCard
              key={step.title}
              step={step}
              index={index}
              isActive={activeStep === index}
              onSelect={() => setActiveStep(index)}
            />
          ))}
        </div>

        {/* Diferenciadores */}
        <div className="mt-16 lg:mt-24 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40">
              <span className="w-12 h-px bg-white/20" />
              {differentiatorsTitle}
            </span>
          </div>
          <ul className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            {differentiators.map((differentiator) => (
              <li
                key={differentiator}
                className="text-xl lg:text-2xl font-display leading-snug border-t border-white/20 pt-6"
              >
                {differentiator}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
