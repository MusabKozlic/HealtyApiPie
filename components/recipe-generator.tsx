"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Clock, Users, Flame } from "lucide-react"
import { RecipeResult } from "@/components/recipe-result"
import type { Recipe } from "@/lib/supabase/client"

const categories = [
  "general",
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  "low-carb",
  "high-protein",
  "baby-food",
  "diabetic",
]

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("")
  const [category, setCategory] = useState("general")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedRecipe(null)

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          category,
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
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Healthy Recipe Generator</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your ingredients into nutritious, delicious meals with AI-powered recipe generation
        </p>
      </div>

      {/* Input Form */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-serif">
            <Sparkles className="h-6 w-6 text-green-600" />
            Create Your Healthy Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
              What ingredients do you have? *
            </label>
            <Textarea
              id="ingredients"
              placeholder="e.g., chicken breast, broccoli, quinoa, olive oil, garlic, lemon..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-gray-500">
              List the ingredients you have available. Be as specific as possible for better results.
            </p>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Recipe Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "general" ? "General" : cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Language</label>
              <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-md">English</div>
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
                Generating Your Recipe...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Healthy Recipe
              </>
            )}
          </Button>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        </CardContent>
      </Card>

      {/* Recipe Result */}
      {generatedRecipe && <RecipeResult recipe={generatedRecipe} />}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center p-6 border-0 bg-white/50">
          <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Quick Generation</h3>
          <p className="text-sm text-gray-600">Get personalized recipes in seconds using AI</p>
        </Card>
        <Card className="text-center p-6 border-0 bg-white/50">
          <Flame className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Nutritional Info</h3>
          <p className="text-sm text-gray-600">Detailed calories and nutrition breakdown</p>
        </Card>
        <Card className="text-center p-6 border-0 bg-white/50">
          <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Dietary Options</h3>
          <p className="text-sm text-gray-600">Vegan, keto, gluten-free, and more</p>
        </Card>
      </div>
    </div>
  )
}
