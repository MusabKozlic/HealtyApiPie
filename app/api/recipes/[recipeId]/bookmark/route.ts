import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import jwt from "jsonwebtoken"
import { supabase } from "@/app/api/auth/callback/route"

export async function POST(req: Request, { params }: { params: { recipeId: string } }) {
    try {
        const cookieHeader = req.headers.get("cookie")
        if (!cookieHeader) return NextResponse.json({ error: "No cookies found" }, { status: 401 })

        const match = cookieHeader.match(/user=([^;]+)/)
        if (!match) return NextResponse.json({ error: "User cookie not found" }, { status: 401 })


        const token = match[1]
        const userJwt = jwt.verify(token, process.env.AUTH0_SECRET!) as any
        const auth0Id = userJwt.sub


        const { data: dbUser, error: dbError } = await supabase
            .from("auth_users")
            .select("id")
            .eq("auth0_id", auth0Id)
            .single()

        if (dbError || !dbUser) {
            return NextResponse.json({ error: "User not found in DB" }, { status: 404 })
        }

        const userId = dbUser.id;

        const { recipeId } = await params;

        const { data: existing, error: fetchError } = await supabase
            .from("user_saved_recipes")
            .select("isSaved")
            .eq("user_id", userId)
            .eq("recipe_id", recipeId)
            .single()

        if (fetchError && fetchError.code !== "PGRST116") {
            return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        const newIsSaved = existing ? !existing.isSaved : true

        const { error: upsertError } = await supabase
            .from("user_saved_recipes")
            .upsert({
                user_id: userId,
                recipe_id: recipeId,
                isSaved: newIsSaved,
            })
            .eq("user_id", userId)
            .eq("recipe_id", recipeId)

        if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 })

        return NextResponse.json({ success: true, isSaved: newIsSaved })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
