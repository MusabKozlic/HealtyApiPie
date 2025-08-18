import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const userId = "demo-user"

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user recipes:", error)
      return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
    }

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error in my-recipes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
