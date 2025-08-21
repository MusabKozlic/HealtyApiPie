// app/api/me/route.ts
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // needs insert/select perms
)

export async function GET() {
  const token = (await cookies()).get("user")?.value
  if (!token) return NextResponse.json({ user: null })

  try {
    // 1. Decode Auth0 token from cookie
    const decoded = jwt.verify(token, process.env.AUTH0_SECRET!) as { sub: string }

    // 2. Fetch corresponding user from DB by auth0_id
    const { data: user, error } = await supabase
      .from("auth_users")
      .select("*")
      .eq("auth0_id", decoded.sub) // sub = Auth0 user ID
      .single()

    if (error) {
      console.error("Supabase fetch error:", error)
      return NextResponse.json({ user: null })
    }

    // 3. Return DB user (with roles, metadata, etc.)
    return NextResponse.json({ user })
  } catch (err) {
    console.error("JWT verify error:", err)
    return NextResponse.json({ user: null })
  }
}
