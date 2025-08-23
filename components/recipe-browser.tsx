"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ChevronRight } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import type { Recipe } from "@/lib/supabase/client"
import { DIETARY_OPTIONS, CUISINE_OPTIONS } from "@/lib/types/categories"
import { DbUser } from "@/lib/types/DBUser"

type RecipeBrowserProps = {
  initialRecipes: Recipe[]
}

export function RecipeBrowser({ initialRecipes }: RecipeBrowserProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDietaryCategory, setSelectedDietaryCategory] = useState("all")
  const [selectedCuisineCategory, setSelectedCuisineCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<DbUser | null>(null)


  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
  }, [])
  
  const recipesPerPage = 12;

  const fetchRecipes = async (page = 1, reset = false) => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        limit: recipesPerPage.toString(),
        offset: ((page - 1) * recipesPerPage).toString(),
      })

      if (selectedDietaryCategory !== "all") {
        params.append("dietary", selectedDietaryCategory)
      }

      if (selectedCuisineCategory !== "all") {
        params.append("cuisine", selectedCuisineCategory)
      }

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim())
      }
      if (user) {
        params.append("userId", user.id)
      }

      const response = await fetch(`/api/recipes?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recipes")
      }

      if (reset) {
        setRecipes(data.recipes)
      } else {
        setRecipes((prev) => [...prev, ...data.recipes])
      }

      setHasMore(data.recipes.length === recipesPerPage)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRecipes(1, true)
  }, [selectedDietaryCategory, selectedCuisineCategory])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchRecipes(1, true)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleLoadMore = () => {
    fetchRecipes(currentPage + 1, false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchRecipes(1, true)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-5 w-5 text-green-600" />
            Search & Filter Recipes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recipes by title, ingredients, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 sm:h-10"
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 h-12 sm:h-10 sm:px-6">
              Search
            </Button>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dietary Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dietary Preferences</label>
              <Select value={selectedDietaryCategory} onValueChange={setSelectedDietaryCategory}>
                <SelectTrigger className="h-12 sm:h-10">
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dietary Preferences</SelectItem>
                  {DIETARY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cuisine Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cuisine</label>
              <Select value={selectedCuisineCategory} onValueChange={setSelectedCuisineCategory}>
                <SelectTrigger className="h-12 sm:h-10">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {CUISINE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Recipe Grid */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        !loading && (
          <Card className="text-center py-12 bg-white/50">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                <p className="text-sm sm:text-base">Try adjusting your search terms or filters to find more recipes.</p>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Load More Button */}
      {hasMore && recipes.length > 0 && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            className="bg-white hover:bg-gray-50 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                Loading...
              </>
            ) : (
              <>
                Load More Recipes
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Recipe Count */}
      {recipes.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )
}
