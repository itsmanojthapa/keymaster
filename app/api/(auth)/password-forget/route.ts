import { passwordSchema } from "@/lib/zod";
import prisma from "@/prisma/prisma";
import { encryptPassword } from "@/utils/password";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, repass, otp } = await req.json();

    if (password !== repass) {
      return NextResponse.json(
        { message: "Passwords do not match", success: false },
        { status: 400 },
      );
    }

    await passwordSchema.parseAsync(password);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // Verify OTP
    const storedOtp = await prisma.oTP.findUnique({
      where: { userId: user.id },
    });

    if (!storedOtp || storedOtp.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP", success: false },
        { status: 400 },
      );
    }

    if (new Date() > storedOtp.expiresAt) {
      return NextResponse.json(
        { message: "OTP has expired", success: false },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await encryptPassword(password);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the OTP after successful verification
    await prisma.oTP.delete({ where: { userId: user.id } });

    return NextResponse.json(
      { message: "Password changed successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
