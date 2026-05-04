import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    await connectToDatabase();

    // In Next 15+ we must await params
    const { username } = await params;

    // Use a case-insensitive search for username
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
