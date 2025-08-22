import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const userId = params.id

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ recipes: data })
}
