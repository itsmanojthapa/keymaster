import Image from "next/image";
import Link from "next/link";
import { Crown, Flag, Swords, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-around pt-5 flex-col font-bold sm:flex-row space-y-5 sm:space-y-0">
      <Link
        href="/"
        className="text-zinc-50 font-black text-xl flex justify-center items-center space-x-3">
        <Image src={"/keyboard.png"} alt="" width={40} height={100} />
        <span>KeyMaster</span>
      </Link>
      <div className="flex mt-0 space-x-10 md:space-x-4 text-lg justify-center h-full">
        <Link
          href="/type"
          className="text-zinc-400 hover:text-teal-400 flex items-center space-x-2">
          <Flag />
          <span className="hidden md:block">Start</span>
        </Link>
        <Link
          href="/multiplayer"
          className="text-zinc-400 hover:text-teal-400 flex items-center space-x-2">
          <Swords />
          <span className="hidden md:block">Multiplayer</span>
        </Link>
        <Link
          href="/leaderboard"
          className="text-zinc-400 hover:text-teal-400 flex items-center space-x-2">
          <Crown />
          <span className="hidden md:block">Leaderboard</span>
        </Link>
        <Link
          href="/profile"
          className="text-zinc-400 hover:text-teal-400 flex items-center space-x-2">
          <User />
          <span className="hidden md:block">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
