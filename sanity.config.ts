'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { SeedTool } from './src/sanity/seedTool'
import { projectId, dataset } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Igor Rodrigues',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      title: 'Conteúdo',
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.documentTypeListItem('project').title('Projetos'),
            S.divider(),
            S.listItem()
              .title('Configurações do site')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
  ],
  tools: (prev) => [...prev, { name: 'importar', title: 'Importar', component: SeedTool }],
  document: {
    // As Configurações do site são um documento único: não aparecem no botão "novo".
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteSettings'),
  },
})
