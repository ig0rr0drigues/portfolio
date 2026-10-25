import type { Metadata } from 'next'
import { CopyEmail } from '@/components/CopyEmail'
import { getSettings } from '@/lib/data'
import { isLang, ui, type Lang } from '@/lib/i18n'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: lang === 'en' ? 'Contact' : 'Contato' }
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const s = await getSettings()
  const t = ui[lang]

  return (
    <section className="wrap contact">
      <h1 className="contact__lead">
        {t.contactLead.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </h1>
      {s?.email && (
        <div className="email-row">
          <a className="email" href={`mailto:${s.email}`}>
            {s.email}
          </a>
          <CopyEmail email={s.email} label={t.copy} done={t.copied} />
        </div>
      )}
      <ul className="socials">
        {s?.linkedin && (
          <li>
            <a href={s.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </li>
        )}
        {s?.instagram && (
          <li>
            <a href={s.instagram} target="_blank" rel="noopener noreferrer">
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  )
}
