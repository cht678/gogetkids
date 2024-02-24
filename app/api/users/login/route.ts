import { connect } from "@/app/lib/dbConfig2";
import User from "@/app/models/userModel";
import Session from "@/app/models/sessionModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found. Please check your email." }, { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password. Please double-check your password." }, { status: 400 });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      school_name: user.school_name,
      company_name: user.company_name,
      role: user.role
    };

    const token = await jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    // Store the session in the 'sessions' collection using the Session model
    const existingSession = await Session.findOne({ sessionName: 'currentSession' });

    if (existingSession) {
      // If 'currentSession' already exists, update the token
      await Session.updateOne(
        { sessionName: 'currentSession' },
        { $set: { token } }
      );
    } else {
      // If 'currentSession' does not exist, create a new document
      await Session.create({ sessionName: 'currentSession', token });
    }

    let redirectPath = '/dashboard'; // Default redirect path

    // Determine the redirect path based on the user's role
    switch (user.role) {
      case 'transport admin':
        redirectPath = '/transport-admin-dashboard';
        break;
      case 'system admin':
        redirectPath = '/system-admin-dashboard';
        break;
      // For 'school admin', use the default redirect path
      default:
        break;
    }

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    // Include the redirect path in the response
    response.headers.set("X-Redirect", redirectPath);

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}
