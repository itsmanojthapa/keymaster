import sendOTP from "@/lib/actions/sendOTPAction";
import prisma from "@/server/prismaClient";
import genOTP from "@/utils/genOTP";
import { NextResponse } from "next/server";

type OtpRequest = {
  id: string;
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { id }: OtpRequest = await req.json();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    const otp = genOTP();
    const res = await sendOTP(user.id, user.email, user.name, otp.toString());

    if (res.success) {
      return NextResponse.json(
        { success: true, message: res.message },
        { status: 201 },
      );
    }
    return NextResponse.json(
      { success: false, message: res.message },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error generating OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate OTP",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
