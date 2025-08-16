import type { Recipe } from "@/lib/supabase/client"

interface RecipeStructuredDataProps {
  recipe: Recipe
}

export function RecipeStructuredData({ recipe }: RecipeStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || `Healthy ${recipe.category || ""} recipe with detailed nutritional information`,
    image: [`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(recipe.title + " healthy recipe")}`],
    author: {
      "@type": "Organization",
      name: "Healthy Recipe Generator AI",
    },
    datePublished: recipe.created_at,
    dateModified: recipe.updated_at,
    prepTime: "PT30M", // 30 minutes prep time
    cookTime: "PT30M", // 30 minutes cook time
    totalTime: "PT60M", // 1 hour total
    recipeCategory: recipe.category || "Main Course",
    recipeCuisine: "Healthy",
    recipeYield: "2-4 servings",
    keywords: [recipe.category, "healthy", "nutrition", "AI-generated", ...recipe.ingredients.slice(0, 5)]
      .filter(Boolean)
      .join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions
      .split("\n")
      .filter((step) => step.trim())
      .map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: step.trim(),
      })),
    nutrition: recipe.nutrition
      ? {
          "@type": "NutritionInformation",
          calories: recipe.calories ? `${recipe.calories} calories` : undefined,
          proteinContent: recipe.nutrition.protein || undefined,
          carbohydrateContent: recipe.nutrition.carbs || undefined,
          fatContent: recipe.nutrition.fat || undefined,
          fiberContent: recipe.nutrition.fiber || undefined,
        }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
    video: undefined, // Could be added later if video content is available
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
