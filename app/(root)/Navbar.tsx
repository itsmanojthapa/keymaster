"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Flag, Swords, User } from "lucide-react";
import { usePathname } from "next/navigation";

const pages = [
  { path: "/type", name: "Start", icon: <Flag /> },
  { path: "/multiplayer", name: "Multiplayer", icon: <Swords /> },
  { path: "/leaderboard", name: "Leaderboard", icon: <Crown /> },
  { path: "/profile", name: "Profile", icon: <User /> },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col justify-around space-y-5 pt-5 font-bold sm:flex-row sm:space-y-0">
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
      </div>
    </nav>
  );
};

export default Navbar;
