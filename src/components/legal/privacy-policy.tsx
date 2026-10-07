import { ArrowLeft } from 'lucide-react'
import type { PrivacyPolicy } from '@modules/company-profile'

type PrivacyPolicyViewProps = {
  policy: PrivacyPolicy
  homeHref: string
  homeLabel: string
}

const focusRing =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background'

export function PrivacyPolicyView({
  policy,
  homeHref,
  homeLabel,
}: PrivacyPolicyViewProps) {
  return (
    <main className="min-h-svh bg-background px-6 py-16 text-white lg:py-24">
      <article className="mx-auto max-w-3xl break-words">
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

        <header className="mt-10 border-b border-white/10 pb-10">
          <h1 className="font-display text-balance text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">
            {policy.title}
          </h1>
          <p className="mt-4 text-sm text-white/50">{policy.updated}</p>
          <p className="mt-8 text-pretty leading-relaxed text-white/75">
            {policy.intro}
          </p>
        </header>

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
      </article>
    </main>
  )
}
