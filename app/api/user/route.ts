import prisma from "@/server/prismaClient";
import { NextResponse } from "next/server";

type VerifyRequest = {
  email: string;
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email }: VerifyRequest = await req.json();

    const res = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (res) {
      return NextResponse.json({ success: true, user: res }, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
