"use server";

import prisma from "@/prisma/client";
import otpHTML from "@/utils/otpHTML";
import { Resend } from "resend";

export default async function sendOTP(
  id: string,
  email: string,
  name: string,
  otp: string,
) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await prisma.oTP.upsert({
      // Create new token if doesn't exist
      where: { userId: id },
      update: {
        otp: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
      },
      create: {
        userId: id,
        otp: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });
    const { data, error } = await resend.emails.send({
      from: "otp@manojthapa.software",
      to: [email],
      subject: "Verify your email",
      html: otpHTML({
        name: name,
        otp: otp,
      }),
    });
    console.log(error);

    if (data?.id)
      return {
        success: true,
        message: "OTP sent to your email",
      };
    else
      return {
        success: false,
        message: "Failed to send OTP",
      };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
}
