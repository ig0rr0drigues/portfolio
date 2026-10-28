// Consultas ao Sanity, escritas em GROQ (a linguagem de busca do Sanity).

const imageFields = `{ hotspot, "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`

const cardFields = `_id, title, "slug": slug.current, year, type, cover ${imageFields}`

// Primeiro os projetos na ordem da lista "Ordem dos projetos";
// depois os que não estão na lista, do mais recente ao mais antigo.
export const projectsQuery = `{
  "ordered": *[_id == "projectOrder"][0].projects[]->{ ${cardFields} },
  "rest": *[_type == "project" && defined(slug.current) && !(_id in coalesce(*[_id == "projectOrder"][0].projects[]._ref, []))]
    | order(coalesce(order, 9999) asc, year desc) { ${cardFields} }
}`

export const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
  title, "slug": slug.current, year, client, agency, type, role, description, team, recognition,
  cover ${imageFields},
  content[] {
    _type, _key, caption, heading, body, url, ratio, customWidth, customHeight, loop,
    image ${imageFields}, left ${imageFields}, right ${imageFields}
  }
}`

export const settingsQuery = `*[_type == "siteSettings"][0]`
