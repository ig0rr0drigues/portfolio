'use client'

import { useState } from 'react'
import { useClient } from 'sanity'

/*
  Manutenção: converte blocos de texto criados no formato antigo (texto puro)
  para o formato novo (texto com formatação e links).
  Usa a sua própria sessão no painel. Pode rodar mais de uma vez sem problema:
  textos que já estão no formato novo não são alterados.
*/

type Doc = { _id: string; title?: string; content?: Array<Record<string, unknown> & { _type: string }> }

const key = () => Math.random().toString(36).slice(2, 12)

function toBlocks(text: unknown) {
  if (typeof text !== 'string' || !text.trim()) return undefined
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
    }))
}

function convertBody(body: unknown) {
  if (!body || typeof body !== 'object') return { changed: false, body }
  const b = body as { pt?: unknown; en?: unknown }
  if (typeof b.pt !== 'string' && typeof b.en !== 'string') return { changed: false, body }
  const next: Record<string, unknown> = { _type: 'localeRich' }
  const pt = typeof b.pt === 'string' ? toBlocks(b.pt) : b.pt
  const en = typeof b.en === 'string' ? toBlocks(b.en) : b.en
  if (pt) next.pt = pt
  if (en) next.en = en
  return { changed: true, body: next }
}

export function MaintenanceTool() {
  const client = useClient({ apiVersion: '2025-01-01' })
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  async function run() {
    setRunning(true)
    setLog([])
    try {
      // Inclui rascunhos (drafts) e versões publicadas.
      const docs: Doc[] = await client.fetch('*[_type == "project"]{ _id, title, content }', {}, { perspective: 'raw' })
      let total = 0
      for (const d of docs) {
        if (!d.content) continue
        let count = 0
        const content = d.content.map((block) => {
          if (block._type !== 'textBlock') return block
          const { changed, body } = convertBody(block.body)
          if (!changed) return block
          count++
          return { ...block, body }
        })
        if (count > 0) {
          await client.patch(d._id).set({ content }).commit()
          total += count
          const draft = d._id.startsWith('drafts.') ? ' (rascunho)' : ''
          setLog((l) => [...l, `${d.title || d._id}${draft}: ${count} texto(s) convertido(s).`])
        }
      }
      setLog((l) => [...l, total ? 'Pronto.' : 'Nada para converter: todos os textos já estão no formato novo.'])
    } catch (err) {
      setLog((l) => [...l, `Erro: ${err instanceof Error ? err.message : String(err)}`])
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 640, lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Manutenção</h1>
      <p style={{ margin: '0 0 8px' }}>
        <strong>Converter textos para o formato com links.</strong> Os blocos de texto criados antes da atualização
        guardam o texto puro. Este botão os transforma no formato novo, que aceita links, negrito e itálico, sem perder
        nada do que você escreveu.
      </p>
      <p style={{ margin: '0 0 20px', opacity: 0.7 }}>Pode clicar mais de uma vez: textos já convertidos são ignorados.</p>
      <button
        type="button"
        onClick={run}
        disabled={running}
        style={{ font: 'inherit', padding: '10px 18px', border: 0, background: '#e94f0e', color: '#111110', cursor: running ? 'wait' : 'pointer' }}
      >
        {running ? 'Convertendo...' : 'Converter textos'}
      </button>
      <ul style={{ marginTop: 24, paddingLeft: 18 }}>
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  )
}
