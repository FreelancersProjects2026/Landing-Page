import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import type { PrivacyPolicy } from '@modules/company-profile'

type PrivacyPolicyViewProps = {
  policy: PrivacyPolicy
  homeHref: string
  homeLabel: string
  headerImageSrc: string
}

const column = 'mx-auto w-full max-w-6xl px-6 lg:px-12'

const focusRing =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background'

export function PrivacyPolicyView({
  policy,
  homeHref,
  homeLabel,
  headerImageSrc,
}: PrivacyPolicyViewProps) {
  return (
    <main className="min-h-svh bg-background pb-16 text-white lg:pb-24">
      <article className="break-words">
        {/* Móvil: enlace, imagen y título en columna. Escritorio: la imagen cubre la cabecera
            detrás del texto; el escudo queda a la derecha y el título sobre la zona negra. */}
        <header className="relative isolate lg:flex lg:min-h-[clamp(34rem,40vw,44rem)] lg:flex-col">
          <div className={`${column} pt-10 lg:pt-12`}>
            <a
              href={homeHref}
              className={`group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white ${focusRing}`}
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1"
              />
              {homeLabel}
            </a>
          </div>

          <div className="relative mt-6 aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:aspect-auto">
            <Image
              src={headerImageSrc}
              alt=""
              fill
              sizes="100vw"
              preload
              className="object-cover object-right"
            />
            {/* Funde la imagen con el fondo: abajo en móvil; a la izquierda y abajo en escritorio. */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-background lg:bg-gradient-to-r lg:from-background lg:from-25% lg:via-background/70 lg:via-45% lg:to-transparent lg:to-75%" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-b from-transparent to-background lg:block" />
          </div>

          <div className={`${column} lg:mt-auto lg:pb-12`}>
            <div className="lg:max-w-md">
              <h1 className="font-display text-balance text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">
                {policy.title}
              </h1>
              <p className="mt-4 text-sm text-white/60">{policy.updated}</p>
            </div>
          </div>
        </header>

        <div className={column}>
          <div className="mt-10 max-w-3xl border-t border-white/10 pt-10">
            <p className="text-pretty leading-relaxed text-white/75">
              {policy.intro}
            </p>

            {policy.sections.map(({ heading, items, paragraphs }, index) => {
              const headingId = `privacy-section-${index + 1}`
              return (
                <section
                  key={heading}
                  aria-labelledby={headingId}
                  className="mt-12 space-y-4"
                >
                  <h2
                    id={headingId}
                    className="font-display text-2xl leading-snug lg:text-3xl"
                  >
                    {heading}
                  </h2>
                  {items && (
                    <ul className="list-disc space-y-2 pl-5 leading-relaxed text-white/75 marker:text-white/30">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-pretty leading-relaxed text-white/75"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              )
            })}
          </div>
        </div>
      </article>
    </main>
  )
}
