'use client'

import Image from 'next/image'
import { useId } from 'react'
import { ArrowUpRight, MessageCircle, X } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExternalLink } from '@modules/company-profile'

import { externalLinkProps } from './external-link'

type WhatsAppButtonProps = {
  label: string
  name: string
  greeting: string
  options: readonly ExternalLink[]
}

const iconTransition =
  'absolute size-7 motion-safe:transition-[opacity,rotate] motion-safe:duration-300 motion-safe:ease-out'

// Radix resuelve aria-expanded, teclado, Esc y el regreso del foco al botón.
// modal={false}: un chat flotante no debe bloquear el scroll ni los clics de la página.
export function WhatsAppButton({
  label,
  name,
  greeting,
  options,
}: WhatsAppButtonProps) {
  const greetingId = useId()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        aria-describedby={greetingId}
        className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-foreground/10 bg-background p-0 text-foreground shadow-xl motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
      >
        <DropdownMenuLabel className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
          <Image
            src="/logo/icono/LogoPJM.jpeg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <span className="font-display text-base font-normal">{name}</span>
        </DropdownMenuLabel>

        <div className="flex flex-col gap-2 p-4">
          <p
            id={greetingId}
            className="mb-2 max-w-[85%] rounded-2xl rounded-tl-sm bg-foreground/5 px-4 py-3 text-sm leading-relaxed text-foreground"
          >
            {greeting}
          </p>
          {options.map(({ label: optionLabel, url }) => (
            <DropdownMenuItem
              key={url}
              asChild
              className="group/option self-end cursor-pointer gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground focus:bg-foreground focus:text-background motion-safe:transition-colors motion-safe:duration-300"
            >
              <a href={url} {...externalLinkProps}>
                {optionLabel}
                {/* text-current: la base de shadcn pinta en muted los svg sin clase text-* */}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 text-current motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-focus/option:translate-x-0.5 group-focus/option:-translate-y-0.5"
                />
              </a>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
