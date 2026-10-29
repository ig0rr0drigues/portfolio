import Link from 'next/link'
import { Blocks } from '@/components/Blocks'
import { FluidText } from '@/components/FluidText'
import { Lines } from '@/components/RichText'
import { L, paragraphs, ui, type Lang } from '@/lib/i18n'
import type { Project, ProjectCard } from '@/lib/types'

/*
  Página de um projeto ou de uma peça do Arquivo: título, descrição, ficha técnica,
  blocos de conteúdo e o link para o próximo da mesma seção.
*/
type Props = {
  p: Project
  all: ProjectCard[]
  lang: Lang
  basePath: string
  backHref: string
  backLabel: string
  nextLabel: string
}

export function ProjectView({ p, all, lang, basePath, backHref, backLabel, nextLabel }: Props) {
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
        <Link className="back" href={backHref}>
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
        <h1 className="project-title">
          <span className="rise">
            <span>
              <FluidText text={p.title} />
            </span>
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
        <Link className="wrap next reveal" href={`${basePath}/${next.slug}`}>
          <span className="rotulo">{nextLabel}</span>
          <br />
          <span className="next__title">
            <FluidText text={next.title} /> →
          </span>
        </Link>
      )}
    </article>
  )
}
