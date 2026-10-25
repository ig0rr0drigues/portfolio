import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true })

// Quanto tempo (em segundos) o site guarda o conteúdo antes de buscar de novo no Sanity.
// Depois de publicar no painel, a mudança aparece no site em até 1 minuto.
export const REVALIDATE = 60

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (projectId === 'faltando') return null as T
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } })
}
