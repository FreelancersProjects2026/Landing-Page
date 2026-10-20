'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

// Prefijos de las URLs que arman buildWhatsAppUrl y buildEmailComposeUrl (spec 021).
const contactChannels = [
  ['https://wa.me/', 'whatsapp'],
  ['https://mail.google.com/mail/', 'correo'],
] as const

// Un solo listener en document: mide todos los enlaces de contacto sin tocar las secciones.
export function ContactClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const href = event.target.closest('a[href]')?.getAttribute('href') ?? ''
      const channel = contactChannels.find(([prefix]) =>
        href.startsWith(prefix),
      )
      if (channel) track('Contacto', { canal: channel[1] })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
