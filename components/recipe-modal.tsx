"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Clock, Users, Flame, Share2, Bookmark, X } from "lucide-react"
import type { Recipe } from "@/lib/supabase/client"

interface RecipeModalProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

export function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto p-0">
        {/* Custom header for better mobile experience */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2 leading-tight">
                {recipe.title}
              </DialogTitle>
              {recipe.description && (
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">{recipe.description}</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleShare} className="hidden sm:flex bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="sm:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recipe Meta Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
            {recipe.calories && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="whitespace-nowrap">{recipe.calories} calories</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="whitespace-nowrap">30 min prep</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4 text-green-500" />
              <span className="whitespace-nowrap">2-4 servings</span>
            </div>
            {recipe.category && (
              <Badge variant="secondary" className="capitalize">
                {recipe.category}
              </Badge>
            )}
          </div>

          {/* Mobile action buttons */}
          <div className="flex gap-2 mt-4 sm:hidden">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Ingredients */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Ingredients</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                  <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Instructions</h3>
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base bg-gray-50 p-4 rounded-lg">
                {recipe.instructions}
              </div>
            </div>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
