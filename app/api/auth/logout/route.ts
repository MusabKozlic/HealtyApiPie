import { NextResponse } from "next/server"

export async function GET() {
  const res = NextResponse.redirect("/")
  res.cookies.delete("user")
  return res
}