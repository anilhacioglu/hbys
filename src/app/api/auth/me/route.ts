import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check hatası:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

