// Identificação do projeto no Sanity. Os valores vêm das variáveis de ambiente
// cadastradas na Vercel (NEXT_PUBLIC_SANITY_PROJECT_ID e NEXT_PUBLIC_SANITY_DATASET).
// Sem variáveis cadastradas, usa o projeto do Igor. O Project ID não é segredo.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cctrc9we'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2025-01-01'
