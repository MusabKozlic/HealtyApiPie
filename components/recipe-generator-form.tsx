"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"
import { RecipeResult } from "@/components/recipe-result"
import type { Recipe } from "@/lib/supabase/client"

const DIETARY_OPTIONS = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
  "low-carb",
  "high-protein",
  "mediterranean",
  "pescatarian",
]

const CUISINE_OPTIONS = [
  "italian",
  "mexican",
  "asian",
  "mediterranean",
  "indian",
  "thai",
  "american",
  "french",
  "japanese",
  "middle-eastern",
]

export function RecipeGeneratorForm() {
  const [ingredients, setIngredients] = useState("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState("")

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]))
  }

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedRecipe(null)

    try {
      const category = selectedDietary.length > 0 ? selectedDietary.join(", ") : "general"
      const cuisine = selectedCuisine || "any"

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          category: `${category}, ${cuisine} cuisine`,
          language: "en", // Hardcoded to English
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe")
      }

      setGeneratedRecipe(data.recipe)
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
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">Generate Your Recipe</h1>
        <p className="text-lg text-gray-600">
          Tell us what you have and we'll create something delicious and budget-friendly
        </p>
      </div>

      {/* Input Form */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-serif">
            <Sparkles className="h-6 w-6 text-green-600" />
            Recipe Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
              Available Ingredients *
            </label>
            <Textarea
              id="ingredients"
              placeholder="e.g., chicken breast, broccoli, rice, garlic, olive oil..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-gray-500">List the ingredients you have available, separated by commas</p>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Dietary Preferences</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleDietary(option)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedDietary.includes(option)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cuisine Type (Optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? "" : cuisine)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedCuisine === cuisine
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !ingredients.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium"
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

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        </CardContent>
      </Card>

      {/* Recipe Result */}
      {generatedRecipe && <RecipeResult recipe={generatedRecipe} />}
    </div>
  )
}
