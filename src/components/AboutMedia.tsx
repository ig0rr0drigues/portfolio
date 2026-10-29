'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Foto da página Sobre que vira vídeo.
  - Mouse por cima: o vídeo toca sem som, como prévia (navegadores só liberam som depois de um clique).
  - Clique (ou toque no celular): liga o som e continua tocando mesmo se o mouse sair. Outro clique pausa.
  - Ao sair do hover sem ter ligado o som, pausa e guarda o ponto onde parou.
  Aceita arquivo de vídeo (mais rápido) ou link do Vimeo.
*/
type Labels = { hover: string; tap: string; sound: string; pause: string; resume: string; alt: string }
type Props = {
  img: { src: string; srcSet?: string; width: number; height: number }
  video?: string | null
  vimeo?: string | null
  labels: Labels
}
type Mode = 'idle' | 'preview' | 'sound' | 'paused'

const ORIGIN = 'https://player.vimeo.com'

export function AboutMedia({ img, video, vimeo, labels }: Props) {
  const figRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const vimeoBox = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const readyRef = useRef(false)
  const modeRef = useRef<Mode>('idle')
  const pendingRef = useRef<{ play: boolean; sound: boolean } | null>(null)
  const [mode, setModeState] = useState<Mode>('idle')
  const [playing, setPlaying] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const [ratio, setRatio] = useState(16 / 9)
  const hasVideo = Boolean(video || vimeo)

  const setMode = (m: Mode) => {
    modeRef.current = m
    setModeState(m)
  }

  // ---- controle do player (arquivo ou Vimeo) ----
  const post = (method: string, value?: unknown) =>
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), ORIGIN)

  const control = (play: boolean, sound: boolean) => {
    if (video && videoRef.current) {
      const v = videoRef.current
      v.muted = !sound
      if (play) v.play().catch(() => undefined)
      else v.pause()
      return
    }
    if (vimeo) {
      if (!readyRef.current) {
        pendingRef.current = { play, sound }
        return
      }
      post('setVolume', sound ? 1 : 0)
      post('setMuted', !sound)
      post(play ? 'play' : 'pause')
    }
  }

  useEffect(() => {
    setCanHover(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  // Pré-carrega quando a foto se aproxima da tela.
  useEffect(() => {
    const fig = figRef.current
    if (!fig || !hasVideo) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        if (video && videoRef.current) {
          videoRef.current.preload = 'auto'
          videoRef.current.load()
        }
        if (vimeo && vimeoBox.current && !iframeRef.current) {
          const m = /vimeo\.com\/(?:.*?\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/.exec(vimeo)
          if (!m) return
          let hash = m[2]
          try {
            hash = new URL(vimeo).searchParams.get('h') || hash
          } catch {
            /* link sem protocolo */
          }
          const p = new URLSearchParams({
            autoplay: '0', muted: '1', loop: '1', autopause: '0', controls: '0',
            title: '0', byline: '0', portrait: '0', dnt: '1', playsinline: '1',
          })
          if (hash) p.set('h', hash)
          const f = document.createElement('iframe')
          f.src = `${ORIGIN}/video/${m[1]}?${p.toString()}`
          f.allow = 'autoplay; fullscreen; picture-in-picture'
          f.tabIndex = -1
          f.title = ''
          f.setAttribute('aria-hidden', 'true')
          vimeoBox.current.appendChild(f)
          iframeRef.current = f
          fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeo)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d: { width?: number; height?: number } | null) => d?.width && d?.height && setRatio(d.width / d.height))
            .catch(() => undefined)
        }
      },
      { rootMargin: '300px 0px' }
    )
    io.observe(fig)
    return () => io.disconnect()
  }, [video, vimeo, hasVideo])

  // Eventos do Vimeo.
  useEffect(() => {
    if (!vimeo) return
    const onMessage = (e: MessageEvent) => {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return
      let data: { event?: string } | null = null
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      if (!data?.event) return
      if (data.event === 'ready') {
        readyRef.current = true
        ;['play', 'playing', 'pause', 'timeupdate', 'playProgress'].forEach((ev) => post('addEventListener', ev))
        const pending = pendingRef.current
        pendingRef.current = null
        if (pending) control(pending.play, pending.sound)
        else post('pause')
      } else if (data.event === 'playing' || data.event === 'timeupdate' || data.event === 'playProgress') {
        if (modeRef.current !== 'idle' && modeRef.current !== 'paused') setPlaying(true)
      } else if (data.event === 'pause') {
        setPlaying(false)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeo])

  // ---- interações ----
  const onEnter = () => {
    if (!hasVideo || !canHover) return
    if (modeRef.current === 'idle' || modeRef.current === 'paused') {
      setMode('preview')
      control(true, false)
    }
  }
  const onLeave = () => {
    if (modeRef.current !== 'preview') return
    setMode('idle')
    setPlaying(false)
    control(false, false)
  }
  const onClick = () => {
    if (!hasVideo) return
    if (modeRef.current === 'sound') {
      setMode('paused')
      setPlaying(false)
      control(false, true)
    } else {
      setMode('sound')
      control(true, true)
    }
  }

  const label =
    mode === 'sound' ? labels.pause : mode === 'preview' ? labels.sound : mode === 'paused' ? labels.resume : canHover ? labels.hover : labels.tap
  // O vídeo some quando pausado depois de ouvir só se o mouse sair; pausado com o mouse em cima, continua visível.
  const visible = playing || mode === 'paused'

  return (
    <figure
      ref={figRef}
      className={`portrait reveal reveal--media${hasVideo ? ' portrait--video' : ''}${visible ? ' is-playing' : ''}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ '--d': '120ms', '--vr': ratio } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} srcSet={img.srcSet} sizes="(max-width: 900px) 100vw, 40vw" width={img.width} height={img.height} alt={labels.alt} />
      {video && (
        <video
          ref={videoRef}
          className="portrait__video"
          src={video}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => modeRef.current !== 'idle' && setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      {vimeo && !video && <div ref={vimeoBox} className="portrait__video portrait__vimeo" aria-hidden="true" />}
      {hasVideo && (
        <button type="button" className="portrait__btn" onClick={onClick} aria-label={label}>
          <span className="portrait__hint">{label}</span>
        </button>
      )}
    </figure>
  )
}
