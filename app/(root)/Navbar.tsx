"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Flag, Swords, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const pages = [
  { path: "/type", name: "Start", icon: <Flag /> },
  { path: "/multiplayer", name: "Multiplayer", icon: <Swords /> },
  { path: "/leaderboard", name: "Leaderboard", icon: <Crown /> },
  { path: "/profile", name: "Profile", icon: <User /> },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed z-50 flex w-full pb-3 pt-5 font-bold backdrop-blur-md">
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col justify-between space-y-5 px-10 sm:flex-row sm:space-y-0"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
      >
        <Link
          href="/"
          className="flex items-center justify-center space-x-3 text-xl font-black text-zinc-50"
        >
          <Image src={"/keyboard.png"} alt="" width={40} height={100} />
          <span>KeyMaster</span>
        </Link>
        <div className="mt-0 flex h-full justify-center space-x-10 text-lg md:space-x-4">
          {pages.map((page) => {
            return (
              <Link
                key={page.path}
                href={page.path}
                className={`flex items-center space-x-2 hover:text-teal-400 ${pathname === page.path ? "text-teal-400" : "text-zinc-400"}`}
              >
                {page.icon}
                <span className="hidden md:block">{page.name}</span>
              </Link>
            );
          })}
          {/* <div
            className={`flex items-center space-x-2 text-zinc-400 hover:text-teal-400`}
          >
            <LogOut />
          </div> */}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
