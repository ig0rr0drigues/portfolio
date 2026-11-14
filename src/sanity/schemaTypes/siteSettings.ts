import { defineArrayMember, defineField, defineType } from 'sanity'

// Um documento único com os textos fixos do site: apresentação, Sobre e contatos.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home', default: true },
    { name: 'about', title: 'Sobre' },
    { name: 'archive', title: 'Arquivo' },
    { name: 'contact', title: 'Contato' },
  ],
  fields: [
    defineField({ name: 'role', title: 'Título profissional', type: 'localeString', group: 'home', description: 'Ex.: Diretor de Arte' }),
    defineField({ name: 'intro', title: 'Apresentação na home', type: 'localeText', group: 'home', description: 'Uma ou duas frases ao lado do seu nome.' }),
    defineField({ name: 'aboutLead', title: 'Frase de abertura', type: 'localeText', group: 'about', description: 'A frase grande no topo da página Sobre.' }),
    defineField({ name: 'aboutBody', title: 'Texto', type: 'localeText', group: 'about' }),
    defineField({
      name: 'aboutPhoto',
      title: 'Sua foto',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
      description: 'Aparece na página Sobre, recortada na vertical (4:5). Use o hotspot para centralizar o rosto.',
    }),
    defineField({
      name: 'aboutVideo',
      title: 'Vídeo sobre você: arquivo — opcional',
      type: 'file',
      group: 'about',
      options: { accept: 'video/mp4,video/webm' },
      description:
        'Toca no lugar da foto: sem som quando o mouse passa por cima, com som quando a pessoa clica. ' +
        'De preferência vertical (4:5 ou 9:16), MP4. Se preferir, use o link do Vimeo abaixo.',
    }),
    defineField({
      name: 'aboutVimeo',
      title: 'Vídeo sobre você: link do Vimeo — opcional',
      type: 'url',
      group: 'about',
      description: 'Alternativa ao arquivo. Se os dois estiverem preenchidos, o site usa o arquivo.',
      validation: (r) =>
        r.custom((value) => (!value || /vimeo\.com\/(?:.*\/)?\d+/.test(String(value)) ? true : 'Esse link não parece ser do Vimeo.')),
    }),
    defineField({
      name: 'experience',
      title: 'Experiência',
      type: 'array',
      group: 'about',
      description: 'Da mais recente para a mais antiga. Arraste para reordenar.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'job',
          fields: [
            defineField({ name: 'start', title: 'Ano de início', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'end', title: 'Ano de saída', type: 'string', description: 'Deixe vazio se for o emprego atual (aparece "Atual").' }),
            defineField({ name: 'company', title: 'Agência / empresa', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'role', title: 'Cargo', type: 'localeString' }),
            defineField({ name: 'city', title: 'Cidade', type: 'string' }),
          ],
          preview: {
            select: { company: 'company', role: 'role.pt', start: 'start', end: 'end' },
            prepare: ({ company, role, start, end }) => ({ title: company, subtitle: [`${start || ''}–${end || 'atual'}`, role].filter(Boolean).join(' · ') }),
          },
        }),
      ],
    }),
    defineField({
      name: 'awards',
      title: 'Prêmios',
      type: 'array',
      group: 'about',
      description: 'Do mais recente para o mais antigo. Arraste para reordenar.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'award',
          fields: [
            defineField({ name: 'year', title: 'Ano', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'festival', title: 'Festival', type: 'string', description: 'Ex.: Cannes Lions, CCSP, El Ojo', validation: (r) => r.required() }),
            defineField({ name: 'level', title: 'Prêmio', type: 'string', description: 'Ex.: Ouro, Prata, Bronze, Shortlist' }),
            defineField({ name: 'work', title: 'Trabalho', type: 'string', description: 'Nome do projeto premiado.' }),
            defineField({ name: 'category', title: 'Categoria', type: 'string', description: 'Ex.: Design, Outdoor (opcional)' }),
          ],
          preview: {
            select: { festival: 'festival', level: 'level', year: 'year', work: 'work' },
            prepare: ({ festival, level, year, work }) => ({ title: [festival, level].filter(Boolean).join(' · '), subtitle: [year, work].filter(Boolean).join(' · ') }),
          },
        }),
      ],
    }),
    defineField({ name: 'tools', title: 'Ferramentas', type: 'array', group: 'about', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'education', title: 'Formação', type: 'array', group: 'about', of: [defineArrayMember({ type: 'localeString' })] }),
    defineField({ name: 'offClock', title: 'Fora do estúdio', type: 'localeString', group: 'about' }),
    defineField({ name: 'archiveIntro', title: 'Apresentação do Arquivo', type: 'localeText', group: 'archive', description: 'Uma ou duas frases no topo da página Arquivo (opcional).' }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'contact' }),
    defineField({ name: 'linkedin', title: 'LinkedIn (link)', type: 'url', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram (link)', type: 'url', group: 'contact' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do site' }) },
})
