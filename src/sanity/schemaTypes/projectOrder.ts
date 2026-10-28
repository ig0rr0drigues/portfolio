import { defineArrayMember, defineField, defineType } from 'sanity'

// Documento único com a ordem dos projetos no site: arraste para reordenar.
export const projectOrder = defineType({
  name: 'projectOrder',
  title: 'Ordem dos projetos',
  type: 'document',
  fields: [
    defineField({
      name: 'projects',
      title: 'Projetos, na ordem do site',
      type: 'array',
      description:
        'Arraste pelo ícone de pontinhos para mudar a ordem: o primeiro da lista é o primeiro do mosaico. ' +
        'Projetos novos que ainda não estão aqui aparecem no fim do site, do mais recente ao mais antigo, até você adicioná-los.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
          // Referência "fraca": apagar um projeto não fica bloqueado por estar nesta lista.
          weak: true,
          options: { disableNew: true },
        }),
      ],
      validation: (r) => r.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Ordem dos projetos' }) },
})
