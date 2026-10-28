import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Blocks } from '@/components/Blocks'
import { getProject, getProjects } from '@/lib/data'
import { imageUrl } from '@/lib/image'
import { Lines } from '@/components/RichText'
import { isLang, L, paragraphs, ui, type Lang } from '@/lib/i18n'

export const revalidate = 60
// Projetos novos publicados no painel ganham página sem precisar refazer o site.
export const dynamicParams = true

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.flatMap((p) => [{ lang: 'pt', slug: p.slug }, { lang: 'en', slug: p.slug }])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const p = await getProject(slug)
  if (!p) return {}
  const cover = imageUrl(p.cover, 1200, 1200 / 630)
  return {
    title: p.title,
    description: L(p.description, lang).slice(0, 160) || undefined,
    openGraph: cover ? { images: [{ url: cover, width: 1200, height: 630 }] } : undefined,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { lang: raw, slug } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const [p, all] = await Promise.all([getProject(slug), getProjects()])
  if (!p) notFound()
  const t = ui[lang]
  const i = all.findIndex((x) => x.slug === p.slug)
  const next = all.length > 1 ? all[(i + 1) % all.length] : null
  const type = L(p.type, lang)
  const role = L(p.role, lang)
  const desc = paragraphs(L(p.description, lang))
  const team = (p.team || []).filter((m) => m.name)
  const recognition = (p.recognition || []).filter(Boolean)

  return (
    <article>
      <header className="wrap project-head">
        <Link className="back" href={`/${lang}`}>
          <span aria-hidden="true">←</span> {t.back}
        </Link>
        <h1 className="project-title">
          <span className="rise">
            <span>{p.title}</span>
          </span>
        </h1>
        {(type || p.year) && <p className="project-type reveal" style={{ '--d': '250ms' } as React.CSSProperties}>{[type, p.year].filter(Boolean).join(' · ')}</p>}
        {desc.length > 0 && (
          <div className="project-desc reveal" style={{ '--d': '350ms' } as React.CSSProperties}>
            {desc.map((d, j) => (
              <p key={j}>
                <Lines text={d} />
              </p>
            ))}
          </div>
        )}
        <dl className="credits reveal" style={{ '--d': '450ms' } as React.CSSProperties}>
          {role && (
            <div className="wide">
              <dt className="rotulo">{t.role}</dt>
              <dd>{role}</dd>
            </div>
          )}
          {p.client && (
            <div>
              <dt className="rotulo">{t.client}</dt>
              <dd>{p.client}</dd>
            </div>
          )}
          {p.agency && (
            <div>
              <dt className="rotulo">{t.agency}</dt>
              <dd>{p.agency}</dd>
            </div>
          )}
          {p.year && (
            <div>
              <dt className="rotulo">{t.year}</dt>
              <dd>{p.year}</dd>
            </div>
          )}
          {team.length > 0 && (
            <div className="wide">
              <dt className="rotulo">{t.team}</dt>
              <dd>{team.map((m) => (m.role ? `${m.role}: ${m.name}` : m.name)).join(' · ')}</dd>
            </div>
          )}
          {recognition.length > 0 && (
            <div className="wide">
              <dt className="rotulo">{t.recognition}</dt>
              <dd>
                {recognition.map((r, j) => (
                  <span key={j} style={{ display: 'block' }}>
                    {r}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <Blocks blocks={p.content || []} lang={lang} title={p.title} />

      {next && next.slug !== p.slug && (
        <Link className="wrap next reveal" href={`/${lang}/projetos/${next.slug}`}>
          <span className="rotulo">{t.next}</span>
          <br />
          <span className="next__title">{next.title} →</span>
        </Link>
      )}
    </article>
  )
}
