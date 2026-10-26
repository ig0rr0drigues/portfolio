import { parseRatio } from '@/lib/image'
import { VimeoFrame } from './VimeoFrame'

// Extrai o número do vídeo (e a chave de vídeos não listados) de um link do Vimeo.
export function vimeoEmbedUrl(url: string, loop?: boolean): string | null {
  const m = /vimeo\.com\/(?:.*?\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/.exec(url)
  if (!m) return null
  const id = m[1]
  let hash = m[2]
  try {
    hash = new URL(url).searchParams.get('h') || hash
  } catch {
    /* link sem protocolo: segue com o que achou */
  }
  const p = new URLSearchParams({ title: '0', byline: '0', portrait: '0', dnt: '1', color: 'e94f0e' })
  if (hash) p.set('h', hash)
  if (loop) {
    p.set('autoplay', '1')
    p.set('muted', '1')
    p.set('loop', '1')
    p.set('autopause', '0')
    p.set('controls', '0')
  }
  return `https://player.vimeo.com/video/${id}?${p.toString()}`
}

type Props = {
  url: string
  ratio?: string
  customWidth?: number
  customHeight?: number
  loop?: boolean
  title: string
}

export function Vimeo({ url, ratio, customWidth, customHeight, loop, title }: Props) {
  const src = vimeoEmbedUrl(url, loop)
  if (!src) return null
  const custom = ratio === 'custom' && customWidth && customHeight
  const auto = !custom && (!ratio || ratio === 'auto' || ratio === 'custom')
  const r = custom ? customWidth! / customHeight! : auto ? 16 / 9 : parseRatio(ratio)
  return <VimeoFrame src={src} url={url} ratio={r} auto={auto} title={title} />
}
