"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { disSocket, initSocket } from "@/utils/socketio";

const Multiplayer = () => {
  const router = useRouter();

  const [jRoom, setJRoom] = useState("");

  const [selectedTime, setSelectedTime] = useState<TimeOption>(15);
  const [text, setText] = useState(data[0]);
  const [customTextDiv, setCustomTextDiv] = useState(false);

  const handleJRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const socket = initSocket();
    socket.on("joinRoom", (msg: string, error) => {
      if (error) {
        disSocket();
        return toast.error(`ERROR: ${msg}`);
      }
      toast.success(msg);
      router.push(`/multiplayer/room/${jRoom}`);
      // redirect(`/multiplayer/room/${jRoom}`);
    });
    if (socket) {
      jRoom.trim();
      socket.emit("joinRoom", jRoom);
    } else {
      toast.error("ERROR: Socket not initialized");
    }
  };
  const handleCRoom = () => {
    const socket = initSocket();
    socket.on("createRoom", (roomName: string) => {
      socket.emit("joinRoom", roomName);
      toast.success(`Room created: ${roomName}`);
      redirect(`/multiplayer/room/${roomName}`);
      // router.push(`/multiplayer/room/${roomName}`);
    });

    if (socket) {
      socket.emit("createRoom");
    } else {
      toast.error("ERROR: Socket not initialized");
    }
  };

  const handleCustomTextSave = (text: string) => {
    text = text.replace(/\s+/g, " ").trim();
    setText(text);
  };

  const shuffle = (max: number, min: number) => {
    const something = data[Math.floor(Math.random() * (max - min + 1)) + min];
    setText(something);
  };

  return (
    <motion.div className="mx-auto max-w-5xl p-10" {...motionSet}>
      <div className="text-zin text-2xl font-bold">Multiplayer Arena</div>
      <Tabs defaultValue="create" className="w-full">
        <TabsList
          className={`mt-10 flex flex-col justify-center space-x-1 space-y-1 bg-transparent text-zinc-50 sm:mt-3 sm:flex-row sm:space-y-0 sm:bg-zinc-800`}
        >
          <TabsTrigger
            value="join"
            className={`w-full bg-zinc-700 p-1 text-lg data-[state=active]:bg-blue-500 sm:p-0`}
          >
            Join Room
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="w-full bg-zinc-700 p-1 text-lg data-[state=active]:bg-teal-400 sm:p-0"
          >
            Create Room
          </TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <motion.div
            className="mt-10 flex w-full justify-center"
            {...motionSet}
          >
            <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
              <div className={`flex items-center space-x-2`}>
                <LogIn className="text-blue-400" />
                <div className="text-zin text-2xl font-bold">
                  Join Room
                  {/* {socket?.connected ? "🍏" : "🍎"} */}
                </div>
              </div>

              <form onSubmit={handleJRoom} className="mt-3 flex flex-col gap-2">
                <input
                  type="text"
                  value={jRoom}
                  onChange={(e) => {
                    const data = e.target.value.trim().replace(/\s+/g, " ");
                    setJRoom(data);
                  }}
                  className="flex-1 rounded border p-2 text-black"
                  placeholder="Room name..."
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded bg-blue-600 py-1 text-xl font-bold text-white hover:bg-blue-500"
                >
                  <LogIn className="mr-3" />
                  Join Room
                </button>
              </form>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="create">
          <motion.div
            className="mt-10 flex w-full flex-col items-center justify-center"
            {...motionSet}
          >
            <div className="mx-auto mt-3 flex w-fit flex-col items-center justify-between space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Control
                onShuffle={shuffle}
                onEdit={() => setCustomTextDiv(true)}
              />
              <Spec
                setSelectedTime={setSelectedTime}
                selectedTime={selectedTime}
              />
            </div>
            <ShowText text={text} />
            <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
              <div className={`flex items-center space-x-2`}>
                <Plus className="text-teal-400" size={30} />
                <div className="text-zin text-2xl font-bold">
                  Create Room
                  {/* {socket?.connected ? "🍏" : "🍎"} */}
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="submit"
                  onClick={handleCRoom}
                  className="flex items-center justify-center space-x-5 rounded bg-teal-600 py-1 text-xl font-bold text-white hover:bg-teal-500"
                >
                  <Plus size={28} className="mr-3" />
                  Create Room
                </button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

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
