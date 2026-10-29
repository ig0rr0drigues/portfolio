import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { Lines } from '@/components/RichText'
import { isLang, L, paragraphs, ui, type Lang } from '@/lib/i18n'
import { FluidText } from '@/components/FluidText'
import { AboutMedia } from '@/components/AboutMedia'
import { imageUrl, srcSet } from '@/lib/image'

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
  const photo = s?.aboutPhoto?.url ? s.aboutPhoto : null

  return (
    <section className={`wrap about${photo ? ' about--photo' : ''}`}>
      <h1 className="about__lead reveal">
        <FluidText text={L(s?.aboutLead, lang)} radius={2.6} />
      </h1>
      {photo && (
        <AboutMedia
          img={{ src: imageUrl(photo, 1000, 4 / 5), srcSet: srcSet(photo, [600, 1000, 1600], 4 / 5), width: 1000, height: 1250 }}
          video={s?.aboutVideo}
          vimeo={s?.aboutVimeo}
          labels={{ hover: t.mediaHover, tap: t.mediaTap, sound: t.mediaSound, pause: t.mediaPause, resume: t.mediaResume, alt: t.photoAlt }}
        />
      )}
      <div className="about__side">
        <div className="about__body reveal" style={{ '--d': '150ms' } as React.CSSProperties}>
          {body.map((p, i) => (
            <p key={i}>
              <Lines text={p} />
            </p>
          ))}
        </div>
        <dl className="about__facts reveal" style={{ '--d': '280ms' } as React.CSSProperties}>
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
      </div>
    </section>
  )
}
