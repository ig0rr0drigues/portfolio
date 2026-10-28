'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { MaintenanceTool } from './src/sanity/maintenanceTool'
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
            S.listItem()
              .title('Ordem dos projetos')
              .id('projectOrder')
              .child(S.document().schemaType('projectOrder').documentId('projectOrder').title('Ordem dos projetos')),
            S.divider(),
            S.listItem()
              .title('Configurações do site')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
  ],
  tools: (prev) => [...prev, { name: 'manutencao', title: 'Manutenção', component: MaintenanceTool }],
  document: {
    // Configurações do site e Ordem dos projetos são documentos únicos: não aparecem no botão "novo".
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteSettings' && t.templateId !== 'projectOrder'),
  },
})
