import { NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"
import { createClient } from "@supabase/supabase-js"
import { ensureUserInDatabase } from "@/lib/auth"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await ensureUserInDatabase(session.user)
    if (!user) {
      return NextResponse.json({ error: "Failed to get user record" }, { status: 500 })
    }

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id) // Use actual user ID instead of demo-user
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
