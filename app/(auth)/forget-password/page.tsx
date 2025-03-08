import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";

import ForgetPasswordForm from "@/components/(auth)/forget-password-form";

const Page = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/logout");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgetPasswordForm />
      </div>
    </div>
  );
};

export default Page;
