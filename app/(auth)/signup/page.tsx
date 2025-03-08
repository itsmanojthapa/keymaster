import { auth } from "@/auth/auth";
import SignUpForm from "@/components/(auth)/signup-form";
import { redirect } from "next/navigation";
import React from "react";
// import { SignUpForm } from "@/components/signup-form";

const Page = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/logout");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <SignUpForm /> */}
        <SignUpForm />
      </div>
    </div>
  );
};

export default Page;
