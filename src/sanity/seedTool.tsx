'use client'

import { useState } from 'react'
import { useClient } from 'sanity'

/*
  Ferramenta de importação inicial.
  Lê /seed/seed.json (arquivos em public/seed), sobe as imagens para o Sanity
  e cria os projetos e as Configurações do site.
  Usa a sua própria sessão no painel, então não precisa de nenhuma chave secreta.
  Pode rodar de novo sem duplicar nada: os documentos são substituídos.
*/

type SeedImage = { file: string; hotspot?: { x: number; y: number } }
type SeedBlock = { _type: 'imageBlock'; image: SeedImage }
type SeedProject = {
  slug: string
  title: string
  order: number
  year: number
  client: string
  type: { pt: string; en: string }
  role: { pt: string; en: string }
  description: { pt: string; en: string }
  cover: SeedImage
  content: SeedBlock[]
}
type Seed = { settings: Record<string, unknown>; projects: SeedProject[] }

const key = () => Math.random().toString(36).slice(2, 10)

export function SeedTool() {
  const client = useClient({ apiVersion: '2025-01-01' })
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  const say = (line: string) => setLog((l) => [...l, line])

  async function run() {
    setRunning(true)
    setDone(false)
    setLog([])
    try {
      const seed: Seed = await fetch('/seed/seed.json').then((r) => r.json())
      const uploaded = new Map<string, string>()

      const upload = async (file: string) => {
        if (uploaded.has(file)) return uploaded.get(file) as string
        const blob = await fetch(`/seed/${file}`).then((r) => {
          if (!r.ok) throw new Error(`Arquivo não encontrado: ${file}`)
          return r.blob()
        })
        const asset = await client.assets.upload('image', blob, { filename: file.split('/').pop() })
        uploaded.set(file, asset._id)
        return asset._id
      }

      const image = async (img: SeedImage) => {
        const ref = await upload(img.file)
        return {
          _type: 'image',
          asset: { _type: 'reference', _ref: ref },
          ...(img.hotspot ? { hotspot: { _type: 'sanity.imageHotspot', x: img.hotspot.x, y: img.hotspot.y, width: 1, height: 1 } } : {}),
        }
      }

      for (const p of seed.projects) {
        say(`${p.title}: enviando ${p.content.length} imagens...`)
        const content = []
        for (const b of p.content) {
          content.push({ _type: 'imageBlock', _key: key(), image: await image(b.image) })
        }
        await client.createOrReplace({
          _id: `project-${p.slug}`,
          _type: 'project',
          title: p.title,
          slug: { _type: 'slug', current: p.slug },
          order: p.order,
          year: p.year,
          client: p.client,
          type: { _type: 'localeString', ...p.type },
          role: { _type: 'localeString', ...p.role },
          description: { _type: 'localeText', ...p.description },
          cover: await image(p.cover),
          content,
        })
        say(`${p.title}: pronto.`)
      }

      await client.createOrReplace({ _id: 'siteSettings', _type: 'siteSettings', ...seed.settings })
      say('Configurações do site: prontas.')
      setDone(true)
    } catch (err) {
      say(`Erro: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 640, fontFamily: 'inherit', lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Importar conteúdo inicial</h1>
      <p style={{ margin: '0 0 8px' }}>
        Cria os projetos Corote, Inbraza, Meyo e Slany Bolos, com todas as imagens, e preenche as Configurações do site
        (apresentação, Sobre e contatos).
      </p>
      <p style={{ margin: '0 0 20px', opacity: 0.7 }}>
        Leva um ou dois minutos. Se rodar de novo, os projetos importados são substituídos pela versão original
        (as suas edições neles se perdem).
      </p>
      <button
        type="button"
        onClick={run}
        disabled={running}
        style={{ font: 'inherit', padding: '10px 18px', border: 0, background: '#e94f0e', color: '#111110', cursor: running ? 'wait' : 'pointer' }}
      >
        {running ? 'Importando...' : 'Importar agora'}
      </button>
      <ul style={{ marginTop: 24, paddingLeft: 18 }}>
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      {done && <p style={{ marginTop: 16, fontWeight: 600 }}>Tudo importado. Abra a aba "Conteúdo" para ver os projetos.</p>}
    </div>
  )
}
