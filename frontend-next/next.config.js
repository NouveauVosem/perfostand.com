/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  // Dev-прокси на бекенд (аналог vite server.proxy в админке/кристале):
  // в `next dev` /api/* → http://127.0.0.1:8300/* со срезанием префикса /api.
  // В проде (next build / static export) rewrites не применяются — там /api
  // проксирует nginx. Поэтому фронт всегда обращается к одному пути `/api`.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8300/:path*',
      },
    ]
  },
}

module.exports = nextConfig
