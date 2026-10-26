import { Fragment, type ReactNode } from 'react'
import type { Lang } from '@/lib/i18n'

// Formato do texto rico salvo pelo Sanity (Portable Text), só com o que o painel permite.
type Span = { _key?: string; _type: 'span'; text?: string; marks?: string[] }
type MarkDef = { _key: string; _type: string; href?: string }
export type PTBlock = {
  _key?: string
  _type: 'block'
  style?: string
  listItem?: string
  children?: Span[]
  markDefs?: MarkDef[]
}
export type LocalizedRich = { pt?: string | PTBlock[]; en?: string | PTBlock[] } | null | undefined

let k = 0
const key = () => `k${k++}`

// Textos antigos (texto puro) viram parágrafos; uma quebra de linha simples é mantida.
function fromPlain(text: string): PTBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p): PTBlock => ({ _type: 'block', children: [{ _type: 'span', text: p }] }))
}

const isEmpty = (v: string | PTBlock[] | undefined) =>
  !v || (typeof v === 'string' ? !v.trim() : !v.some((b) => (b.children || []).some((c) => (c.text || '').trim())))

// Escolhe o idioma; se o inglês estiver vazio, usa o português.
export function pickRich(value: LocalizedRich, lang: Lang): PTBlock[] {
  if (!value) return []
  const v = !isEmpty(value[lang]) ? value[lang] : value.pt
  if (!v) return []
  return typeof v === 'string' ? fromPlain(v) : v
}

// Quebras de linha simples dentro de um texto viram <br />.
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {part}
        </Fragment>
      ))}
    </>
  )
}

function renderSpan(span: Span, defs: MarkDef[]): ReactNode {
  let node: ReactNode = <Lines text={span.text || ''} />
  for (const mark of span.marks || []) {
    if (mark === 'strong') node = <strong>{node}</strong>
    else if (mark === 'em') node = <em>{node}</em>
    else {
      const def = defs.find((d) => d._key === mark)
      if (def?._type === 'link' && def.href) {
        const external = /^https?:/.test(def.href)
        node = (
          <a className="rich-link" href={def.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {node}
          </a>
        )
      }
    }
  }
  return <Fragment key={span._key || key()}>{node}</Fragment>
}

function renderBlock(b: PTBlock) {
  return (b.children || []).map((s) => renderSpan(s, b.markDefs || []))
}

export function RichText({ blocks }: { blocks: PTBlock[] }) {
  const out: ReactNode[] = []
  let list: PTBlock[] = []
  const flush = () => {
    if (!list.length) return
    out.push(
      <ul key={key()}>
        {list.map((b) => (
          <li key={b._key || key()}>{renderBlock(b)}</li>
        ))}
      </ul>
    )
    list = []
  }
  for (const b of blocks) {
    if (b._type !== 'block') continue
    if (b.listItem) {
      list.push(b)
      continue
    }
    flush()
    out.push(<p key={b._key || key()}>{renderBlock(b)}</p>)
  }
  flush()
  return <>{out}</>
}
