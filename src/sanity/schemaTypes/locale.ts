import { defineArrayMember, defineField, defineType } from 'sanity'

// Campos bilíngues: cada texto tem uma versão em português e uma em inglês.
// Se o inglês ficar vazio, o site mostra o português.

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto curto (PT / EN)',
  type: 'object',
  fields: [
    defineField({ name: 'pt', title: 'Português', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto longo (PT / EN)',
  type: 'object',
  fields: [
    defineField({
      name: 'pt',
      title: 'Português',
      type: 'text',
      rows: 6,
      description: 'Deixe uma linha em branco para separar parágrafos.',
    }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 6 }),
  ],
})

// Texto rico: parágrafos, negrito, itálico, listas e links.
const richBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [{ title: 'Lista', value: 'bullet' }],
  marks: {
    decorators: [
      { title: 'Negrito', value: 'strong' },
      { title: 'Itálico', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            title: 'Endereço (link)',
            type: 'url',
            description: 'Ex.: https://www.instagram.com/usuario',
            validation: (r) => r.required().uri({ scheme: ['http', 'https', 'mailto'] }),
          }),
        ],
      },
    ],
  },
})

export const localeRich = defineType({
  name: 'localeRich',
  title: 'Texto com formatação (PT / EN)',
  type: 'object',
  fields: [
    defineField({
      name: 'pt',
      title: 'Português',
      type: 'array',
      of: [richBlock],
      description: 'Enter cria um parágrafo novo; Shift + Enter quebra a linha. Para criar um link, selecione o texto e clique no ícone de corrente.',
    }),
    defineField({ name: 'en', title: 'English', type: 'array', of: [richBlock] }),
  ],
})
