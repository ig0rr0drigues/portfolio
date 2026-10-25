import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // O endereço raiz abre o site em português.
  async redirects() {
    return [{ source: '/', destination: '/pt', permanent: false }]
  },
}

export default nextConfig
