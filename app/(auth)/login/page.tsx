"use client";

import { LoginForm } from "@/components/(auth)/login-form";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";
// import { LoginForm } from "@/components/login-form";

const Page = () => {
  const session = useSession();
  if (session.status === "authenticated") {
    redirect("/");
  }
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <LoginForm redirectTo={callbackUrl} /> */}
        <LoginForm redirectTo={callbackUrl} />
      </div>
    </div>
  );
};

export default Page;
