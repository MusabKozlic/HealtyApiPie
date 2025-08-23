import { createServerClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  // Get all recipes for sitemap
  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, updated_at")
    .order("created_at", { ascending: false })

  const baseUrl = "https://www.nutriaigenius.com/"

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]

  const recipePages =
    recipes?.map((recipe) => ({
      url: `${baseUrl}/recipe/${recipe.id}`,
      lastModified: new Date(recipe.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })) || []

  return [...staticPages, ...recipePages]
}
