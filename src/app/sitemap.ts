import type { MetadataRoute } from 'next'

const siteUrl = process.env.BETTER_AUTH_URL || 'https://ai.franckniat.site'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    return [
        {
            url: `${siteUrl}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/products`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/pricing`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/support`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/terms`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}
