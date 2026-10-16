import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  preload: false,
})

// Compartidas por el layout de cada idioma y la 404 global, que no usa ese layout.
export const fontVariables = `${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`
