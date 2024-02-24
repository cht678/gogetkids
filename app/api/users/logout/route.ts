import { NextResponse } from "next/server";
import Session from "@/app/models/sessionModel";  // Import Session model

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear token cookie
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    // Delete session document from 'sessions' collection
    await Session.deleteOne({ sessionName: 'currentSession' });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
