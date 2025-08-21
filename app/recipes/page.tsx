import { RecipeBrowser } from "@/components/recipe-browser"
import { Navigation } from "@/components/navigation"
import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"
import { Recipe } from "@/lib/supabase/client"

export const metadata: Metadata = {
  title: "Browse Healthy Recipes - AI-Generated Nutritious Meals | Healthy Recipe Generator",
  description:
    "Discover a collection of healthy, AI-generated recipes. Search by ingredients, dietary preferences, and nutritional needs. Find vegan, keto, gluten-free, and more healthy meal options.",
  keywords:
    "healthy recipes, AI generated recipes, vegan recipes, keto recipes, gluten-free recipes, nutrition, meal planning, dietary recipes, cooking, healthy eating",
  openGraph: {
    title: "Browse Healthy Recipes - AI-Generated Nutritious Meals",
    description:
      "Discover a collection of healthy, AI-generated recipes. Search by ingredients and dietary preferences.",
    type: "website",
    url: "/recipes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Healthy Recipes - AI-Generated Nutritious Meals",
    description: "Discover healthy, AI-generated recipes for every dietary need.",
  },
  alternates: {
    canonical: "/recipes",
  },
}


async function getInitialRecipes(): Promise<Recipe[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 11) // 12 per page

  if (error) {
    console.error("SSR fetch error:", error)
    return []
  }

  return data || []
}

export default async function RecipesPage() {
  const initialRecipes = await getInitialRecipes();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Browse Healthy Recipes",
            description:
              "Discover a collection of healthy, AI-generated recipes. Search by ingredients, dietary preferences, and nutritional needs.",
            url: "/recipes",
            mainEntity: {
              "@type": "ItemList",
              name: "Healthy Recipe Collection",
              description: "AI-generated healthy recipes for various dietary preferences",
              numberOfItems: "100+",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Recipes",
                  item: "/recipes",
                },
              ],
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with SEO-optimized content */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Healthy Recipe Collection
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our growing collection of healthy, AI-generated recipes. Filter by dietary preferences and
                search for specific ingredients to find the perfect nutritious meal for your needs.
              </p>
            </div>

            <RecipeBrowser initialRecipes={initialRecipes} />
          </div>
        </main>
      </div>
    </>
  )
}
