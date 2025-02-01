// app/(root)/layout.tsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="pt-32 font-mono sm:pt-24">{children}</main>
    </div>
  );
};

export default Layout;
