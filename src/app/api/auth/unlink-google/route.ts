import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use $unset to ensure field removal
    await User.updateOne({ _id: user._id }, { $unset: { googleId: 1 } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking Google:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}