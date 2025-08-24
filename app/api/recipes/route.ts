import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dietary = searchParams.get("dietary")
    const cuisine = searchParams.get("cuisine")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const userId = searchParams.get("userId")

    const supabase = createServerClient()

    let query = supabase
      .from("recipes")
      .select(`
        id,
        title,
        description,
        ingredients,
        instructions,
        calories,
        nutrition,
        category,
        budget,
        cookingTime,
        servings,
        language,
        created_at,
        updated_at,
        imageurl,
        user_saved_recipes!left(isSaved)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (dietary && dietary !== "all" && cuisine && cuisine !== "all") {
      query = query.or(`category.ilike.%${dietary}%,category.ilike.%${cuisine}%`)
    } else if (dietary && dietary !== "all") {
      query = query.ilike("category", `%${dietary}%`)
    } else if (cuisine && cuisine !== "all") {
      query = query.ilike("category", `%${cuisine}%`)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (userId) {
      query = query.eq("user_saved_recipes.user_id", userId)
    }

    const { data: recipes, error } = await query

    if (error) {
      console.error("Database error:", error)
      throw new Error("Failed to fetch recipes")
    }

    const mappedRecipes = recipes?.map((r: any) => ({
      ...r,
      isSaved: r.user_saved_recipes?.[0]?.isSaved ?? false,
    }))


    return NextResponse.json({
      success: true,
      recipes: mappedRecipes || [],
    })
  } catch (error) {
    console.error("Fetch recipes error:", error)
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}
