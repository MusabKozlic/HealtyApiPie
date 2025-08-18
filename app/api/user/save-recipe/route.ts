import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const userId = "demo-user"

    const { recipeId } = await request.json()

    const { error } = await supabase.from("user_saved_recipes").insert({
      user_id: userId,
      recipe_id: recipeId,
    })

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ error: "Recipe already saved" }, { status: 409 })
      }
      console.error("Error saving recipe:", error)
      return NextResponse.json({ error: "Failed to save recipe" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in save-recipe API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = "demo-user"

    const { recipeId } = await request.json()

    const { error } = await supabase.from("user_saved_recipes").delete().eq("user_id", userId).eq("recipe_id", recipeId)

    if (error) {
      console.error("Error unsaving recipe:", error)
      return NextResponse.json({ error: "Failed to unsave recipe" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in unsave-recipe API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
