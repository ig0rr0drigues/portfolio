import { parseRatio } from '@/lib/image'

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

// Pergunta ao Vimeo a largura e a altura originais do vídeo (guardado por 1 dia).
async function vimeoRatio(url: string): Promise<number | null> {
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { width?: number; height?: number }
    return data.width && data.height ? data.width / data.height : null
  } catch {
    return null
  }
}

type Props = {
  url: string
  ratio?: string
  customWidth?: number
  customHeight?: number
  loop?: boolean
  title: string
}

export async function Vimeo({ url, ratio, customWidth, customHeight, loop, title }: Props) {
  const src = vimeoEmbedUrl(url, loop)
  if (!src) return null
  let r: number
  if (ratio === 'custom' && customWidth && customHeight) r = customWidth / customHeight
  else if (!ratio || ratio === 'auto' || ratio === 'custom') r = (await vimeoRatio(url)) || 16 / 9
  else r = parseRatio(ratio)
  return (
    <div className={`vimeo${r < 1 ? ' vimeo--tall' : ''}`} style={{ aspectRatio: String(r) }}>
      <iframe src={src} title={title} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
    </div>
  )
}
