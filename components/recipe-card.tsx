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
import { useUser } from "@/context/UserContext"


interface RecipeCardProps {
  recipe: Recipe;
  onBookmark?: (recipeId: string) => Promise<void>;
  dissableBookmark?: boolean;
}

export function RecipeCard({ recipe, onBookmark, dissableBookmark }: RecipeCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(recipe.isSaved || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleBookmark = async () => {
    if (bookmarkLoading) return // prevent spam
    setBookmarkLoading(true)

    try {
      if (!dissableBookmark) {
        const res = await fetch(`/api/recipes/${recipe.id}/bookmark`, { method: "POST" })
        const data = await res.json()
        if (data.success) {
          setIsBookmarked(!isBookmarked);
        }
      }

      if (onBookmark) {
            await onBookmark(recipe.id);
          }


      setBookmarkLoading(false)
    } catch (err) {
      console.error(err)
      setBookmarkLoading(false)
    }
  }

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
        {/* Recipe Image Placeholder */}
        <div className="h-40 sm:h-48 relative overflow-hidden">
          {/* Klikabilna slika */}
          <Link href={`/recipe/${recipe.id}`} className="absolute inset-0 z-10 block">
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
          </Link>

          {/* Overlay ne blokira klik */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20" />

          {/* Bookmark dugme iznad overlaya */}
          <div className="absolute top-3 right-3 z-30">
            {user && <Button
              variant="ghost"
              size="sm"
              className={`bg-white/80 hover:bg-white p-2 transition-all duration-300 ${bookmarkLoading ? "cursor-not-allowed opacity-70 animate-pulse" : ""
                }`}
              onClick={handleBookmark}
              disabled={bookmarkLoading}
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 cursor-pointer fill-current text-green-500" />
              ) : (
                <Bookmark className="h-4 w-4 cursor-pointer" />
              )}
            </Button>}
          </div>


          {/* Kategorija iznad overlaya */}
          <div className="absolute bottom-3 left-3 z-30 cursor-default">
            {recipe.category && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800 capitalize text-xs">
                {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1).replace("-", " ")}
              </Badge>
            )}
          </div>
        </div>



        <CardHeader className="pb-3 flex-shrink-0">
          <Link href={`/recipe/${recipe.id}`} className="cursor-pointer">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors cursor-pointer leading-tight">
              {recipe.title}
            </h3>
          </Link>
          {recipe.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-2 cursor-default">{recipe.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-gray-600 cursor-default">
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
              {recipe.cookingTime && recipe.cookingTime !== null && (
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
          <div className="space-y-2 flex-1 cursor-default">
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
            <span className="text-xs text-gray-500 truncate pr-2 cursor-default">{formatDate(recipe.created_at)}</span>
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
