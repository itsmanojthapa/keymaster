import { redirect } from "next/navigation";
import LogoutForm from "@/components/(auth)/logout-form";
import { auth } from "@/auth/auth";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <LogoutForm />
      </div>
    </div>
  );
};

export default Page;
