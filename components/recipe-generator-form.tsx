"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Users, Clock } from "lucide-react"
import { RecipeResult } from "@/components/recipe-result"
import type { Recipe } from "@/lib/supabase/client"
import { DIETARY_OPTIONS } from "@/lib/types/categories"
import { CUISINE_OPTIONS } from "@/lib/types/categories"
import { DbUser } from "@/lib/types/DBUser"


export function RecipeGeneratorForm() {
  const [ingredients, setIngredients] = useState("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [servings, setServings] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState("")
  const recipeRef = useRef<HTMLDivElement>(null) // Ref for scrolling to the recipe
  const [user, setUser] = useState<DbUser | null>(null)


  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
  }, [])

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]))
  }

  const hasValidInput = () => {
    return ingredients.trim() || selectedDietary.length > 0 || selectedCuisine || servings.trim() || cookingTime.trim()
  }

  const handleGenerate = async () => {
    if (!hasValidInput()) {
      setError(
        "Please enter at least one parameter (ingredients, dietary preference, cuisine, servings, or cooking time)",
      )
      return
    }

    if (!user) {
      const currentPath = window.location.pathname
      window.location.href = `/api/login?redirectTo=${encodeURIComponent(currentPath)}`
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedRecipe(null)

    try {
      const category = selectedDietary.length > 0 ? selectedDietary.join(", ") : "general"
      const cuisine = selectedCuisine || "any"

      // Build ingredients string - if empty, use dietary/cuisine for random generation
      const ingredientsText = ingredients.trim() || `${category} ${cuisine} meal`

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredientsText,
          category: `${category}, ${cuisine} cuisine`,
          servings: servings ? Number.parseInt(servings) : undefined,
          cookingTime: cookingTime ? Number.parseInt(cookingTime) : undefined,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (response.status === 400) {
        throw new Error("Failed to generate recipe with unhealthy or invalid ingredients")
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe")
      }

      setGeneratedRecipe(data.recipe)

      // Scroll to the recipe result
      setTimeout(() => {
        recipeRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Generate Your Recipe</h1>
        <p className="text-lg text-gray-600">
          Tell us what you have and we'll create something delicious and budget-friendly
        </p>
      </div>

      {/* Input Form */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-green-600" />
            Recipe Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
              Available Ingredients
            </label>
            <Textarea
              id="ingredients"
              placeholder="e.g., chicken breast, broccoli, rice, garlic, olive oil... (Leave empty for random recipe)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-gray-500">
              List specific ingredients you have. Recipe will use ONLY these ingredients plus seasonings. Leave empty
              for random generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="servings" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Number of Servings
              </label>
              <Input
                id="servings"
                type="number"
                min="1"
                max="12"
                placeholder="e.g., 4"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cookingTime" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Cooking Time
              </label>
              <Input
                id="cookingTime"
                type="number"
                min="5"
                max="180"
                placeholder="e.g., 30 minutes"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  variant={selectedDietary.includes(option) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors ${selectedDietary.includes(option)
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hover:bg-green-50 hover:border-green-300"
                    }`}
                  onClick={() => toggleDietary(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1).replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cuisine Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors ${selectedCuisine === cuisine
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? "" : cuisine)}
                >
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1).replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !hasValidInput()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Recipe
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            At least one parameter is required to generate a recipe. Leave ingredients empty for random healthy meals.
          </p>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        </CardContent>
      </Card>

      {/* Recipe Result */}
      {generatedRecipe && (
        <div ref={recipeRef}>
          <RecipeResult recipe={generatedRecipe} />
        </div>
      )}
    </div>
  )
}
