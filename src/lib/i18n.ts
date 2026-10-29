export const langs = ['pt', 'en'] as const
export type Lang = (typeof langs)[number]

export const isLang = (v: string): v is Lang => (langs as readonly string[]).includes(v)

type Localized = { pt?: string; en?: string } | null | undefined

// Escolhe o texto do idioma atual; se o inglês estiver vazio, usa o português.
export function L(value: Localized, lang: Lang): string {
  if (!value) return ''
  return (value[lang] || value.pt || '').trim()
}

export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

// Textos fixos da interface.
export const ui = {
  pt: {
    work: 'Trabalhos',
    archive: 'Arquivo',
    archiveBack: 'Todo o arquivo',
    archiveNext: 'Próxima peça',
    archiveEmpty: 'Nada no arquivo ainda.',
    about: 'Sobre',
    contact: 'Contato',
    back: 'Todos os trabalhos',
    next: 'Próximo projeto',
    role: 'Papel',
    client: 'Cliente',
    agency: 'Agência',
    year: 'Ano',
    team: 'Equipe',
    recognition: 'Reconhecimento',
    tools: 'Ferramentas',
    education: 'Formação',
    offClock: 'Fora do estúdio',
    contactLead: ['Vamos', 'conversar.'],
    copy: 'Copiar e-mail',
    copied: 'E-mail copiado',
    rights: 'Todos os direitos reservados.',
    empty: 'Nenhum projeto publicado ainda.',
    image: 'imagem',
    video: 'vídeo',
    mediaHover: 'Passe o mouse para assistir',
    mediaTap: 'Toque para assistir',
    mediaSound: 'Clique para ouvir',
    mediaPause: 'Som ligado · clique para pausar',
    mediaResume: 'Clique para continuar',
    photoAlt: 'Foto de Igor Rodrigues',
    toTop: 'Voltar ao topo',
  },
  en: {
    work: 'Work',
    archive: 'Archive',
    archiveBack: 'Full archive',
    archiveNext: 'Next piece',
    archiveEmpty: 'Nothing in the archive yet.',
    about: 'About',
    contact: 'Contact',
    back: 'All work',
    next: 'Next project',
    role: 'Role',
    client: 'Client',
    agency: 'Agency',
    year: 'Year',
    team: 'Team',
    recognition: 'Recognition',
    tools: 'Tools',
    education: 'Education',
    offClock: 'Off the clock',
    contactLead: ['Let’s', 'talk.'],
    copy: 'Copy email',
    copied: 'Email copied',
    rights: 'All rights reserved.',
    empty: 'No projects published yet.',
    image: 'image',
    video: 'video',
    mediaHover: 'Hover to watch',
    mediaTap: 'Tap to watch',
    mediaSound: 'Click for sound',
    mediaPause: 'Sound on · click to pause',
    mediaResume: 'Click to resume',
    photoAlt: 'Photo of Igor Rodrigues',
    toTop: 'Back to top',
  },
} satisfies Record<Lang, Record<string, string | string[]>>
