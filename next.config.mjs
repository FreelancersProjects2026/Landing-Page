/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Experimental en Next 16: 404 propia para URL que no empiezan con un idioma.
  experimental: {
    globalNotFound: true,
    // CSS en línea en el HTML: quita la hoja de estilos que bloquea el primer render (LCP).
    inlineCss: true,
  },
  async redirects() {
    return [{ source: '/', destination: '/es', permanent: false }]
  },
}

export default nextConfig
