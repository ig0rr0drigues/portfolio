import type { Metadata } from 'next'
import Link from 'next/link'
import { CardVideo } from '@/components/CardVideo'
import { CardVimeo } from '@/components/CardVimeo'
import { FluidText } from '@/components/FluidText'
import { getArchive, getSettings } from '@/lib/data'
import { imageUrl, srcSet } from '@/lib/image'
import { isLang, L, ui, type Lang } from '@/lib/i18n'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: lang === 'en' ? 'Archive' : 'Arquivo' }
}

// Página Arquivo: peças pontuais em formato de catálogo, com título sempre visível.
export default async function Archive({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const [items, settings] = await Promise.all([getArchive(), getSettings()])
  const t = ui[lang]
  const intro = L(settings?.archiveIntro, lang)

  return (
    <>
      <section className="wrap archive-head">
        <h1 className="archive-title">
          <span className="rise">
            <span>
              <FluidText text={t.archive} />
            </span>
          </span>
        </h1>
        {intro && (
          <p className="archive-intro reveal" style={{ '--d': '300ms' } as React.CSSProperties}>
            {intro}
          </p>
        )}
      </section>

      {items.length === 0 ? (
        <p className="wrap empty">{t.archiveEmpty}</p>
      ) : (
        <section className="wrap archive-grid" aria-label={t.archive}>
          {items.map((p, i) => (
            <Link
              key={p.slug}
              className={`card card--archive reveal reveal--media${p.coverVideo || p.coverVimeo ? ' card--video' : ''}`}
              style={{ '--d': `${(i % 4) * 90}ms` } as React.CSSProperties}
              href={`/${lang}/arquivo/${p.slug}`}
            >
              <span className="card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(p.cover, 700, 4 / 5)}
                  srcSet={srcSet(p.cover, [400, 700, 1000], 4 / 5)}
                  sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw"
                  width={700}
                  height={875}
                  alt={p.title}
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                {p.coverVideo ? <CardVideo src={p.coverVideo} /> : p.coverVimeo ? <CardVimeo url={p.coverVimeo} /> : null}
              </span>
              <span className="card__caption">
                <span className="card__caption-title" role="heading" aria-level={2}>
                  {p.title}
                </span>
                <span className="card__caption-meta">{[L(p.type, lang), p.year].filter(Boolean).join(' · ')}</span>
              </span>
            </Link>
          ))}
        </section>
      )}
    </>
  )
}
