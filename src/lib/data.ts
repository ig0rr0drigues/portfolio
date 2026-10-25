import { cache } from 'react'
import { sanityFetch } from '@/sanity/client'
import { projectQuery, projectsQuery, settingsQuery } from '@/sanity/queries'
import type { Project, ProjectCard, Settings } from './types'

export const getProjects = cache(async () => (await sanityFetch<ProjectCard[]>(projectsQuery)) || [])
export const getProject = cache(async (slug: string) => sanityFetch<Project | null>(projectQuery, { slug }))
export const getSettings = cache(async () => sanityFetch<Settings>(settingsQuery))
