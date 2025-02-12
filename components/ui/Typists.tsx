import React from "react";
import { Card } from "./card";
import { Users } from "lucide-react";
import Pck from "../Pck";

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
          .map((user, i) => <Pck user={user} key={i} />)}
        {users
          ?.filter((user) => user.status === "inactive")
          .map((user, i) => <Pck user={user} key={i} />)}
      </div>
    </Card>
  );
};

export default Typists;
