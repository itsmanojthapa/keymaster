"use client";

import { useSocket } from "@/components/context/SocketContext";
import { useState } from "react";
import { motion } from "motion/react";
import { motionSet } from "@/lib/motionSet";
import { data } from "@/lib/text";

const Multiplayer = () => {
  const socket = useSocket();
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  const [text, setText] = useState(data[0]);

  const changeRoomHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && roomName.trim()) {
      socket.emit("leaveRoom", room);
      setRoom(roomName);
      socket.emit("joinRoom", roomName);
    }
  };

  return (
    <motion.div className="mx-auto max-w-5xl p-10" {...motionSet}>
      Multiplayer Arena
      <div className="mt-3 flex w-full justify-center">
        <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
          <div className="flex justify-between">
            <h1 className="mb-4 text-2xl font-bold">
              Room Live: <span>{socket?.connected ? "🍏" : "🍎"}</span>
            </h1>
          </div>
          <form onSubmit={changeRoomHandler} className="flex gap-2">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="flex-1 rounded border p-2 text-black"
              placeholder="Room name..."
            />
            <button
              type="submit"
              className="rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
            >
              Set
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Multiplayer;
