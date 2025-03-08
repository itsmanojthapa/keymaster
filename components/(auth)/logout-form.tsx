"use client";

import React from "react";
import { Button } from "../ui/button";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const LogoutForm = () => {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    redirect("/login");
  };
  return (
    <>
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default LogoutForm;
