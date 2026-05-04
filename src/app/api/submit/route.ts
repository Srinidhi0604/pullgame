import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { problemId, points } = await request.json();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Keep track of solved problem IDs
    if (!user.solvedProblems) {
      user.solvedProblems = [];
    }

    if (user.solvedProblems.includes(problemId)) {
      return NextResponse.json({
        success: true,
        message: "Already solved",
        user,
      });
    }

    user.solvedProblems.push(problemId);
    user.problemsSolved += 1;
    user.score += points || 10;
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
