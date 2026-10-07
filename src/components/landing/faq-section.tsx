import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { FaqItem } from '@modules/company-profile'

import { sectionIds } from './section-ids'

type FaqSectionProps = {
  label: string
  title: string
  items: readonly FaqItem[]
  imageSrc: string
}

// <details> nativo: las respuestas quedan en el HTML del servidor (Google las exige visibles en la
// página para FAQPage) y el desplegable funciona con teclado sin JS.
export function FaqSection({ label, title, items, imageSrc }: FaqSectionProps) {
  return (
    <section
      id={sectionIds.faq}
      aria-labelledby={`${sectionIds.faq}-titulo`}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12">
        {/* En escritorio la columna queda fija mientras las preguntas se desplazan (sin JS), solo si
            cabe entera bajo el menú: 112 px de top + 736 px de columna ≈ 860 px de alto. */}
        <div className="lg:col-span-5 lg:self-start lg:top-28 [@media(min-height:860px)]:lg:sticky">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-12 h-px bg-foreground/30" />
            {label}
          </span>
          <h2
            id={`${sectionIds.faq}-titulo`}
            className="text-5xl md:text-6xl lg:text-[72px] font-display tracking-tight leading-[0.9]"
          >
            {title}
          </h2>
          <div className="group/imagen relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-foreground/10 lg:aspect-square">
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(min-width: 1400px) 520px, (min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[85%_center] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover/imagen:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="lg:col-span-7 border-t border-foreground/10">
          {items.map(({ question, answer }) => (
            <details
              key={question}
              className="group border-b border-foreground/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl lg:text-2xl font-display [&::-webkit-details-marker]:hidden">
                {question}
                <Plus
                  aria-hidden="true"
                  className="w-5 h-5 shrink-0 text-muted-foreground motion-safe:transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 text-lg text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
