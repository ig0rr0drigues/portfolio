import { defineField, defineType } from 'sanity'

// Os blocos que você empilha dentro de um projeto.

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Imagem',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Legenda (opcional)',
      type: 'localeString',
    }),
  ],
  preview: {
    select: { media: 'image', caption: 'caption.pt' },
    prepare: ({ media, caption }) => ({ title: caption || 'Imagem', subtitle: 'Largura total', media }),
  },
})

export const imagePairBlock = defineType({
  name: 'imagePairBlock',
  title: 'Duas imagens lado a lado',
  type: 'object',
  fields: [
    defineField({ name: 'left', title: 'Imagem da esquerda', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'right', title: 'Imagem da direita', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: 'ratio',
      title: 'Proporção',
      type: 'string',
      description: 'As duas imagens são recortadas na mesma proporção. Use o "hotspot" de cada imagem para escolher o centro do recorte.',
      options: {
        list: [
          { title: 'Vertical 4:5', value: '4:5' },
          { title: 'Quadrada 1:1', value: '1:1' },
          { title: 'Vertical 3:4', value: '3:4' },
          { title: 'Horizontal 16:9', value: '16:9' },
        ],
        layout: 'radio',
      },
      initialValue: '4:5',
    }),
  ],
  preview: {
    select: { media: 'left' },
    prepare: ({ media }) => ({ title: 'Duas imagens', subtitle: 'Lado a lado', media }),
  },
})

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Texto',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Título (opcional)', type: 'localeString' }),
    defineField({ name: 'body', title: 'Texto', type: 'localeRich', validation: (r) => r.required() }),
  ],
  preview: {
    select: { heading: 'heading.pt', body: 'body.pt' },
    prepare: ({ heading, body }) => {
      const first = Array.isArray(body)
        ? (body[0]?.children || []).map((c: { text?: string }) => c.text || '').join('')
        : String(body || '')
      return { title: heading || first.slice(0, 60) || 'Texto', subtitle: 'Texto' }
    },
  },
})

export const vimeoBlock = defineType({
  name: 'vimeoBlock',
  title: 'Vídeo do Vimeo',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Link do vídeo no Vimeo',
      type: 'url',
      description: 'Cole o link do vídeo, por exemplo https://vimeo.com/123456789. Vídeos não listados também funcionam.',
      validation: (r) =>
        r.required().custom((value) =>
          !value || /vimeo\.com\/(?:.*\/)?\d+/.test(String(value)) ? true : 'Esse link não parece ser do Vimeo.'
        ),
    }),
    defineField({
      name: 'ratio',
      title: 'Formato do vídeo',
      type: 'string',
      options: {
        list: [
          { title: 'Horizontal 16:9', value: '16:9' },
          { title: 'Vertical 9:16', value: '9:16' },
          { title: 'Quadrado 1:1', value: '1:1' },
          { title: 'Vertical 4:5', value: '4:5' },
          { title: 'Cinema 21:9', value: '21:9' },
        ],
        layout: 'radio',
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'loop',
      title: 'Tocar sozinho, sem som, em loop',
      type: 'boolean',
      description: 'Bom para vídeos curtos que funcionam como imagem animada. Desligado: o visitante aperta o play.',
      initialValue: false,
    }),
    defineField({ name: 'caption', title: 'Legenda (opcional)', type: 'localeString' }),
  ],
  preview: {
    select: { url: 'url', caption: 'caption.pt' },
    prepare: ({ url, caption }) => ({ title: caption || 'Vídeo do Vimeo', subtitle: url }),
  },
})
