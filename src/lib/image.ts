import type { SanityImg } from './types'

/*
  Monta o endereço de uma imagem no CDN do Sanity no tamanho certo.
  O Sanity redimensiona e converte para o formato mais leve (WebP/AVIF) sozinho.
  GIFs são entregues como estão, para não perder a animação.
*/
export function imageUrl(img: SanityImg, width: number, ratio?: number): string {
  if (!img?.url) return ''
  if (img.url.endsWith('.gif')) return img.url
  const p = new URLSearchParams({ w: String(width), auto: 'format', q: '80' })
  if (ratio) {
    p.set('h', String(Math.round(width / ratio)))
    p.set('fit', 'crop')
    p.set('crop', 'focalpoint')
    p.set('fp-x', String(img.hotspot?.x ?? 0.5))
    p.set('fp-y', String(img.hotspot?.y ?? 0.5))
  }
  return `${img.url}?${p.toString()}`
}

export function srcSet(img: SanityImg, widths: number[], ratio?: number): string | undefined {
  if (!img?.url || img.url.endsWith('.gif')) return undefined
  return widths.map((w) => `${imageUrl(img, w, ratio)} ${w}w`).join(', ')
}

export function parseRatio(r?: string, fallback = 16 / 9): number {
  const m = /^(\d+):(\d+)$/.exec(r || '')
  return m ? Number(m[1]) / Number(m[2]) : fallback
}
