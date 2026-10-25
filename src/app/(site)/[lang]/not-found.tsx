import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="wrap contact">
      <h1 className="contact__lead">
        <span>404</span>
      </h1>
      <p>
        Página não encontrada. / Page not found. <Link href="/pt">Voltar / Back</Link>
      </p>
    </section>
  )
}
