import { cache } from 'react'
import { sanityFetch } from '@/sanity/client'
import { projectQuery, projectsQuery, settingsQuery } from '@/sanity/queries'
import type { Project, ProjectCard, Settings } from './types'

export const getProjects = cache(async () => {
  const res = await sanityFetch<{ ordered?: (ProjectCard | null)[]; rest?: ProjectCard[] } | null>(projectsQuery)
  // Ignora itens da lista que apontam para projetos apagados ou sem endereço.
  const ordered = (res?.ordered || []).filter((p): p is ProjectCard => !!p && !!p.slug)
  return [...ordered, ...(res?.rest || [])]
})
export const getProject = cache(async (slug: string) => sanityFetch<Project | null>(projectQuery, { slug }))
export const getSettings = cache(async () => sanityFetch<Settings>(settingsQuery))
