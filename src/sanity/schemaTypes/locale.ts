import { defineField, defineType } from 'sanity'

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
