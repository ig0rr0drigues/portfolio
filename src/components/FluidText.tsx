'use client'

import { Fragment, useEffect, useRef } from 'react'

/*
  Texto com "peso que respira", letra por letra.
  Cada letra fica mais leve conforme o mouse se aproxima dela e volta ao peso normal
  quando ele se afasta. A mudança é suavizada quadro a quadro, para ficar fluida.

  - radius: alcance do efeito, em "em" (múltiplos do tamanho da fonte do texto).
  - light: peso mínimo, o da letra bem embaixo do cursor.
  Só funciona com mouse (não em telas de toque) e é desligado para quem prefere menos movimento.
  A fonte de títulos precisa ser variável (a Space Grotesk é).
*/
type Props = { text: string; radius?: number; light?: number }

export function FluidText({ text, radius = 2.2, light = 300 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el: HTMLSpanElement | null = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters: HTMLElement[] = Array.from(el.querySelectorAll('[data-l]')) as HTMLElement[]
    if (!letters.length) return
    const base = () => parseFloat(getComputedStyle(el).fontWeight) || 700
    const reach = () => radius * (parseFloat(getComputedStyle(el).fontSize) || 16)
    let rest = base()
    const current = letters.map(() => rest)
    let mx = -1e5
    let my = -1e5
    let near = false
    let raf = 0

    const tick = () => {
      const R = reach()
      let settling = false
      for (let i = 0; i < letters.length; i++) {
        const r = letters[i].getBoundingClientRect()
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
        const t = Math.min(1, d / R)
        const smooth = t * t * (3 - 2 * t) // perto do cursor: 0 (leve); longe: 1 (peso normal)
        const target = light + (rest - light) * smooth
        const next = current[i] + (target - current[i]) * 0.16
        current[i] = Math.abs(next - target) < 0.5 ? target : next
        if (current[i] !== target) settling = true
        letters[i].style.fontWeight = String(Math.round(current[i]))
      }
      raf = near || settling ? requestAnimationFrame(tick) : 0
    }

    const update = () => {
      const b = el.getBoundingClientRect()
      const R = reach()
      near = mx > b.left - R && mx < b.right + R && my > b.top - R && my < b.bottom + R
      if (!raf && (near || current.some((w) => w !== rest))) raf = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      update()
    }
    const onLeave = () => {
      mx = my = -1e5
      update()
    }
    const onResize = () => {
      rest = base()
      update()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      letters.forEach((l) => (l.style.fontWeight = ''))
    }
  }, [radius, light, text])

  const words = text.split(' ')
  return (
    <span ref={ref} className="fluid">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && ' '}
            <span className="fluid__word">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} data-l="">
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  )
}
