'use client'

import { MessageCircle } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExternalLink } from '@modules/company-profile'

import { externalLinkProps } from './external-link'

type WhatsAppButtonProps = {
  label: string
  options: readonly ExternalLink[]
}

// Radix resuelve aria-expanded, teclado, Esc y el regreso del foco al botón.
export function WhatsAppButton({ label, options }: WhatsAppButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          <MessageCircle className="size-7" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        {options.map(({ label: optionLabel, url }) => (
          <DropdownMenuItem key={url} asChild>
            <a href={url} {...externalLinkProps}>
              {optionLabel}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
