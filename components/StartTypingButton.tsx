import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const StartTypingButton = () => {
  return (
    <Button
      className={cn(
        "group relative flex items-center gap-3 bg-zinc-800 px-8 py-4",
        "rounded-xl font-medium text-zinc-100 transition-all duration-300",
        "hover:scale-105 hover:bg-zinc-700 hover:shadow-xl",
        "hover:shadow-zinc-900/20 active:scale-100",
        "before:absolute before:inset-0 before:rounded-xl",
        "before:animate-pulse before:bg-zinc-600/20",
        "absolute left-1/2 top-0 z-10 -translate-x-1/2 text-teal-400",
      )}
    >
      <Image
        className={cn(
          "h-5 w-6 transition-transform duration-300",
          "group-hover:rotate-[-5deg] group-hover:scale-110",
        )}
        src={"/keyboard.png"}
        alt=""
        width={40}
        height={100}
      />
      Start Typing
    </Button>
  );
};

export default StartTypingButton;
