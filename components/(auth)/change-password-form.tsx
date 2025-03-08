"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/lib/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changePasswordAction } from "@/lib/actions/changePasswordAction";
import { z } from "zod";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export function ChangePasswordForm() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/login");
  }

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  //   // Update form values once session data is available
  //   useEffect(() => {
  //     if (session?.user?.email) {
  //       form.reset({ email: session.user.email });
  //     }
  //   }, [session?.user?.email, form.reset]);

  const handleSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    try {
      const res = await changePasswordAction({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (res.success) {
        toast({ title: res.message });
        setTimeout(() => {
          window.location.reload();
        }, 1000 * 3);
      } else {
        toast({
          title: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Enter new password and confirm it to change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Changing..."
                  : "Change password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
