import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.nutriaigenius.com/"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "profile"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
