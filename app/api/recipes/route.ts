import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const language = searchParams.get("language") || "en"
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = createServerClient()
    let query = supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if specified
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // Add search filter if specified
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: recipes, error } = await query

    if (error) {
      console.error("Database error:", error)
      throw new Error("Failed to fetch recipes")
    }

    return NextResponse.json({
      success: true,
      recipes: recipes || [],
    })
  } catch (error) {
    console.error("Fetch recipes error:", error)
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}
