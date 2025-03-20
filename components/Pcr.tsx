import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TypeUser } from "@/types/types";
import Timer from "./Timer";

type typee = {
  user: TypeUser;
  time: number;
};

const Pcr = ({ user, time }: typee) => {
  return (
    <div
      key={user.name}
      className="flex flex-row items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800/30"
    >
      <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 md:h-10 md:w-10">
        <AvatarImage
          className="h-full w-full object-cover"
          src={`${user.image}`}
        />
        <AvatarFallback>
          <AvatarImage
            className="h-full w-full object-cover"
            src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.name}`}
          />
        </AvatarFallback>
      </Avatar>
      {user?.status && (
        <div className="flex items-center gap-2">
          {user.status === "active" ? (
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          ) : (
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
          )}
        </div>
      )}
      <p className="text-nowrap font-medium text-blue-400">{user.name}</p>

      <div className="ml-5 flex flex-wrap items-center justify-center gap-4 text-center font-mono text-sm sm:gap-8 sm:text-lg">
        <div>
          Time:{" "}
          <span>
            <Timer time={time} />s
          </span>
        </div>
        <div>
          WPM:
          <span className="text-teal-400">{user.wpm ?? "0"}</span>
        </div>
        <div>
          Accuracy:
          <span
            className={user.accuracy === 100 ? "text-teal-400" : "text-red-400"}
          >
            {user.accuracy ?? "0"}%
          </span>
        </div>
        <div>
          Correct:
          <span className="text-teal-400">{user.correct ?? "0"}</span>
        </div>
        <div>
          Wrong:
          <span className={user.wrong === 0 ? "text-teal-400" : "text-red-400"}>
            {user.wrong ?? "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pcr;
