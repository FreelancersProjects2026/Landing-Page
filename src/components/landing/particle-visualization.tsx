'use client'

import { useEffect, useRef } from 'react'

// Floating dot particles that react to the cursor.
// Listens on window so it still reacts when content is layered on top of the canvas.
export function ParticleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Tamaño cacheado: medir en cada frame fuerza layout.
    let w = 0
    let h = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      // Asignar width limpia el canvas; sin bucle (movimiento reducido) nada más lo redibujaría.
      draw()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Generate stable particle positions
    const COUNT = 70
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618
      return {
        bx: (seed * 127.1) % 1,
        by: (seed * 311.7) % 1,
        phase: seed * Math.PI * 2,
        speed: 0.4 + (seed % 0.4),
        radius: 1.2 + (seed % 2.2),
      }
    })

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24

        const bx = p.bx * w
        const by = p.by * h
        const dx = p.bx - mx
        const dy = p.by - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist * 2.8)

        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3

        ctx.beginPath()
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      })
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      time += 0.016
      draw()
      frameRef.current = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }

    // Con movimiento reducido queda el primer frame estático. Si no, solo anima en pantalla.
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const observer = reducedMotion
      ? null
      : new IntersectionObserver(([entry]) => {
          if (!entry?.isIntersecting) stop()
          else if (!frameRef.current)
            frameRef.current = requestAnimationFrame(loop)
        })
    observer?.observe(canvas)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      observer?.disconnect()
      stop()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
