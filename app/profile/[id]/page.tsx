import { createServerClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Recipe } from "@/lib/supabase/client"
import { Footer } from "@/components/footer"
import { RecipeGrid } from "@/components/recipe-grid"

async function fetchSavedRecipes(userId: string): Promise<Recipe[]> {
  const supabase = createServerClient()
  const { data: savedRecipes, error } = await supabase
    .from("user_saved_recipes")
    .select("recipe_id")
    .eq("user_id", userId)
    .eq("isSaved", true)
  if (error) {
    console.error("Error fetching saved recipes:", error)
    return []
  } 

  const savedIds = savedRecipes?.map((s) => s.recipe_id) || []

  const { data: recipes, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .in("id", savedIds)
  if (recipeError) {
    console.error("Error fetching recipes:", recipeError)
    return []
  }
  return recipes.map((recipe) => ({
    ...recipe,
    isSaved: savedIds.includes(recipe.id),
  }))

}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { id: userId } = await params;

  const { data: user } = await supabase
    .from("auth_users")
    .select("id, name, picture")
    .eq("id", userId)
    .single()

  const { data: saved } = await supabase
    .from("user_saved_recipes")
    .select("recipe_id")
    .eq("user_id", userId)
    .eq("isSaved", true);

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })

  const savedIds = saved?.map((s) => s.recipe_id) || []

  const recipeData = recipes?.map((recipe) => ({
    ...recipe,
    isSaved: savedIds.includes(recipe.id),
  }))

  const savedRecipes = await fetchSavedRecipes(userId);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <img
            src={user?.picture || "/diverse-user-avatars.png"}
            alt={user?.name || "User Avatar"}
            className="h-10 w-10 rounded-full"
          />
          {user?.name || "User"}
        </h1>

        <Tabs defaultValue="my-recipes">
          <TabsList>
            <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="my-recipes" className="mt-6">
            {!recipeData || recipeData.length === 0 ? (
              <p className="text-gray-500">No recipes yet.</p>
            ) : (
              <RecipeGrid recipes={recipeData} />
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {!savedRecipes || savedRecipes.length === 0 ? (
              <p className="text-gray-500">No saved recipes yet.</p>
            ) : (
              <RecipeGrid recipes={savedRecipes} tab={"saved"} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
