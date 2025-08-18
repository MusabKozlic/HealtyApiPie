"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Heart, ChefHat, User, Calendar } from "lucide-react"

interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  calories: number
  budget: number
  nutrition: {
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  category: string
  created_at: string
}

export function UserDashboard() {
  const { user, isLoading } = useUser()
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [myRecipesRes, savedRecipesRes] = await Promise.all([
        fetch("/api/user/my-recipes"),
        fetch("/api/user/saved-recipes"),
      ])

      if (myRecipesRes.ok) {
        const myRecipesData = await myRecipesRes.json()
        setMyRecipes(myRecipesData)
      }

      if (savedRecipesRes.ok) {
        const savedRecipesData = await savedRecipesRes.json()
        setSavedRecipes(savedRecipesData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
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
        setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== recipeId))
      }
    } catch (error) {
      console.error("Error unsaving recipe:", error)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* User Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            {user?.picture ? (
              <img
                src={user.picture || "/placeholder.svg"}
                alt={user.name || "User"}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <User className="w-8 h-8 text-green-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || "Chef"}!</h1>
            <p className="text-gray-600">Manage your recipe collection and discover new healthy meals</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRecipes.length}</div>
            <p className="text-xs text-muted-foreground">Your AI-generated recipes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Recipes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedRecipes.length}</div>
            <p className="text-xs text-muted-foreground">Your favorite recipes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRecipes.length + savedRecipes.length}</div>
            <p className="text-xs text-muted-foreground">In your collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Recipe Tabs */}
      <Tabs defaultValue="my-recipes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-recipes">My Generated Recipes ({myRecipes.length})</TabsTrigger>
          <TabsTrigger value="saved-recipes">Saved Recipes ({savedRecipes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-recipes" className="space-y-4">
          {myRecipes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes generated yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Start creating delicious, healthy recipes with AI assistance
                </p>
                <Button asChild>
                  <a href="/generate">Generate Your First Recipe</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} showUnsave={false} onUnsave={() => {}} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved-recipes" className="space-y-4">
          {savedRecipes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved recipes yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Browse recipes and save your favorites to see them here
                </p>
                <Button asChild>
                  <a href="/recipes">Browse Recipes</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  showUnsave={true}
                  onUnsave={() => unsaveRecipe(recipe.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RecipeCard({
  recipe,
  showUnsave,
  onUnsave,
}: {
  recipe: Recipe
  showUnsave: boolean
  onUnsave: () => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{recipe.description}</CardDescription>
          </div>
          {showUnsave && (
            <Button variant="ghost" size="sm" onClick={onUnsave} className="text-red-600 hover:text-red-700">
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{recipe.calories} cal</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>${recipe.budget}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{recipe.category}</Badge>
          <Badge variant="outline">{recipe.nutrition.protein} protein</Badge>
        </div>
        <div className="text-xs text-gray-500">Created {new Date(recipe.created_at).toLocaleDateString()}</div>
      </CardContent>
    </Card>
  )
}
