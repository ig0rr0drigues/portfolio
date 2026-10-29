import { cache } from 'react'
import { sanityFetch } from '@/sanity/client'
import { projectQuery, sectionQuery, settingsQuery } from '@/sanity/queries'
import type { Project, ProjectCard, Settings } from './types'

async function getSection(section: 'work' | 'archive', orderId: string) {
  const res = await sanityFetch<{ ordered?: (ProjectCard | null)[]; rest?: ProjectCard[] } | null>(sectionQuery, { section, orderId })
  // Ignora itens da lista apagados, sem endereço ou que mudaram de seção.
  const ordered = (res?.ordered || []).filter((p): p is ProjectCard => !!p && !!p.slug && p.section === section)
  return [...ordered, ...(res?.rest || [])]
}

// Projetos principais (home) e peças do Arquivo.
export const getProjects = cache(() => getSection('work', 'projectOrder'))
export const getArchive = cache(() => getSection('archive', 'archiveOrder'))
export const getProject = cache(async (slug: string) => sanityFetch<Project | null>(projectQuery, { slug }))
export const getSettings = cache(async () => sanityFetch<Settings>(settingsQuery))
