import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-around items-center font-bold font-mono p-5">
      <Link
        href="/"
        className="text-zinc-50 font-black text-xl flex justify-center items-center space-x-3">
        <Image src={"/keyboard.png"} alt="" width={40} height={100} />
        <span>KeyMaster</span>
      </Link>
      <div className="flex space-x-5 text-lg">
        <Link href="/type" className="text-zinc-400 hover:text-teal-400">
          Start
        </Link>
        <Link href="/multiplayer" className="text-zinc-400 hover:text-teal-400">
          Multiplayer
        </Link>
        <Link href="/leaderboard" className="text-zinc-400 hover:text-teal-400">
          Leaderboard
        </Link>
        <Link href="/profile" className="text-zinc-400 hover:text-teal-400">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
