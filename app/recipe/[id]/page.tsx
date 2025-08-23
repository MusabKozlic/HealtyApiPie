import { createServerClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { RecipeResult } from "@/components/recipe-result"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { RecipeStructuredData } from "@/components/recipe-structured-data"

interface RecipePageProps {
  params: Promise<{ id: string }>
}

async function getRecipe(id: string) {
  const supabase = createServerClient()
  const { data: recipe, error } = await supabase.from("recipes").select("*").eq("id", id).single()

  if (error || !recipe) {
    return null
  }

  return recipe
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id)

  if (!recipe) {
    return {
      title: "Recipe Not Found",
      description: "The requested recipe could not be found.",
    }
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.slice(0, 5).join(", ") : ""
  const calories = recipe.calories ? `${recipe.calories} calories` : ""
  const category = recipe.category ? recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1) : ""

  return {
    title: `${recipe.title} - Healthy Recipe Generator`,
    description: `${recipe.description || ""} ${calories ? `${calories}.` : ""} Ingredients: ${ingredients}. ${
      category ? `Category: ${category}.` : ""
    }`.trim(),
    keywords: [
      "healthy recipe",
      "AI generated recipe",
      "nutrition",
      "cooking",
      recipe.category || "",
      ...recipe.ingredients.slice(0, 10),
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title: recipe.title,
      description:
        recipe.description || `Healthy ${recipe.category || ""} recipe with detailed nutritional information`,
      type: "article",
      publishedTime: recipe.created_at,
      modifiedTime: recipe.updated_at,
      authors: ["Healthy Recipe Generator AI"],
      tags: [recipe.category, "healthy", "nutrition", "AI-generated"].filter(Boolean),
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.description || `Healthy ${recipe.category || ""} recipe`,
    },
    alternates: {
      canonical: `/recipe/${recipe.id}`,
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id)

  if (!recipe) {
    notFound()
  }

  return (
    <>
      <RecipeStructuredData recipe={recipe} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="/" className="hover:text-green-600">
                    Home
                  </a>
                </li>
                <li>/</li>
                <li>
                  <a href="/recipes" className="hover:text-green-600">
                    Recipes
                  </a>
                </li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{recipe.title}</li>
              </ol>
            </nav>

            <RecipeResult recipe={recipe} />

            {/* Recipe Schema.org structured data is included via RecipeStructuredData component */}
          </div>
        </main>
      </div>
    </>
  )
}
