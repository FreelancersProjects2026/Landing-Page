'use client'

import { Github, Linkedin, type LucideIcon } from 'lucide-react'
import type { TeamMember } from '@modules/company-profile'

import { FooterContactLink } from './footer-contact-link'
import { sectionIds } from './section-ids'
import { revealClass, useInView } from './use-in-view'

// Mismo orbe 3D del footer; GitHub usa blanco porque su negro no se ve sobre fondo oscuro.
const socialChannels: Record<string, { icon: LucideIcon; accent: string }> = {
  GitHub: { icon: Github, accent: '#ffffff' },
  LinkedIn: { icon: Linkedin, accent: '#0A66C2' },
}

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
  const { ref: sectionRef, isVisible } = useInView<HTMLElement>(0.1)

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
              className={`text-5xl md:text-6xl lg:text-[88px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${revealClass(isVisible, 'translate-y-8')}`}
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
              className={`relative border border-foreground/10 p-8 lg:p-10 flex flex-col transition-all duration-700 ${revealClass(isVisible, 'translate-y-12')}`}
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
              <div className="flex gap-3">
                {member.links.map((link) => (
                  <FooterContactLink
                    key={link.url}
                    href={link.url}
                    external
                    {...socialChannels[link.label]}
                  >
                    {link.label}
                  </FooterContactLink>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
