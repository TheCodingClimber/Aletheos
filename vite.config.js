import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const SEO_IMAGE_PATH = '/og-image.svg'
const DEFAULT_SITE_URL = 'https://aletheosai.com'

function normalizeSiteUrl(value) {
  if (!value) {
    return ''
  }

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    return url.origin
  } catch {
    return ''
  }
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function aletheosSeoPlugin() {
  let siteUrl = ''
  let outDir = ''

  return {
    name: 'aletheos-seo',
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), '')
      siteUrl = normalizeSiteUrl(
        env.SITE_URL || env.VITE_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || DEFAULT_SITE_URL,
      )
      outDir = config.build.outDir
    },
    transformIndexHtml(html) {
      if (!siteUrl) {
        return html
      }

      const pageUrl = escapeAttribute(`${siteUrl}/`)
      const imageUrl = escapeAttribute(`${siteUrl}${SEO_IMAGE_PATH}`)

      return html
        .replace(
          '<meta property="og:type" content="website" />',
          `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${pageUrl}" />`,
        )
        .replace('<meta property="og:image" content="/og-image.svg" />', `<meta property="og:image" content="${imageUrl}" />`)
        .replace('<meta name="twitter:image" content="/og-image.svg" />', `<meta name="twitter:image" content="${imageUrl}" />`)
        .replace('</head>', `    <link rel="canonical" href="${pageUrl}" />\n  </head>`)
    },
    writeBundle() {
      if (!siteUrl || !outDir) {
        return
      }

      const distDir = join(process.cwd(), outDir)
      const pageUrl = `${siteUrl}/`
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        `    <loc>${pageUrl}</loc>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '</urlset>',
        '',
      ].join('\n')

      writeFileSync(join(distDir, 'sitemap.xml'), sitemap)

      const robotsPath = join(distDir, 'robots.txt')

      if (existsSync(robotsPath)) {
        const robots = readFileSync(robotsPath, 'utf8').trimEnd()
        const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`
        const nextRobots = robots.includes('Sitemap:') ? robots : `${robots}\n${sitemapLine}\n`
        writeFileSync(robotsPath, nextRobots)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aletheosSeoPlugin()],
})
