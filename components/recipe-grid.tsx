"use client"

import { Recipe } from "@/lib/supabase/client"
import { RecipeCard } from "@/components/recipe-card"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface RecipeGridProps {
  recipes: Recipe[]
}

export function RecipeGrid({ recipes: initialRecipes }: RecipeGridProps) {
  const [recipes, setRecipes] = useState(initialRecipes)
  const router = useRouter()

  const handleBookmark = async (recipeId: string) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/bookmark`, {
        method: "POST"
      })
      const data = await res.json()
      
      if (data.success) {
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
        router.refresh() // Trigger a refresh of the server component
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onBookmark={handleBookmark}
          dissableBookmark={true}
        />
      ))}
    </div>
  )
}