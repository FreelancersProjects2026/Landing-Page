'use client'

import dynamic from 'next/dynamic'
import { createContext, use, useState, type ComponentProps } from 'react'

import type { WhatsAppButton } from './whatsapp-button'
import { WhatsAppTrigger, WhatsAppTriggerAutoFocus } from './whatsapp-trigger'

type FallbackContextValue = {
  label: string
  onFocusChange: (focused: boolean) => void
}

// `loading` de next/dynamic no recibe props: el nombre accesible llega por contexto.
const FallbackContext = createContext<FallbackContextValue>({
  label: '',
  onFocusChange: () => {},
})

function DeferredFallback() {
  const { label, onFocusChange } = use(FallbackContext)
  return (
    <WhatsAppTrigger
      label={label}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
    />
  )
}

// Radix se descarga después de hidratar, fuera de la ventana del LCP. Mientras tanto
// se pinta el mismo botón sin menú, también en el HTML del servidor.
const DeferredWhatsAppButton = dynamic(
  () => import('./whatsapp-button').then((module) => module.WhatsAppButton),
  { ssr: false, loading: DeferredFallback },
)

// Al llegar el menú, React cambia el botón provisional por el real: si el provisional
// tenía el foco, el real lo recibe; si no, no lo toma.
export function WhatsAppButtonLazy(
  props: ComponentProps<typeof WhatsAppButton>,
) {
  const [fallbackFocused, setFallbackFocused] = useState(false)

  return (
    <FallbackContext
      value={{ label: props.label, onFocusChange: setFallbackFocused }}
    >
      <WhatsAppTriggerAutoFocus autoFocus={fallbackFocused}>
        <DeferredWhatsAppButton {...props} />
      </WhatsAppTriggerAutoFocus>
    </FallbackContext>
  )
}
