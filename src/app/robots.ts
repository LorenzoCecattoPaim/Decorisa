// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://decorisa.com.br'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/cliente', '/api/', '/checkout', '/carrinho'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
