import type { Metadata } from 'next'

const siteIcon = '/logo/icono/LogoPJM.jpeg'
// Google pide favicons cuadrados en múltiplos de 48 px; el JPEG mide 1024.
const favicon = '/logo/icono/LogoPJM-192.png'

// Compartidos por el layout de cada idioma y la 404 global; Next genera los <link>.
export const siteIcons = {
  icon: favicon,
  apple: siteIcon,
} satisfies Metadata['icons']
