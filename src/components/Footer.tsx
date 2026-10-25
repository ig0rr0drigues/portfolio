import Link from 'next/link'
import { ui, type Lang } from '@/lib/i18n'
import type { Settings } from '@/lib/types'

export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const t = ui[lang]
  return (
    <div className="wrap">
      <footer className="footer">
        <span>
          © {new Date().getFullYear()} Igor Rodrigues. {t.rights}
        </span>
        <nav aria-label={lang === 'pt' ? 'Redes' : 'Social'}>
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {settings?.email && <Link href={`/${lang}/contato`}>{settings.email}</Link>}
        </nav>
      </footer>
    </div>
  )
}
