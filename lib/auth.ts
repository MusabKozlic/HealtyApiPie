import { getSession } from "@auth0/nextjs-auth0"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export async function ensureUserInDatabase(user: any) {
  if (!user) return null

  // Check if user exists in our database
  const { data: existingUser } = await supabase.from("users").select("*").eq("auth0_id", user.sub).single()

  if (!existingUser) {
    // Create user in our database
    const { data: newUser } = await supabase
      .from("users")
      .insert({
        auth0_id: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
      })
      .select()
      .single()

    return newUser
  }

  return existingUser
}

export async function checkDailyLimit(userId: string): Promise<{ canGenerate: boolean; count: number }> {
  const today = new Date().toISOString().split("T")[0]

  const { data: limit } = await supabase
    .from("user_generation_limits")
    .select("generation_count")
    .eq("user_id", userId)
    .eq("generation_date", today)
    .single()

  const currentCount = limit?.generation_count || 0
  return {
    canGenerate: currentCount < 5,
    count: currentCount,
  }
}

export async function incrementDailyCount(userId: string) {
  const today = new Date().toISOString().split("T")[0]

  const { data: existing } = await supabase
    .from("user_generation_limits")
    .select("*")
    .eq("user_id", userId)
    .eq("generation_date", today)
    .single()

  if (existing) {
    await supabase
      .from("user_generation_limits")
      .update({
        generation_count: existing.generation_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
  } else {
    await supabase.from("user_generation_limits").insert({
      user_id: userId,
      generation_date: today,
      generation_count: 1,
    })
  }
}
