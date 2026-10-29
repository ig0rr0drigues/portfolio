'use client'

import { useEffect, useRef } from 'react'

/*
  Vídeo de capa do card do mosaico: aparece por cima da imagem enquanto o mouse está no card.
  - Começa a baixar quando o card se aproxima da tela, para já estar pronto no hover.
  - Só aparece quando o vídeo de fato começou a tocar (sem quadro preto).
  - Desligado em telas de toque e para quem prefere menos movimento: fica a capa estática.
*/
export function CardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video: HTMLVideoElement | null = ref.current
    const card = video?.closest('.card') as HTMLElement | null
    if (!video || !card) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let hovering = false

    // Pré-carrega quando o card chega perto da tela.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.preload = 'auto'
          video.load()
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    io.observe(card)

    const onPlaying = () => {
      if (hovering) card.classList.add('is-playing')
    }
    const enter = () => {
      hovering = true
      video.play().catch(() => undefined)
    }
    const leave = () => {
      hovering = false
      card.classList.remove('is-playing')
      // Pausa depois do fade, e volta ao início para o próximo hover.
      window.setTimeout(() => {
        if (!hovering) {
          video.pause()
          video.currentTime = 0
        }
      }, 450)
    }

    video.addEventListener('playing', onPlaying)
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('focus', enter)
    card.addEventListener('blur', leave)
    return () => {
      io.disconnect()
      video.removeEventListener('playing', onPlaying)
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('focus', enter)
      card.removeEventListener('blur', leave)
    }
  }, [src])

  return <video ref={ref} className="card__video" src={src} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
}
