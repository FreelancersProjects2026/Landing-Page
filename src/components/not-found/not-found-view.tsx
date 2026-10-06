import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type NotFoundViewProps = {
  lang: string
  title: string
  text: string
  cta: string
  imageAlt: string
  imageSrc: string
  homeHref: string
}

export function NotFoundView({
  lang,
  title,
  text,
  cta,
  imageAlt,
  imageSrc,
  homeHref,
}: NotFoundViewProps) {
  return (
    <main
      lang={lang}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-4 py-10 text-center text-white"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1672}
        height={941}
        preload
        className="relative w-full max-w-6xl max-h-[55svh] object-contain motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700"
      />
      <div className="relative -mt-4 flex flex-col items-center gap-5 sm:-mt-8">
        <h1 className="font-display max-w-4xl text-balance text-[clamp(2rem,4vw,3.5rem)] leading-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-200 motion-safe:duration-700 motion-safe:fill-mode-both">
          {title}
        </h1>
        <p className="max-w-xl text-pretty text-white/70 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 motion-safe:duration-700 motion-safe:fill-mode-both">
          {text}
        </p>
        <div className="relative mt-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-500 motion-safe:duration-700 motion-safe:fill-mode-both">
          {/* Halo tenue ámbar y magenta detrás del botón. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgb(245_165_36/0.18),rgb(224_50_154/0.1),transparent)] blur-xl"
          />
          <Link
            href={homeHref}
            className="group btn-obsidian motion-safe:animate-obsidian-glow inline-flex h-14 items-center gap-3 rounded-full px-8 font-medium"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-5 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1"
            />
            {cta}
          </Link>
        </div>
      </div>
    </main>
  )
}
