import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";

type typee = {
  user: { id: string; status?: "active" | "inactive" };
  value?: number;
};

const Pck = ({ user, value }: typee) => {
  return (
    <div
      key={user.id}
      className="flex flex-row items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800/30"
    >
      <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 md:h-10 md:w-10">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
          photo
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
      <p className="text-nowrap font-medium text-blue-400">{user.id}</p>
      {value && <Progress value={value} className="w-full bg-zinc-800" />}
    </div>
  );
};

export default Pck;
