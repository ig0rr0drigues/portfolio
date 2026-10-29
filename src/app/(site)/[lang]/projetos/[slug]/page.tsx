import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/data'
import { imageUrl } from '@/lib/image'
import { isLang, L, ui, type Lang } from '@/lib/i18n'
import { ProjectView } from '@/components/ProjectView'

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
  return (
    <ProjectView
      p={p}
      all={all}
      lang={lang}
      basePath={`/${lang}/projetos`}
      backHref={`/${lang}`}
      backLabel={ui[lang].back}
      nextLabel={ui[lang].next}
    />
  )
}
