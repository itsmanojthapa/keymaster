"use server";

import { signIn } from "@/auth/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  email: string,
  password: string,
  redirectTo: string,
) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: redirectTo ? redirectTo : "/",
      redirect: false,
    });

    if (res) return { url: res };
    return { err: "Someting went wrong." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { err: error.cause };
    }
  }
}
