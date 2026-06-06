import type { MetadataRoute } from 'next'

const siteUrl = process.env.BETTER_AUTH_URL || 'https://ai.franckniat.me'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/chat/'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    }
}
