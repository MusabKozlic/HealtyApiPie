import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createClient } from "@supabase/supabase-js"
import { mapAuth0ToDb } from "@/lib/utils"
import { Auth0User } from "@/lib/types/auth0User"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirectTo") || "/"
  const code = searchParams.get("code")
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const tokenUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`
  const userInfoUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const { access_token } = await tokenResponse.json()

  const userResponse = await fetch(userInfoUrl, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!userResponse.ok) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const auth0User: Auth0User = await userResponse.json()

  const dbPayload = mapAuth0ToDb(auth0User)

  const { data, error } = await supabase
    .from("auth_users")
    .upsert(dbPayload, { onConflict: "auth0_id" })
    .select()
    .single()

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const redirectUrl = new URL(redirectTo, baseUrl);

  const res = NextResponse.redirect(redirectUrl)
  res.cookies.set(
    "user",
    jwt.sign(auth0User, process.env.AUTH0_SECRET!),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  )

  return res
}