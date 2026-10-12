import { cn } from '@/lib/utils'

import { sectionIds } from './section-ids'
import { revealClass } from './use-in-view'

type ServicesHeaderProps = {
  label: string
  title: string
  intro: string
  isVisible: boolean
}

export function ServicesHeader({
  label,
  title,
  intro,
  isVisible,
}: ServicesHeaderProps) {
  return (
    <div className="relative mb-24 lg:mb-32">
      <div className="grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-12 h-px bg-foreground/30" />
            {label}
          </span>
          <h2
            id={`${sectionIds.services}-titulo`}
            className={cn(
              'text-5xl md:text-6xl lg:text-[88px] font-display tracking-tight leading-[0.9] transition-all duration-1000',
              revealClass(isVisible, 'translate-y-8'),
            )}
          >
            {title}
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pb-4">
          <p
            className={cn(
              'text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200',
              revealClass(isVisible, 'translate-y-4'),
            )}
          >
            {intro}
          </p>
        </div>
      </div>
    </div>
  )
}
