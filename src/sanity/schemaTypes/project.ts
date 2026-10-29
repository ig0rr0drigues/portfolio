import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  groups: [
    { name: 'info', title: 'Informações', default: true },
    { name: 'content', title: 'Conteúdo' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', group: 'info', validation: (r) => r.required() }),
    defineField({
      name: 'section',
      title: 'Onde aparece',
      type: 'string',
      group: 'info',
      description: 'Trabalhos são os projetos principais (home). Arquivo é para peças pontuais. Mude para mover entre os dois e depois ajuste a lista de ordem correspondente.',
      options: {
        list: [
          { title: 'Trabalhos', value: 'work' },
          { title: 'Arquivo', value: 'archive' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'work',
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da página',
      type: 'slug',
      group: 'info',
      description: 'Clique em "Generate" para criar a partir do título. Vira o final do link: /pt/projetos/esse-texto',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Capa',
      type: 'image',
      group: 'info',
      description: 'Aparece no mosaico da home, recortada na vertical (4:5). Clique no ícone de recorte e mova o círculo (hotspot) para o ponto mais importante da imagem.',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverVideo',
      title: 'Vídeo de capa (hover): arquivo — opcional',
      type: 'file',
      group: 'info',
      description:
        'Toca no lugar da capa quando o mouse passa pelo card na home. É a opção mais rápida. Use um MP4 curto e sem som: ' +
        'de 4 a 10 segundos, vertical 4:5 (ex.: 1080 × 1350), até uns 8 MB. Se preferir, use o link do Vimeo no campo abaixo.',
      options: { accept: 'video/mp4,video/webm' },
    }),
    defineField({
      name: 'coverVimeo',
      title: 'Vídeo de capa (hover): link do Vimeo — opcional',
      type: 'url',
      group: 'info',
      description:
        'Alternativa ao arquivo: cole o link do vídeo no Vimeo. O vídeo é recortado para preencher o card. ' +
        'Se o arquivo acima também estiver preenchido, o site usa o arquivo.',
      validation: (r) =>
        r.custom((value) => (!value || /vimeo\.com\/(?:.*\/)?\d+/.test(String(value)) ? true : 'Esse link não parece ser do Vimeo.')),
    }),
    defineField({ name: 'type', title: 'Tipo', type: 'localeString', group: 'info', description: 'Ex.: Campanha, Branding, Editorial.' }),
    defineField({ name: 'year', title: 'Ano', type: 'number', group: 'info', validation: (r) => r.integer().min(1990).max(2100) }),
    defineField({ name: 'client', title: 'Cliente', type: 'string', group: 'info' }),
    defineField({ name: 'agency', title: 'Agência (opcional)', type: 'string', group: 'info' }),
    defineField({ name: 'role', title: 'Seu papel', type: 'localeString', group: 'info', description: 'Ex.: Direção de arte, Key visual.' }),
    defineField({ name: 'description', title: 'Descrição', type: 'localeText', group: 'info' }),
    defineField({
      name: 'team',
      title: 'Equipe (opcional)',
      type: 'array',
      group: 'info',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'member',
          fields: [
            defineField({ name: 'role', title: 'Função', type: 'string' }),
            defineField({ name: 'name', title: 'Nome', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        }),
      ],
    }),
    defineField({
      name: 'recognition',
      title: 'Reconhecimento (opcional)',
      type: 'array',
      group: 'info',
      description: 'Um prêmio por linha. Ex.: Cannes Lions · Design · Bronze',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'order',
      title: 'Ordem no mosaico',
      type: 'number',
      group: 'info',
      description: 'Números menores aparecem primeiro. Projetos sem número vão para o fim, do mais recente ao mais antigo.',
      hidden: true,
    }),
    defineField({
      name: 'content',
      title: 'Blocos',
      type: 'array',
      group: 'content',
      description: 'Empilhe imagens, textos e vídeos na ordem em que devem aparecer. Arraste para reordenar.',
      of: [
        defineArrayMember({ type: 'imageBlock' }),
        defineArrayMember({ type: 'imagePairBlock' }),
        defineArrayMember({ type: 'textBlock' }),
        defineArrayMember({ type: 'vimeoBlock' }),
      ],
    }),
  ],
  orderings: [
    { title: 'Ano, mais recente', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', client: 'client', media: 'cover' },
    prepare: ({ title, year, client, media }) => ({ title, subtitle: [client, year].filter(Boolean).join(' · '), media }),
  },
})
