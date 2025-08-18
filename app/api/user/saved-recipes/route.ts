import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const userId = "demo-user"

    const { data: savedRecipes, error } = await supabase
      .from("user_saved_recipes")
      .select(`
        recipe_id,
        created_at,
        recipes (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching saved recipes:", error)
      return NextResponse.json({ error: "Failed to fetch saved recipes" }, { status: 500 })
    }

    const recipes = savedRecipes.map((item) => item.recipes)
    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error in saved-recipes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
