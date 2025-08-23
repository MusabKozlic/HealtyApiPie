import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { createServerClient } from "@/lib/supabase/server"

export async function getServerUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user")?.value
  if (!token) return null

  try {
    const userJwt = jwt.verify(token, process.env.AUTH0_SECRET!) as any
    const auth0Id = userJwt.sub

    const supabase = createServerClient()
    const { data: dbUser } = await supabase
      .from("auth_users")
      .select("id")
      .eq("auth0_id", auth0Id)
      .single()

    return dbUser?.id || null
  } catch {
    return null
  }
}