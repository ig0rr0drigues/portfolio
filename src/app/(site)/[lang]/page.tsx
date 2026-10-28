import Link from 'next/link'
import { getProjects, getSettings } from '@/lib/data'
import { imageUrl, srcSet } from '@/lib/image'
import { isLang, L, ui, type Lang } from '@/lib/i18n'
import { FluidText } from '@/components/FluidText'

export const revalidate = 60

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const [projects, settings] = await Promise.all([getProjects(), getSettings()])
  const t = ui[lang]
  const role = L(settings?.role, lang)
  const intro = L(settings?.intro, lang)
  // Até 5 projetos: 2 colunas (imagens grandes). A partir de 6: 3 colunas.
  const cols = projects.length >= 6 ? 3 : 2

  return (
    <>
      <section className="wrap hero">
        <h1 className="hero__name">
          <span className="rise">
            <span>
              <FluidText text="Igor" />
            </span>
          </span>
          <span className="rise">
            <span style={{ '--d': '90ms' } as React.CSSProperties}>
              <FluidText text="Rodrigues" />
              <i className="hero__dot" aria-hidden="true" />
            </span>
          </span>
        </h1>
        {(role || intro) && (
          <p className="hero__intro reveal" style={{ '--d': '350ms' } as React.CSSProperties}>
            {role && <strong>{role}. </strong>}
            {intro}
          </p>
        )}
      </section>

      {projects.length === 0 ? (
        <p className="wrap empty">{t.empty}</p>
      ) : (
        <section className="grid" style={{ '--cols': cols } as React.CSSProperties} aria-label={t.work}>
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              className="card reveal reveal--media"
              style={{ '--d': `${(i % cols) * 120}ms` } as React.CSSProperties}
              href={`/${lang}/projetos/${p.slug}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(p.cover, 900, 4 / 5)}
                srcSet={srcSet(p.cover, [600, 900, 1400], 4 / 5)}
                sizes={`(max-width: 600px) 100vw, ${Math.round(100 / cols)}vw`}
                width={900}
                height={1125}
                alt={p.title}
                loading={i < 2 ? 'eager' : 'lazy'}
              />
              <span className="card__veil" />
              <span className="card__info">
                <span className="card__title" role="heading" aria-level={2}>
                  {p.title}
                </span>
                <span className="card__meta">{[L(p.type, lang), p.year].filter(Boolean).join(' · ')}</span>
              </span>
            </Link>
          ))}
        </section>
      )}
    </>
  )
}
