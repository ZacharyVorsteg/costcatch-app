import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/inventory/', '/reports/'],
    },
    sitemap: 'https://costcatch.com/sitemap.xml',
  }
}
