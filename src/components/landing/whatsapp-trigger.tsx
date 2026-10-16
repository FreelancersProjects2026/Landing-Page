import type { ComponentProps } from 'react'
import { MessageCircle, X } from 'lucide-react'

type WhatsAppTriggerProps = ComponentProps<'button'> & { label: string }

const iconTransition =
  'absolute size-7 motion-safe:transition-[opacity,rotate] motion-safe:duration-300 motion-safe:ease-out'

// Reenvía props y ref al <button>: Radix inyecta aria-expanded, data-state y manejadores.
export function WhatsAppTrigger({ label, ...props }: WhatsAppTriggerProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
      {...props}
    >
      <MessageCircle
        aria-hidden="true"
        className={`${iconTransition} group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0`}
      />
      <X
        aria-hidden="true"
        className={`${iconTransition} -rotate-90 opacity-0 group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-100`}
      />
    </button>
  )
}
