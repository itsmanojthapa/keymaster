import React from "react";
import { Card } from "./card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";

type typee = {
  users?: {
    id: string;
    status: "active" | "inactive";
  }[];
  connectedSockets: number;
};

const Typists = ({ users, connectedSockets }: typee) => {
  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-2">
          <Users className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold md:text-xl">
          Typists {connectedSockets ? `(${connectedSockets})` : "1"}
        </h2>
      </div>

      <div className="custom-scrollbar h-[300px] space-y-4 overflow-y-auto md:h-[450px]">
        {users
          ?.filter((user) => user.status === "active")
          .map((user) => pck(user))}
        {users
          ?.filter((user) => user.status === "inactive")
          .map((user) => pck(user))}
      </div>
    </Card>
  );
};

function pck(user: { id: string; status: "active" | "inactive" }) {
  return (
    <div
      key={user.id}
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800/30"
    >
      <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 md:h-10 md:w-10">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
          photo
        </AvatarFallback>
      </Avatar>
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
        <p className="font-medium text-blue-400">{user.id}</p>
      </div>
    </div>
  );
}

export default Typists;
