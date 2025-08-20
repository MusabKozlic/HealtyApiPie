import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const tokenUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`
  const userInfoUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`

  // Exchange authorization code for tokens
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

  console.log("Token response:", tokenResponse)
  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const { access_token } = await tokenResponse.json()

  // Fetch user info
  const userResponse = await fetch(userInfoUrl, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  console.log("User response:", userResponse)
  if (!userResponse.ok) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const user = await userResponse.json()

  // Save user info in a cookie (HTTP-only)
  const res = NextResponse.redirect(new URL("/", request.url))
  res.cookies.set("user", jwt.sign(user, process.env.AUTH0_SECRET!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return res
}