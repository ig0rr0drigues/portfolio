import { defineArrayMember, defineField, defineType } from 'sanity'

// Documentos únicos com a ordem das peças no site: arraste para reordenar.
function orderList(name: string, title: string, section: 'work' | 'archive', where: string) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'projects',
        title: `Peças, na ordem ${where}`,
        type: 'array',
        description:
          `Arraste pelo ícone de pontinhos para mudar a ordem: o primeiro da lista é o primeiro ${where}. ` +
          'Peças novas que ainda não estão aqui aparecem no fim, da mais recente à mais antiga, até você adicioná-las.',
        of: [
          defineArrayMember({
            type: 'reference',
            to: [{ type: 'project' }],
            // Referência "fraca": apagar uma peça não fica bloqueado por estar nesta lista.
            weak: true,
            options: {
              disableNew: true,
              filter: section === 'archive' ? 'section == "archive"' : 'coalesce(section, "work") == "work"',
            },
          }),
        ],
        validation: (r) => r.unique(),
      }),
    ],
    preview: { prepare: () => ({ title }) },
  })
}

export const projectOrder = orderList('projectOrder', 'Ordem dos projetos', 'work', 'do mosaico da home')
export const archiveOrder = orderList('archiveOrder', 'Ordem do arquivo', 'archive', 'da página Arquivo')
