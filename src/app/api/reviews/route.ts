import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, text } = body;

    if (!rating || !text || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating or text" }, { status: 400 });
    }

    // In production, this would insert into Supabase
    const review = {
      id: `r-${Date.now()}`,
      userId: "anonymous",
      username: "anonymous",
      avatarUrl: "",
      rating,
      text,
      isApproved: false, // Admin must approve
      createdAt: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
