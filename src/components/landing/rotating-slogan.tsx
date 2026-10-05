'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type RotatingSloganProps = {
  slogan: string
  /** La primera palabra es la que aparece en `slogan`. */
  words: readonly string[]
}

// Tiempo que cada palabra pasa en pantalla antes de cambiar.
const WORD_INTERVAL_MS = 3500
// Entrada letra por letra (como la plantilla original): cada letra pasa de
// borrosa a nítida con un retraso escalonado y luego cambia de color a blanco.
const LETTER_STAGGER_MS = 45
const LETTER_FADE_MS = 500
const COLOR_HOLD_EXTRA_MS = 200
const gradientStops = ['#eca8d6', '#a78bfa', '#67e8f9', '#fbbf24', '#eca8d6']

// Color de la letra según su posición, interpolado entre las paradas del degradado.
function letterColor(index: number, letterCount: number): string {
  const position =
    (index / Math.max(letterCount - 1, 1)) * (gradientStops.length - 1)
  const lower = Math.floor(position)
  const upper = Math.min(lower + 1, gradientStops.length - 1)
  const upperShare = Math.round((position - lower) * 100)
  return `color-mix(in srgb, ${gradientStops[upper]} ${upperShare}%, ${gradientStops[lower]})`
}

function BlurWord({ word }: { word: string }) {
  const letters = [...word]
  const colorHoldMs =
    LETTER_STAGGER_MS * letters.length + LETTER_FADE_MS + COLOR_HOLD_EXTRA_MS

  return (
    <span data-rotating-word className="whitespace-nowrap motion-reduce:hidden">
      {letters.map((letter, i) => (
        <span
          key={i}
          className="inline-block motion-safe:animate-hero-letter"
          style={
            {
              '--letter-delay': `${i * LETTER_STAGGER_MS}ms`,
              '--letter-fade': `${LETTER_FADE_MS}ms`,
              '--letter-hold': `${colorHoldMs}ms`,
              '--letter-color': letterColor(i, letters.length),
            } as CSSProperties
          }
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

export function RotatingSlogan({ slogan, words }: RotatingSloganProps) {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setWordIndex((prev) => (prev + 1) % words.length),
      WORD_INTERVAL_MS,
    )
    return () => clearInterval(interval)
  }, [words.length])

  // El dominio garantiza que el eslogan contiene la primera palabra rotativa.
  const splitAt = slogan.indexOf(words[0])
  const sloganStart = slogan.slice(0, splitAt)
  const sloganEnd = slogan.slice(splitAt + words[0].length)

  return (
    <>
      {/* Lectores de pantalla oyen el eslogan fijo, no cada cambio de palabra */}
      <span className="sr-only">{slogan}</span>
      <span aria-hidden="true">
        {sloganStart}
        <BlurWord key={wordIndex} word={words[wordIndex]} />
        <span className="hidden motion-reduce:inline">{words[0]}</span>
        {sloganEnd}
      </span>
    </>
  )
}
