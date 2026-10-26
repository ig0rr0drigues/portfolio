import type { LocalizedRich } from '@/components/RichText'

export type Localized = { pt?: string; en?: string }

export type SanityImg = {
  url?: string
  w?: number
  h?: number
  hotspot?: { x: number; y: number } | null
} | null

export type ProjectCard = {
  title: string
  slug: string
  year?: number
  type?: Localized
  cover: SanityImg
}

export type Block =
  | { _type: 'imageBlock'; _key: string; image: SanityImg; caption?: Localized }
  | { _type: 'imagePairBlock'; _key: string; left: SanityImg; right: SanityImg; ratio?: string }
  | { _type: 'textBlock'; _key: string; heading?: Localized; body?: LocalizedRich }
  | { _type: 'vimeoBlock'; _key: string; url?: string; ratio?: string; loop?: boolean; caption?: Localized }

export type Project = ProjectCard & {
  client?: string
  agency?: string
  role?: Localized
  description?: Localized
  team?: { _key: string; role?: string; name?: string }[]
  recognition?: string[]
  content?: Block[]
}

export type Settings = {
  role?: Localized
  intro?: Localized
  aboutLead?: Localized
  aboutBody?: Localized
  tools?: string[]
  education?: Localized[]
  offClock?: Localized
  email?: string
  linkedin?: string
  instagram?: string
} | null
