import { NextResponse } from "next/server";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import prisma from "@/prisma/prisma";

type VerifyRequest = {
  token: string;
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse request body
    const { token }: VerifyRequest = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 },
      );
    }

    // Ensure JWT secret is available
    if (!process.env.AUTH_SECRET) {
      console.error("Missing AUTH_SECRET environment variable.");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }

    // Verify JWT token
    let decoded: JwtPayload & { userID: string; email: string };
    try {
      decoded = jwt.verify(token, process.env.AUTH_SECRET) as JwtPayload & {
        userID: string;
        email: string;
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return NextResponse.json({ error: "Token Expired" }, { status: 401 });
      }
      if (error instanceof JsonWebTokenError) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
      }
      console.error("JWT Verification Error:", error);
      return NextResponse.json({ error: "Token Error" }, { status: 400 });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: decoded.email.toLowerCase().trim() },
      select: {
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email: user.email.toLowerCase() },
      select: {
        token: true,
        expiresAt: true,
      },
    });

    // Check if the token matches
    if (verificationToken?.token !== token) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 },
      );
    }

    // Verify token expiration
    if (
      verificationToken.expiresAt &&
      new Date(verificationToken.expiresAt) < new Date()
    ) {
      return NextResponse.json({ error: "Token Expired" }, { status: 401 });
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { email: user.email },
      data: {
        emailVerified: new Date().toISOString(), // Use ISO date format
      },
    });

    await prisma.verificationToken.delete({
      where: { email: user.email },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Unexpected Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
