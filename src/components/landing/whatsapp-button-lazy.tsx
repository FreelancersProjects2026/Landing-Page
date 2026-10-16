'use client'

import dynamic from 'next/dynamic'
import { createContext, use, type ComponentProps } from 'react'

import type { WhatsAppButton } from './whatsapp-button'
import { WhatsAppTrigger } from './whatsapp-trigger'

// `loading` de next/dynamic no recibe props: el nombre accesible llega por contexto.
const LabelContext = createContext('')

function DeferredFallback() {
  return <WhatsAppTrigger label={use(LabelContext)} />
}

// Radix se descarga después de hidratar, fuera de la ventana del LCP. Mientras tanto
// se pinta el mismo botón sin menú, también en el HTML del servidor.
const DeferredWhatsAppButton = dynamic(
  () => import('./whatsapp-button').then((module) => module.WhatsAppButton),
  { ssr: false, loading: DeferredFallback },
)

export function WhatsAppButtonLazy(
  props: ComponentProps<typeof WhatsAppButton>,
) {
  return (
    <LabelContext value={props.label}>
      <DeferredWhatsAppButton {...props} />
    </LabelContext>
  )
}
