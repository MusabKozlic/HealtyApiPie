"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Flame, Share2, Bookmark, DollarSign } from "lucide-react"
import type { Recipe } from "@/lib/supabase/client"
import Image from "next/image"

interface RecipeResultProps {
  recipe: Recipe
}

export function RecipeResult({ recipe }: RecipeResultProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description || "",
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2 leading-tight">
              {recipe.title}
            </CardTitle>
            {recipe.description && (
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{recipe.description}</p>
            )}
            {recipe.imageurl && (
              <div className="mt-4 w-full max-w-2xl mx-auto relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={recipe.imageurl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:ml-4 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none bg-transparent">
              <Share2 className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Share</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
              <Bookmark className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>

        {/* Recipe Meta Info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
          {recipe.calories && recipe.calories != null && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{recipe.calories} calories</span>
            </div>
          )}
          {recipe.budget && recipe.budget !== null && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="whitespace-nowrap">${recipe.budget} per serving</span>
            </div>
          )}
          {recipe.cookingTime && recipe.cookingTime !== null && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="whitespace-nowrap">${recipe.cookingTime} min</span>
            </div>
          )}
          {recipe.servings && recipe.servings !== null && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{recipe.servings} servings</span>
            </div>
          )}
          {recipe.category && (
            <Badge variant="secondary" className="capitalize">
              {recipe.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 sm:space-y-8">
        {/* Ingredients */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Ingredients</h3>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800 text-sm sm:text-base leading-relaxed">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-green-600">{index + 1}.</span>
                <span className="text-gray-700">{step.replace(/^Step \d+:\s*/, "")}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Nutrition Info */}
        {recipe.nutrition && (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Nutrition Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(recipe.nutrition).map(([key, value]) => (
                <Card key={key} className="p-3 sm:p-4 text-center bg-gray-50 border-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">{value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 capitalize mt-1">{key}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
