'use client'

import { bindCardTrigger, videoMode } from '@/lib/cardTrigger'
import { useEffect, useRef } from 'react'

/*
  Vídeo de capa do card do mosaico: aparece por cima da imagem enquanto o mouse está no card.
  - Começa a baixar quando o card se aproxima da tela, para já estar pronto no hover.
  - Só aparece quando o vídeo de fato começou a tocar (sem quadro preto).
  - Com mouse toca no hover; no celular, quando o card passa pelo centro da tela (cardTrigger.ts).
*/
export function CardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video: HTMLVideoElement | null = ref.current
    const card = video?.closest('.card') as HTMLElement | null
    if (!video || !card) return
    // Com mouse: toca no hover. No celular: toca quando o card passa pelo centro da tela.
    const mode = videoMode()
    if (!mode) return

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
    const unbind = bindCardTrigger(card, enter, leave, mode)
    return () => {
      io.disconnect()
      video.removeEventListener('playing', onPlaying)
      unbind()
    }
  }, [src])

  return <video ref={ref} className="card__video" src={src} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
}
