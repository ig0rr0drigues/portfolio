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
  const jobs = (s?.experience || []).filter((j) => j.company)
  const awards = (s?.awards || []).filter((a) => a.festival)

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

      {jobs.length > 0 && (
        <section className="cv" aria-labelledby="cv-exp">
          <h2 id="cv-exp" className="cv__title reveal">{t.experience}</h2>
          <div className="cv__head cv__row cv__row--exp rotulo" aria-hidden="true">
            <span>{t.period}</span>
            <span>{t.company}</span>
            <span>{t.position}</span>
            <span />
          </div>
          <ul className="cv__list">
            {jobs.map((j) => (
              <li key={j._key} className="cv__row cv__row--exp reveal">
                <span className="cv__year">
                  {j.start}
                  {j.end !== j.start && <>–{j.end || t.current}</>}
                </span>
                <span className="cv__main">{j.company}</span>
                <span>{L(j.role, lang)}</span>
                <span className="cv__meta">{j.city}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {awards.length > 0 && (
        <section className="cv" aria-labelledby="cv-awards">
          <h2 id="cv-awards" className="cv__title reveal">{t.awards}</h2>
          <div className="cv__head cv__row cv__row--award rotulo" aria-hidden="true">
            <span>{t.year}</span>
            <span>{t.festival}</span>
            <span>{t.project}</span>
          </div>
          <ul className="cv__list">
            {awards.map((a) => (
              <li key={a._key} className="cv__row cv__row--award reveal">
                <span className="cv__year">{a.year}</span>
                <span className="cv__main">
                  {a.festival}
                  {a.level && <em className="cv__level"> {a.level}</em>}
                </span>
                <span>
                  {a.work}
                  {a.category && <span className="cv__meta"> — {a.category}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
