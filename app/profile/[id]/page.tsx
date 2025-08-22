import { createServerClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const userId = params.id

  // Fetch user
  const { data: user } = await supabase
    .from("auth_users")
    .select("id, name, picture")
    .eq("id", userId)
    .single()

  // Fetch recipes
  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, title, description, created_at")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })

  return (
    <div>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
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
          {!recipes || recipes.length === 0 ? (
            <p className="text-gray-500">No recipes yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{recipe.description}</p>
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="text-green-600 text-sm mt-2 inline-block hover:underline"
                    >
                      View Recipe →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <p className="text-gray-500">This functionality is not yet implemented.</p>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}
