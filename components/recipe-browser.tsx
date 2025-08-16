"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ChevronRight } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { useI18n } from "@/lib/i18n/context"
import type { Recipe } from "@/lib/supabase/client"

const categories = [
  "all",
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

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
  { value: "ar", label: "العربية" },
  { value: "bs", label: "Bosanski" },
]

export function RecipeBrowser() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState("")

  const { t } = useI18n()
  const recipesPerPage = 12

  const fetchRecipes = async (page = 1, reset = false) => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        language: selectedLanguage,
        limit: recipesPerPage.toString(),
        offset: ((page - 1) * recipesPerPage).toString(),
      })

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim())
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
  }, [selectedCategory, selectedLanguage])

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
            {t("recipes.searchTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("recipes.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 sm:h-10"
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 h-12 sm:h-10 sm:px-6">
              {t("recipes.searchButton")}
            </Button>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("recipes.categoryLabel")}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 sm:h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("recipes.languageLabel")}</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-12 sm:h-10">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
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
                <h3 className="text-lg font-semibold mb-2">{t("recipes.noRecipes")}</h3>
                <p className="text-sm sm:text-base">{t("recipes.noRecipesDesc")}</p>
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
                {t("recipes.loading")}
              </>
            ) : (
              <>
                {t("recipes.loadMore")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Recipe Count */}
      {recipes.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          {t("recipes.showingCount", { count: recipes.length, plural: recipes.length !== 1 ? "s" : "" })}
        </div>
      )}
    </div>
  )
}
