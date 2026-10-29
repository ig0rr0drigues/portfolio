import { defineArrayMember, defineField, defineType } from 'sanity'

// Um documento único com os textos fixos do site: apresentação, Sobre e contatos.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home', default: true },
    { name: 'about', title: 'Sobre' },
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
    defineField({ name: 'tools', title: 'Ferramentas', type: 'array', group: 'about', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'education', title: 'Formação', type: 'array', group: 'about', of: [defineArrayMember({ type: 'localeString' })] }),
    defineField({ name: 'offClock', title: 'Fora do estúdio', type: 'localeString', group: 'about' }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'contact' }),
    defineField({ name: 'linkedin', title: 'LinkedIn (link)', type: 'url', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram (link)', type: 'url', group: 'contact' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do site' }) },
})
