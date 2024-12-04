import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-zinc-950 text-white">{children}</div>;
};

export default Layout;
