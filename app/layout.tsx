import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "KeyMaster",
  description:
    "Enhance speed, accuracy, and rhythm with engaging challenges and personalized progress tracking—all in a sleek, intuitive platform.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en ">
      <body className={`dark bg-zinc-950 antialiased`}>
        <SessionProvider>{children} </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
