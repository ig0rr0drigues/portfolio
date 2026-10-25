import type { Metadata, Viewport } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/data'
import { isLang, L, langs, type Lang } from '@/lib/i18n'
import '../globals.css'

// Fontes: Inter para textos, Unbounded no lugar da PP Neue Machina (até a licença ser comprada).
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const unbounded = Unbounded({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })

export const dynamicParams = false
export const revalidate = 60

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'pt'
  const settings = await getSettings()
  const role = L(settings?.role, l) || (l === 'pt' ? 'Diretor de Arte' : 'Art Director')
  return {
    title: { default: `Igor Rodrigues — ${role}`, template: '%s — Igor Rodrigues' },
    description: L(settings?.intro, l) || undefined,
    alternates: { languages: { 'pt-BR': '/pt', en: '/en' } },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f2ee' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
  ],
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  if (!isLang(raw)) notFound()
  const lang = raw as Lang
  const settings = await getSettings()
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : 'en'} className={`${inter.variable} ${unbounded.variable}`}>
      <body>
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} settings={settings} />
      </body>
    </html>
  )
}
