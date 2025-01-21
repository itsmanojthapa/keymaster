import Image from "next/image";
import Link from "next/link";
import { Crown, Flag, Swords, User } from "lucide-react";

const Navbar = () => {
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
        <Link
          href="/type"
          className="flex items-center space-x-2 text-zinc-400 hover:text-teal-400"
        >
          <Flag />
          <span className="hidden md:block">Start</span>
        </Link>
        <Link
          href="/multiplayer"
          className="flex items-center space-x-2 text-zinc-400 hover:text-teal-400"
        >
          <Swords />
          <span className="hidden md:block">Multiplayer</span>
        </Link>
        <Link
          href="/leaderboard"
          className="flex items-center space-x-2 text-zinc-400 hover:text-teal-400"
        >
          <Crown />
          <span className="hidden md:block">Leaderboard</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center space-x-2 text-zinc-400 hover:text-teal-400"
        >
          <User />
          <span className="hidden md:block">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
