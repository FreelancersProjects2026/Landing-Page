'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { TeamMember } from '@modules/company-profile'

import { externalLinkProps } from './external-link'
import { sectionIds } from './section-ids'

type TeamSectionProps = {
  label: string
  title: string
  intro: string
  members: readonly TeamMember[]
}

export function TeamSection({
  label,
  title,
  intro,
  members,
}: TeamSectionProps) {
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
      id={sectionIds.team}
      aria-labelledby={`${sectionIds.team}-titulo`}
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-12 h-px bg-foreground/30" />
              {label}
            </span>
            <h2
              id={`${sectionIds.team}-titulo`}
              className={`text-5xl md:text-6xl lg:text-[88px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {title}
            </h2>
          </div>
          <p className="lg:col-span-5 lg:pb-4 text-xl text-muted-foreground leading-relaxed">
            {intro}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {members.map((member, index) => (
            <article
              key={member.name}
              className={`relative border border-foreground/10 p-8 lg:p-10 flex flex-col transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-2xl lg:text-3xl font-display mt-4 mb-4">
                {member.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                {member.role}
              </p>
              <div className="flex gap-6">
                {member.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    {...externalLinkProps}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
