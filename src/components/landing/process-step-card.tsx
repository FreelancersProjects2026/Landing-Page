import type { Step } from '@modules/company-profile'

type ProcessStepCardProps = {
  step: Step
  index: number
  isActive: boolean
  onSelect: () => void
}

export function ProcessStepCard({
  step,
  index,
  isActive,
  onSelect,
}: ProcessStepCardProps) {
  return (
    <div
      className={`relative text-left p-8 lg:p-10 border transition-all duration-500 ${
        isActive
          ? 'bg-[#000000] border-white/60'
          : 'bg-[#000000] border-white/25 hover:border-white/50'
      }`}
    >
      {/* Step number with active line */}
      <div className="flex items-center gap-4 mb-8">
        <span
          className={`text-4xl font-display transition-colors duration-300 ${
            isActive ? 'text-[#eca8d6]' : 'text-white/20'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px bg-white/10 overflow-hidden">
          {isActive && <div className="h-full bg-[#eca8d6]/50" />}
        </div>
      </div>

      {/* Title: el botón cubre toda la tarjeta (after:inset-0) sin anidar el h3 en él */}
      <h3 className="text-3xl lg:text-4xl font-display mb-6">
        <button
          type="button"
          aria-pressed={isActive}
          onClick={onSelect}
          className="text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white/60"
        >
          {step.title}
        </button>
      </h3>

      {/* Description */}
      <p
        className={`text-white/60 leading-relaxed transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-60'
        }`}
      >
        {step.description}
      </p>

      {/* Active indicator */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-[#eca8d6] transition-transform duration-500 origin-left ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </div>
  )
}
