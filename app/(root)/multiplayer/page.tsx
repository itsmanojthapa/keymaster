"use client";

import { useSocket } from "@/components/context/SocketContext";
import { useState } from "react";
import { motion } from "motion/react";
import { motionSet } from "@/lib/motionSet";
import { data } from "@/lib/text";
import ShowText from "@/components/ShowText";
import { LogIn, Plus } from "lucide-react";
import CustomText from "@/components/CustomText";
import Control from "@/components/Control";
import { Spec } from "@/components/spec";
import { TimeOption } from "@/types/types";

const Multiplayer = () => {
  const socket = useSocket();
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  const [selectedTime, setSelectedTime] = useState<TimeOption>(15);
  const [text, setText] = useState(data[0]);
  const [customTextDiv, setCustomTextDiv] = useState(false);

  const changeRoomHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && roomName.trim()) {
      socket.emit("leaveRoom", room);
      setRoom(roomName);
      socket.emit("joinRoom", roomName);
    }
  };

  const handleCustomTextSave = (text: string) => {
    text = text.replace(/\s+/g, " ").trim();
    setText(text);
  };

  return (
    <motion.div className="mx-auto max-w-5xl p-10" {...motionSet}>
      <div className="text-zin text-2xl font-bold">Multiplayer Arena</div>
      <div className="mt-10 flex w-full justify-center">
        <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
          <div className={`flex items-center space-x-2`}>
            <LogIn className="text-blue-400" />
            <div className="text-zin text-2xl font-bold">
              Join Room {socket?.connected ? "🍏" : "🍎"}
            </div>
          </div>

          <form
            onSubmit={changeRoomHandler}
            className="mt-3 flex flex-col gap-2"
          >
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="flex-1 rounded border p-2 text-black"
              placeholder="Room name..."
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded bg-teal-600 py-1 text-xl font-bold text-white hover:bg-teal-500"
            >
              <LogIn className="mr-3" />
              Join Room
            </button>
          </form>
        </div>
      </div>
      <div className="my-10 h-1 w-full bg-zinc-50"></div>
      <div className="mt-3 flex w-full flex-col items-center justify-center">
        <div className="mx-auto mt-3 flex w-fit flex-col items-center justify-between space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Control
            onRestart={() => {}}
            onShuffle={() => {}}
            onEdit={() => setCustomTextDiv(true)}
          />
          <Spec setSelectedTime={setSelectedTime} selectedTime={selectedTime} />
        </div>
        <ShowText text={text} />
        <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
          <div className={`flex items-center space-x-2`}>
            <Plus className="text-teal-400" size={30} />
            <div className="text-zin text-2xl font-bold">
              Create Room {socket?.connected ? "🍏" : "🍎"}
            </div>
          </div>
          <form
            onSubmit={changeRoomHandler}
            className="mt-3 flex flex-col gap-2"
          >
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="flex-1 rounded border-2 p-2 text-black focus:border-teal-500 focus:outline-none"
              placeholder="Room name..."
            />
            <button
              type="submit"
              className="flex items-center justify-center space-x-5 rounded bg-teal-600 py-1 text-xl font-bold text-white hover:bg-teal-500"
            >
              <Plus size={28} className="mr-3" />
              Create Room
            </button>
          </form>
        </div>
      </div>
      {customTextDiv && (
        <CustomText
          onClose={() => setCustomTextDiv(false)}
          onSave={handleCustomTextSave}
          currentText={text}
        />
      )}
    </motion.div>
  );
};

export default Multiplayer;
