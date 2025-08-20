// app/api/me/route.ts
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET() {
  const token =  (await cookies()).get("user")?.value
  if (!token) return NextResponse.json({ user: null })

  try {
    const decoded = jwt.verify(token, process.env.AUTH0_SECRET!)
    console.log("Decoded user:", decoded)
    return NextResponse.json({ user: decoded })
  } catch {
    return NextResponse.json({ user: null })
  }
}
