import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { Lines } from '@/components/RichText'
import { isLang, L, paragraphs, ui, type Lang } from '@/lib/i18n'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: lang === 'en' ? 'About' : 'Sobre' }
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang: Lang = isLang(raw) ? raw : 'pt'
  const s = await getSettings()
  const t = ui[lang]
  const body = paragraphs(L(s?.aboutBody, lang))
  const education = (s?.education || []).map((e) => L(e, lang)).filter(Boolean)
  const off = L(s?.offClock, lang)

  return (
    <section className="wrap about">
      <h1 className="about__lead">{L(s?.aboutLead, lang)}</h1>
      <div className="about__body">
        {body.map((p, i) => (
          <p key={i}>
            <Lines text={p} />
          </p>
        ))}
      </div>
      <dl className="about__facts">
        {s?.tools && s.tools.length > 0 && (
          <div>
            <dt className="rotulo">{t.tools}</dt>
            <dd>
              {s.tools.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </dd>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <dt className="rotulo">{t.education}</dt>
            <dd>
              {education.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </dd>
          </div>
        )}
        {off && (
          <div>
            <dt className="rotulo">{t.offClock}</dt>
            <dd>{off}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
