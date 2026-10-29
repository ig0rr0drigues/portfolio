'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Vídeo de capa do card vindo de um link do Vimeo.
  - O player é carregado escondido quando o card se aproxima da tela e fica pausado.
  - No hover, recebe "play"; o vídeo só aparece quando começa a tocar de fato.
  - Ao sair, some com fade, pausa e volta ao início.
  - O player é recortado para preencher o card (4:5), como uma imagem com "object-fit: cover".
  Conversa com o player pela API de mensagens do Vimeo (postMessage), sem bibliotecas extras.
  Desligado em telas de toque e para quem prefere menos movimento.
*/
const ORIGIN = 'https://player.vimeo.com'

export function CardVimeo({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(16 / 9)

  useEffect(() => {
    const box: HTMLDivElement | null = ref.current
    const card = box?.closest('.card') as HTMLElement | null
    if (!box || !card) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const m = /vimeo\.com\/(?:.*?\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/.exec(url)
    if (!m) return
    let hash = m[2]
    try {
      hash = new URL(url).searchParams.get('h') || hash
    } catch {
      /* link sem protocolo */
    }
    const params = new URLSearchParams({ background: '1', autoplay: '0', muted: '1', loop: '1', autopause: '0', dnt: '1' })
    if (hash) params.set('h', hash)
    const src = `${ORIGIN}/video/${m[1]}?${params.toString()}`

    // Proporção original, para recortar o player no formato do card.
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { width?: number; height?: number } | null) => {
        if (d?.width && d?.height) setRatio(d.width / d.height)
      })
      .catch(() => undefined)

    let iframe: HTMLIFrameElement | null = null
    let ready = false
    let hovering = false

    const post = (method: string, value?: unknown) =>
      iframe?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), ORIGIN)

    const onMessage = (e: MessageEvent) => {
      if (!iframe || e.source !== iframe.contentWindow) return
      let data: { event?: string } | null = null
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      if (!data?.event) return
      if (data.event === 'ready') {
        ready = true
        ;['play', 'playing', 'timeupdate'].forEach((ev) => post('addEventListener', ev))
        post('setVolume', 0)
        if (hovering) post('play')
        else post('pause')
      } else if ((data.event === 'playing' || data.event === 'timeupdate') && hovering) {
        card.classList.add('is-playing')
      }
    }
    window.addEventListener('message', onMessage)

    // Cria o player quando o card se aproxima da tela.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting) || iframe) return
        iframe = document.createElement('iframe')
        iframe.src = src
        iframe.allow = 'autoplay; fullscreen; picture-in-picture'
        iframe.tabIndex = -1
        iframe.title = ''
        iframe.setAttribute('aria-hidden', 'true')
        box.appendChild(iframe)
        io.disconnect()
      },
      { rootMargin: '300px 0px' }
    )
    io.observe(card)

    const enter = () => {
      hovering = true
      if (ready) post('play')
    }
    const leave = () => {
      hovering = false
      card.classList.remove('is-playing')
      window.setTimeout(() => {
        if (!hovering && ready) {
          post('pause')
          post('setCurrentTime', 0)
        }
      }, 450)
    }
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('focus', enter)
    card.addEventListener('blur', leave)

    return () => {
      io.disconnect()
      window.removeEventListener('message', onMessage)
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('focus', enter)
      card.removeEventListener('blur', leave)
      iframe?.remove()
    }
  }, [url])

  return <div ref={ref} className="card__video card__vimeo" style={{ '--vr': ratio } as React.CSSProperties} aria-hidden="true" />
}
