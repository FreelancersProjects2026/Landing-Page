import { useEffect, useRef, useState } from 'react'

/** Marca el elemento como visible la primera vez que entra en pantalla. */
export function useInView<T extends Element>(threshold: number) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

/** Clases de aparición: visible en su sitio u oculto con el desplazamiento dado. */
export const revealClass = (isVisible: boolean, hiddenOffset: string) =>
  isVisible ? 'opacity-100 translate-y-0' : `opacity-0 ${hiddenOffset}`
