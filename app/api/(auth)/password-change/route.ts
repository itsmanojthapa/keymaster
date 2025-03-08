import { auth } from "@/auth/auth";
import { changePasswordSchema } from "@/lib/zod";
import prisma from "@/prisma/prisma";
import { encryptPassword } from "@/utils/password";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { sucess: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse request body
    const data = await req.json();

    // Validate input using Zod
    const { newPassword, confirmPassword } =
      await changePasswordSchema.parseAsync({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

    // Ensure newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Hash the new password
    const hashedPassword = await encryptPassword(newPassword);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to change password",
      },
      { status: 500 },
    );
  }
}
