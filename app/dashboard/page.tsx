"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string
  calories: number
  nutrition: any
  budget: number
  category: string
  created_at: string
}

function DashboardPage() {
  const [user, setUser] = useState({ name: "Demo User", email: "demo@example.com" })
  const [isLoading, setIsLoading] = useState(false)
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchMyRecipes()
      fetchSavedRecipes()
    }
  }, [user])

  const fetchMyRecipes = async () => {
    try {
      const response = await fetch("/api/user/my-recipes")
      if (response.ok) {
        const data = await response.json()
        setMyRecipes(data)
      }
    } catch (error) {
      console.error("Error fetching my recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch("/api/user/saved-recipes")
      if (response.ok) {
        const data = await response.json()
        setSavedRecipes(data)
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error)
    }
  }

  const unsaveRecipe = async (recipeId: string) => {
    try {
      const response = await fetch("/api/user/save-recipe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      })
      if (response.ok) {
        setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
      }
    } catch (error) {
      console.error("Error unsaving recipe:", error)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your generated and saved recipes</p>
        </div>

        <Tabs defaultValue="generated" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="generated">My Generated Recipes ({myRecipes.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved Recipes ({savedRecipes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="space-y-6">
            {myRecipes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't generated any recipes yet.</p>
                  <Button asChild>
                    <a href="/generate">Generate Your First Recipe</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRecipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{recipe.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{recipe.category}</Badge>
                        <Badge variant="outline">{recipe.calories} cal</Badge>
                        <Badge variant="outline">${recipe.budget?.toFixed(2)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{recipe.description}</p>
                      <p className="text-xs text-gray-500">
                        Generated on {new Date(recipe.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedRecipes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't saved any recipes yet.</p>
                  <Button asChild>
                    <a href="/recipes">Browse Recipes</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{recipe.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{recipe.category}</Badge>
                        <Badge variant="outline">{recipe.calories} cal</Badge>
                        <Badge variant="outline">${recipe.budget?.toFixed(2)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{recipe.description}</p>
                      <Button variant="outline" size="sm" onClick={() => unsaveRecipe(recipe.id)} className="w-full">
                        Remove from Saved
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardPage
