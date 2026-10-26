# Igor Rodrigues — portfólio

Site pessoal de Igor Rodrigues, diretor de arte.

## Como funciona

O site tem três partes:

| Parte | Onde fica | O que faz |
|---|---|---|
| **Conteúdo** | Sanity (o painel em `/studio`) | Projetos, textos, imagens, vídeos, Sobre e contatos |
| **Aparência** | Este código (Next.js) | Layout, mosaico, fontes e cores do design system |
| **Hospedagem** | Vercel | Coloca o site no ar a cada mudança no código |

Publicou algo no painel? O site atualiza sozinho em até 1 minuto.

## Publicar um projeto

1. Abra `seusite.com/studio` e entre com a conta do Sanity.
2. Em **Projetos**, clique no lápis (novo documento).
3. Na aba **Informações**: título, endereço (clique em *Generate*), capa, tipo, ano, cliente e papel.
4. Na aba **Conteúdo**: adicione blocos (imagem, duas imagens lado a lado, texto ou vídeo do Vimeo) e arraste para ordenar.
5. Clique em **Publish**.

## Onde mexer no código

- `src/app/(site)/globals.css`: cores, tamanhos e espaçamentos (os tokens do design system).
- `src/app/(site)/[lang]/`: as páginas (home, projeto, sobre, contato).
- `src/components/Blocks.tsx`: como cada bloco aparece na página do projeto.
- `src/sanity/schemaTypes/`: os campos do painel.
- `src/lib/i18n.ts`: textos fixos da interface em PT e EN.

## Manutenção

A aba **Manutenção** do painel converte blocos de texto antigos (texto puro) para o formato com links. Pode ser removida quando não houver mais textos antigos.

## Variáveis de ambiente (opcionais)

O projeto do Sanity (`cctrc9we`, dataset `production`) já é o padrão no código. As variáveis só são necessárias para apontar para outro projeto.

```
NEXT_PUBLIC_SANITY_PROJECT_ID=cctrc9we
NEXT_PUBLIC_SANITY_DATASET=production
```
