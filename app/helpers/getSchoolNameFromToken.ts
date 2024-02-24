// @/app/helpers/getSchoolNameFromToken.ts:
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getSchoolNameFromToken = (request: NextRequest) => {
  try {
      const token = request.cookies.get("token")?.value || '';
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
      return decodedToken.school_name; // Adjusted to 'school_name'
  } catch (error: any) {
      throw new Error(error.message);
  }
}
