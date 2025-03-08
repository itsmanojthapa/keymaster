"use client";

import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { motionSet } from "@/lib/motionSet";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div className="flex justify-center" {...motionSet}>
      <div className="mt-10 flex w-full max-w-5xl overflow-hidden rounded-lg px-10 shadow-lg">
        {/* Sidebar */}
        <aside className="">
          <h2 className="mb-6 text-xl font-bold">Dashboard</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/profile"
                  className={`hover:underline ${
                    pathname === "/profile" ? "font-bold text-teal-300" : ""
                  }`}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/change-password"
                  className={`hover:underline ${
                    pathname === "/change-password"
                      ? "font-bold text-teal-300"
                      : ""
                  }`}
                >
                  Change Password
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-auto px-8">{children}</main>
      </div>
    </motion.div>
  );
}
