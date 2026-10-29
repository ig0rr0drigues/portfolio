'use client'

import { useEffect, useState } from 'react'

/*
  Botão "voltar ao topo" das páginas de projeto e de peça do Arquivo.
  Aparece depois que a pessoa rola um pouco mais que uma tela e sobe suavemente
  (ou direto, para quem prefere menos movimento).
*/
export function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      setShow(window.scrollY > window.innerHeight * 1.2)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // Leva o foco do teclado para o início da página.
    const target = document.querySelector<HTMLElement>('.back')
    target?.focus({ preventScroll: true })
  }

  return (
    <button type="button" className={`to-top${show ? ' is-visible' : ''}`} onClick={goTop} aria-label={label} title={label} tabIndex={show ? 0 : -1}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </button>
  )
}
