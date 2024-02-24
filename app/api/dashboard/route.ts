// route.ts
import { getEmailFromToken } from "@/app/helpers/getEmailFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connect } from "@/app/lib/dbConfig2";

connect();

export async function GET(request: NextRequest) {
  try {
    const userEmail = await getEmailFromToken(request);
    const user = await User.findOne({ email: userEmail }).select("-password");

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
