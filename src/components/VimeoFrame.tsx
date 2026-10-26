'use client'

import { useEffect, useState } from 'react'

/*
  Player do Vimeo. No formato Automático, pergunta ao Vimeo (pelo navegador do visitante)
  a largura e a altura originais do vídeo e ajusta a proporção. Enquanto isso, usa 16:9.
*/
export function VimeoFrame({ src, url, ratio, auto, title }: { src: string; url: string; ratio: number; auto: boolean; title: string }) {
  const [r, setR] = useState(ratio)

  useEffect(() => {
    if (!auto) return
    let cancelled = false
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { width?: number; height?: number } | null) => {
        if (!cancelled && data?.width && data?.height) setR(data.width / data.height)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [auto, url])

  return (
    <div className={`vimeo${r < 1 ? ' vimeo--tall' : ''}`} style={{ aspectRatio: String(r) }}>
      <iframe src={src} title={title} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
    </div>
  )
}
