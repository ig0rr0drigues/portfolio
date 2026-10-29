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
  schema: {
    types: schemaTypes,
    // Modelos de criação: um projeto novo já nasce em Trabalhos ou no Arquivo, conforme a lista.
    templates: (prev) => [
      ...prev.filter((t) => t.schemaType !== 'project'),
      { id: 'project-work', title: 'Projeto (Trabalhos)', schemaType: 'project', value: { section: 'work' } },
      { id: 'project-archive', title: 'Peça do Arquivo', schemaType: 'project', value: { section: 'archive' } },
    ],
  },
  plugins: [
    structureTool({
      title: 'Conteúdo',
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.listItem()
              .title('Projetos')
              .id('projetos')
              .child(
                S.documentList()
                  .title('Projetos')
                  .schemaType('project')
                  .filter('_type == "project" && coalesce(section, "work") == "work"')
                  .initialValueTemplates([S.initialValueTemplateItem('project-work')])
              ),
            S.listItem()
              .title('Arquivo')
              .id('arquivo')
              .child(
                S.documentList()
                  .title('Arquivo')
                  .schemaType('project')
                  .filter('_type == "project" && section == "archive"')
                  .initialValueTemplates([S.initialValueTemplateItem('project-archive')])
              ),
            S.divider(),
            S.listItem()
              .title('Ordem dos projetos')
              .id('projectOrder')
              .child(S.document().schemaType('projectOrder').documentId('projectOrder').title('Ordem dos projetos')),
            S.listItem()
              .title('Ordem do arquivo')
              .id('archiveOrder')
              .child(S.document().schemaType('archiveOrder').documentId('archiveOrder').title('Ordem do arquivo')),
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
    newDocumentOptions: (prev) => prev.filter((t) => !['siteSettings', 'projectOrder', 'archiveOrder'].includes(t.templateId)),
  },
})
