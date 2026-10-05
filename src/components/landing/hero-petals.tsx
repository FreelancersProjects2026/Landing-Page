// Posición y ritmo de cada pétalo; caen en la mitad derecha, donde está el árbol.
// Valores deterministas (sin Math.random) para que servidor y cliente rendericen igual.
const heroPetals = Array.from({ length: 6 }, (_, i) => ({
  left: `${52 + ((i * 37) % 46)}%`,
  delay: `${(i * 1.3).toFixed(2)}s`,
  duration: `${9 + ((i * 3) % 6)}s`,
}))

export function HeroPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden">
      {heroPetals.map((petal, i) => (
        <span
          key={i}
          className="absolute -top-4 w-2 h-2.5 rounded-[60%_0] bg-pink-300/70 animate-hero-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  )
}
