"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { motionSet } from "@/lib/motionSet";
import { data } from "@/lib/text";
import ShowText from "@/components/ShowText";
import { LoaderCircle, LogIn, Plus } from "lucide-react";
import CustomText from "@/components/CustomText";
import Control from "@/components/Control";
import { Spec } from "@/components/spec";
import { TypeTimeOption } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect, useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

import { disSocket, initSocket } from "@/utils/socketio";
import { useSession } from "next-auth/react";

const Multiplayer = () => {
  const { data: session } = useSession();
  if (!session?.user?.id) redirect("/login");

  const router = useRouter();

  const { toast } = useToast();

  const [jRoom, setJRoom] = useState("");

  const [selectedTime, setSelectedTime] = useState<TypeTimeOption>(15);
  const [text, setText] = useState(data[0]);
  const [customTextDiv, setCustomTextDiv] = useState(false);
  const [clickedJ, setClickedJ] = useState(false);
  const [clickedC, setClickedC] = useState(false);

  const handleJRoom = (e: React.FormEvent) => {
    setClickedJ(true);
    e.preventDefault();

    if (!session?.user) redirect("/login");

    const socket = initSocket();

    socket.on("joinRoom", (msg: string, error) => {
      if (error) {
        setClickedJ(false);
        toast({ variant: "destructive", title: `ERROR: ${msg}` });
        disSocket();
        return;
      }
      toast({ title: msg });
      router.push(`/multiplayer/room/${jRoom}`);
    });

    if (socket) {
      jRoom.trim();
      socket.emit("joinRoom", jRoom);
    } else {
      toast({ variant: "destructive", title: "ERROR: Socket not initialized" });
      setClickedJ(false);
      disSocket();
    }
  };
  const handleCRoom = () => {
    setClickedC(true);
    if (!session?.user) redirect("/login");
    const socket = initSocket();

    socket.on("createRoom", (roomName: string) => {
      socket.emit("joinRoom", roomName);
      toast({ title: `Room created: ID ${roomName}` });
      redirect(`/multiplayer/room/${roomName}`);
    });

    if (socket) {
      socket.emit("createRoom", {
        text,
        selectedTime,
        userID: session?.user?.id,
        userName: session?.user?.name,
      });
    } else {
      setClickedC(false);
      toast({ variant: "destructive", title: "ERROR: Socket not initialized" });
      disSocket();
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
      <Tabs defaultValue="join" className="w-full">
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
        <TabsContent value="join" className="focus-visible:ring-0">
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
                  placeholder="Room Code"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded bg-blue-600 py-1 text-xl font-bold text-white hover:bg-blue-500"
                  disabled={clickedJ ? true : false}
                >
                  {clickedJ ? (
                    <LoaderCircle
                      absoluteStrokeWidth={false}
                      strokeWidth={3}
                      className="animate-spin"
                    />
                  ) : (
                    <>
                      <LogIn className="mr-3" />
                      Join Room
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="create" className="focus-visible:ring-0">
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
                  disabled={clickedC ? true : false}
                >
                  {clickedC ? (
                    <LoaderCircle
                      absoluteStrokeWidth={false}
                      strokeWidth={3}
                      className="animate-spin"
                    />
                  ) : (
                    <>
                      <Plus size={28} strokeWidth={2.4} className="mr-3" />
                      Create Room
                    </>
                  )}
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
