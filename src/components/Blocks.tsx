import { imageUrl, parseRatio, srcSet } from '@/lib/image'
import { L, paragraphs, ui, type Lang } from '@/lib/i18n'
import type { Block, SanityImg } from '@/lib/types'
import { Vimeo } from './Vimeo'

function Img({ img, alt, sizes, ratio, eager }: { img: SanityImg; alt: string; sizes: string; ratio?: number; eager?: boolean }) {
  if (!img?.url) return null
  const w = img.w || 1600
  const h = ratio ? Math.round(w / ratio) : img.h || 900
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(img, 1600, ratio)}
      srcSet={srcSet(img, [800, 1600, 2400], ratio)}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

function Caption({ text }: { text: string }) {
  if (!text) return null
  return <p className="caption wrap">{text}</p>
}

export function Blocks({ blocks, lang, title }: { blocks: Block[]; lang: Lang; title: string }) {
  const t = ui[lang]
  let n = 0
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        switch (b._type) {
          case 'imageBlock':
            n++
            return (
              <figure key={b._key} className="block-image">
                <Img img={b.image} alt={`${title} — ${t.image} ${n}`} sizes="100vw" eager={i === 0} />
                <Caption text={L(b.caption, lang)} />
              </figure>
            )
          case 'imagePairBlock': {
            const r = parseRatio(b.ratio, 4 / 5)
            n += 2
            return (
              <div key={b._key} className="block-pair">
                <Img img={b.left} alt={`${title} — ${t.image} ${n - 1}`} sizes="(max-width: 600px) 100vw, 50vw" ratio={r} />
                <Img img={b.right} alt={`${title} — ${t.image} ${n}`} sizes="(max-width: 600px) 100vw, 50vw" ratio={r} />
              </div>
            )
          }
          case 'textBlock': {
            const heading = L(b.heading, lang)
            const body = paragraphs(L(b.body, lang))
            if (!heading && !body.length) return null
            return (
              <section key={b._key} className="block-text wrap">
                {heading ? <h2 className="block-text__heading">{heading}</h2> : <span />}
                <div className="block-text__body">
                  {body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            )
          }
          case 'vimeoBlock':
            if (!b.url) return null
            return (
              <figure key={b._key} className="block-video">
                <Vimeo url={b.url} ratio={b.ratio} loop={b.loop} title={L(b.caption, lang) || `${title} — ${t.video}`} />
                <Caption text={L(b.caption, lang)} />
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
