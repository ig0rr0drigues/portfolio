// Consultas ao Sanity, escritas em GROQ (a linguagem de busca do Sanity).

const imageFields = `{ hotspot, "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`

export const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(coalesce(order, 9999) asc, year desc) {
  title, "slug": slug.current, year, type, cover ${imageFields}
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
