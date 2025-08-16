import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Recipe = {
  id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string
  calories: number | null
  nutrition: Record<string, any> | null
  category: string | null
  language: string
  created_at: string
  updated_at: string
}
