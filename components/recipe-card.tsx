"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Flame, Users, Eye, Bookmark, DollarSign } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { RecipeModal } from "@/components/recipe-modal"
import Link from "next/link"
import type { Recipe } from "@/lib/supabase/client"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(recipe.isSaved || false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleBookmark = async () => {
    try {
      const res = await fetch(`/api/recipes/${recipe.id}/bookmark`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
        {/* Recipe Image Placeholder */}
        <div className="h-40 sm:h-48 relative overflow-hidden">
          {/* Recipe Image */}
          {recipe.imageurl ? (
            <Image
              src={recipe.imageurl}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200" />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Bookmark button 
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white p-2"
              onClick={handleBookmark}
            >
              {
                isBookmarked ? (
                  <Bookmark className="h-4 w-4 fill-current text-green-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )
              }
            </Button>
          </div>
          */}

          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            {recipe.category && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800 capitalize text-xs">
                {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1).replace("-", " ")}
              </Badge>
            )}
          </div>
        </div>


        <CardHeader className="pb-3 flex-shrink-0">
          <Link href={`/recipe/${recipe.id}`}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors cursor-pointer leading-tight">
              {recipe.title}
            </h3>
          </Link>
          {recipe.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-2">{recipe.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3 flex-wrap">
              {recipe.calories && recipe.calories !== null && (
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">{recipe.calories}</span>
                </div>
              )}
              {recipe.budget && recipe.budget !== null && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">${recipe.budget}</span>
                </div>
              )}
              { recipe.cookingTime && recipe.cookingTime !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">{recipe.cookingTime} min</span>
                </div>
              )}
              {recipe.servings && recipe.servings !== null && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">{recipe.servings} servings</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Preview */}
          <div className="space-y-2 flex-1">
            <h4 className="font-medium text-gray-900 text-sm">Key Ingredients:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient.split(",")[0].trim()}
                </Badge>
              ))}
              {recipe.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.ingredients.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <span className="text-xs text-gray-500 truncate pr-2">{formatDate(recipe.created_at)}</span>
            <Link href={`/recipe/${recipe.id}`}>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0">
                <Eye className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">View Recipe</span>
                <span className="sm:hidden">View</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Modal */}
      <RecipeModal recipe={recipe} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
