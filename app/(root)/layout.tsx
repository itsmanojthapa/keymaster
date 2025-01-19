// app/(root)/layout.tsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-zinc-950 text-white">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
