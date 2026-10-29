// Consultas ao Sanity, escritas em GROQ (a linguagem de busca do Sanity).

const imageFields = `{ hotspot, "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`

const cardFields = `_id, title, "slug": slug.current, year, type, "section": coalesce(section, "work"), cover ${imageFields}, "coverVideo": coverVideo.asset->url, coverVimeo`

// Peças de uma seção ($section: "work" ou "archive"):
// primeiro na ordem da lista de ordem ($orderId), depois as que não estão na lista, da mais recente à mais antiga.
export const sectionQuery = `{
  "ordered": *[_id == $orderId][0].projects[]->{ ${cardFields} },
  "rest": *[_type == "project" && defined(slug.current) && coalesce(section, "work") == $section
    && !(_id in coalesce(*[_id == $orderId][0].projects[]._ref, []))]
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

export const settingsQuery = `*[_type == "siteSettings"][0]{ ..., aboutPhoto ${imageFields}, "aboutVideo": aboutVideo.asset->url }`
