'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ui, type Lang } from '@/lib/i18n'
import { FluidText } from './FluidText'

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname() || `/${lang}`
  const t = ui[lang]
  const rest = pathname.replace(/^\/(pt|en)/, '')
  const section = rest.startsWith('/sobre') ? 'sobre' : rest.startsWith('/contato') ? 'contato' : 'trabalhos'

  const items = [
    { key: 'trabalhos', href: `/${lang}`, label: t.work },
    { key: 'sobre', href: `/${lang}/sobre`, label: t.about },
    { key: 'contato', href: `/${lang}/contato`, label: t.contact },
  ]

  return (
    <div className="wrap">
      <header className="header">
        <Link className="header__name" href={`/${lang}`}>
          <FluidText text="Igor Rodrigues" radius={3} />
        </Link>
        <nav className="nav" aria-label={lang === 'pt' ? 'Principal' : 'Main'}>
          {items.map((i) => (
            <Link key={i.key} href={i.href} aria-current={section === i.key ? 'page' : undefined}>
              {i.label}
            </Link>
          ))}
          <span className="lang" role="group" aria-label="Idioma / Language">
            <Link href={`/pt${rest}`} aria-current={lang === 'pt' ? 'true' : undefined} hrefLang="pt-BR">
              PT
            </Link>
            <Link href={`/en${rest}`} aria-current={lang === 'en' ? 'true' : undefined} hrefLang="en">
              EN
            </Link>
          </span>
        </nav>
      </header>
    </div>
  )
}
