"use client";

import { Button } from "@/components/ui/button";
import { Timer, Copy, Check, LogOut } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Typists from "@/components/ui/Typists";
import Chat from "@/components/Chat";
import { motion } from "framer-motion";
import { motionSet } from "@/lib/motionSet";
import { disSocket, getSocket } from "@/utils/socketio";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import ShowText from "@/components/ShowText";
import { Card } from "@/components/ui/card";
import Pck from "@/components/Pck";
import { TypeRoom, TypeTypingStats, TypeUser } from "@/types/types";
import { calculateStats } from "@/lib/CalculateStats";
import Stats from "@/components/Stats";
import Pcr from "@/components/Pcr";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const timerRef = useRef<number>();

  const { slug } = React.use(params);
  const [letsgo, setletsgo] = useState<boolean>(false);
  const socket = getSocket();
  const { toast } = useToast();
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedSockets, setConnectedSockets] = useState(0);
  const [status, setStatus] = useState(true);
  const [stats, setStats] = useState<TypeTypingStats>({
    wpm: 0,
    accuracy: 0,
    correct: 0,
    wrong: 0,
  });

  const [roomData, setRoomData] = useState<TypeRoom | null>();
  const [result, setResult] = useState<TypeUser[] | null>();

  const [inputText, setInputText] = useState("");
  const [timeUsed, setTimeUsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [countdown, setCountdown] = useState<number | false>(false);
  const [start, setStart] = useState<boolean>(false);
  const [startTime, setStartTime] = useState(0);

  // Authentication check (replace with actual logic)
  function auth() {
    return true;
  }
  if (!auth()) {
    redirect("/login");
  }

  useEffect(() => {
    if (!socket) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "ERROR: Join from Multiplayer page",
        });
      }, 100);
      redirect("/multiplayer");
    }

    const handleRoomExists = (exists: string) => {
      if (exists === "false") {
        setTimeout(() => {
          toast({ variant: "destructive", title: "ERROR: Room not found" });
        }, 100);
        redirect("/multiplayer");
      }
    };
    socket.once("init", (roomData: TypeRoom) => {
      if (roomData) {
        setMessages(roomData?.messages || []);
        setRoomData(roomData);
      }
    });

    socket.once("roomExists", handleRoomExists);
    socket.once("gameEnd", () => {
      setStart(false);
      toast({ title: "Game Over! Showing results soon..." });
    });
    socket.once("gameResult", (users) => {
      toast({ title: "Result" });
      setResult(users);
    });

    socket.emit("roomExists", slug);
    socket.emit("joinRoom", slug);
    // Listen for new messages in the room
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    const handleNoOfUsersInRoom = (count: number) => {
      setConnectedSockets(count);
    };

    const handleUsersInRoom = (users: TypeUser[]) => {
      setRoomData((prev) => {
        if (prev) {
          return { ...prev, users: users };
        }
        return prev;
      });
    };

    const handleLeaveRoom = (msg: string) => {
      socket.emit("leaveRoom", slug);
      setTimeout(() => {
        toast({ title: msg });
      }, 200);
      disSocket();
      redirect("/multiplayer");
    };

    const handleLetsbegin = () => {
      setletsgo((v) => !v);
      setCountdown(1);
      const sss = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 3) {
            clearInterval(sss); // Stop the interval after 3 executions
            setStart(true);
            setIsFocused(true);
            setStartTime(Date.now() + 1000);
            startTyping();
            return prev + 1; // Prevents further updates
          }
          if (!prev) return 1;
          return prev + 1;
        });
      }, 1000);
    };

    socket.on("noOfUsersInRoom", handleNoOfUsersInRoom);
    socket.on("usersInRoom", handleUsersInRoom);
    socket.on("leaveRoom", handleLeaveRoom);

    socket.once("gameLetsbegin", handleLetsbegin);

    const activity = setInterval(() => {
      socket.emit("noOfUsersInRoom", slug);
      socket.emit("usersInRoom", slug);
      setStatus(socket?.connected);
    }, 1000 * 5);

    return () => {
      clearInterval(activity);
      socket.off("noOfUsersInRoom");
      socket.off("message");
      socket.off("noOfUsersInRoom");
      socket.off("usersInRoom");
      socket.off("leaveRoom");
      socket.off("gameLetsbegin");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (start) {
      timerRef.current = window.setInterval(() => {
        setTimeUsed((time) => time + 1000);
        if (!start) {
          clearInterval(timerRef.current);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [start, startTime]);

  useEffect(() => {
    if (start) {
      const newStats = calculateStats(
        inputText,
        roomData?.text || " ",
        timeUsed,
      );
      setStats(newStats);
    }
  }, [timeUsed, inputText, start, roomData?.text]);

  useEffect(() => {
    return () => {
      if (!socket) return;
      socket.emit("leaveRoom", slug);
      setTimeout(() => toast({ title: "Exiting Room" }), 100);
      disSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [start]);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(roomData?.roomCode || "");
    setCopied(true);
    toast({ title: "Room code copied to clipboard!" });
    setTimeout(() => setCopied(false), 100);
  };
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
    };
    const handleBlur = () => setIsFocused(false);

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [inputRef, start]);

  if (!socket || !slug) {
    return (
      <div className="flex flex-col items-center text-2xl">Loading...</div>
    );
  }

  if (!status) {
    setTimeout(() => {
      toast({ variant: "destructive", title: "Disconnected" });
    }, 100);
    redirect("/multiplayer");
  }

  const startTyping = () => {
    socket.on("gameTyping", (id: string, inputLength: number) => {
      setRoomData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) => {
            if (user.id === id) {
              user.inputLength = inputLength;
            }
            return user;
          }),
        };
      });
    });
    socket.once("gameResult", (id: string, resultData: TypeTypingStats) => {
      setRoomData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) => {
            if (user.id === id) {
              user.resultData = resultData;
            }
            return user;
          }),
        };
      });
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    socket?.emit("gameTyping", roomData?.roomCode, newText.length, newText);
    const newStats = calculateStats(
      newText,
      roomData?.text || "",
      timeUsed || 1,
    );
    setStats(newStats);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault(); // Block backspace and delete
    }
    if (inputText.length === 0 && e.key === " ") {
      e.preventDefault();
    }

    if (roomData?.text.charAt(inputText.length) === " " && e.key === " ") {
      return;
    }
    if (inputText.charAt(inputText.length - 2) === " " && e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <motion.div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          {...motionSet}
        >
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              <span className="font-normal text-black dark:text-white">🏁</span>{" "}
              Race Room | {roomData?.text?.length}Char {roomData?.time}s
            </h1>
            {!letsgo && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800/50 p-2 text-zinc-400">
                {socket?.connected ? (
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
                <p className="text-sm font-medium md:text-base">
                  Room Code: {roomData?.roomCode}
                </p>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-zinc-700/50"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-teal-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {socket?.id === roomData?.author && !letsgo && (
              <Button
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 font-bold shadow-lg transition-all hover:from-blue-600 hover:to-teal-700 hover:text-zinc-100 hover:shadow-teal-500/20 sm:w-auto"
                onClick={() => {
                  socket.emit("gameLetsbegin", slug);
                }}
              >
                <Timer strokeWidth={3} className="mr-1 h-4 w-4" />
                Start Race
              </Button>
            )}
            <Button
              className="w-full bg-zinc-800 hover:bg-zinc-700 sm:w-auto"
              onClick={() => {
                socket.emit("leaveRoom", slug);
                disSocket();
                setTimeout(() => toast({ title: "Disconnected" }), 100);
                redirect("/multiplayer");
              }}
            >
              <LogOut strokeWidth={3} className="mr-1 h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </motion.div>
        <hr className="my-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-zinc-600 to-transparent dark:via-zinc-600" />
        {/* Main Content */}
        {!letsgo && (
          <motion.div
            className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            <Chat
              socket={socket}
              slug={slug}
              messages={messages}
              setMessages={setMessages}
            />
            <Typists
              users={roomData?.users}
              connectedSockets={connectedSockets}
            />
          </motion.div>
        )}
        {letsgo && !result ? (
          <div>
            <Stats stats={stats} time={timeUsed} />
            <div className="relative flex items-center justify-center">
              <ShowText
                text={roomData?.text || ""}
                inputText={start ? inputText : undefined}
                isFocused={isFocused}
              />
              {start && (
                <input
                  ref={inputRef}
                  value={inputText}
                  type="text"
                  placeholder="Start typing..."
                  onChange={handleInput}
                  className="absolute inset-0 h-full w-full cursor-default resize-none opacity-0 focus:outline-none"
                  onKeyDown={handleKeyDown} // Prevents Backspace
                />
              )}
              {countdown && countdown < 4 && (
                <span className="absolute inline-flex animate-ping rounded-full bg-sky-400 text-6xl font-bold opacity-75">
                  {countdown}
                </span>
              )}
            </div>
            <Card className="border-zinc-800/50 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm">
              {roomData?.users.map((user, i) => {
                return user.status === "active" ? (
                  <Pck
                    value={
                      user.id === socket.id
                        ? perLength(inputText.length, roomData.text.length) ||
                          0.1
                        : perLength(user.inputLength, roomData.text.length) ||
                          0.1
                    }
                    user={{ id: user.id }}
                    key={i}
                  />
                ) : (
                  <div className="hidden" key={i}></div>
                );
              })}
            </Card>
          </div>
        ) : (
          <>
            <Card className="w-fit border-zinc-800/50 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm">
              {result?.map((user, i) => {
                return user.status === "active" ? (
                  <Pcr
                    user={user}
                    key={i}
                    time={roomData?.time ? roomData?.time * 1000 : 0}
                  />
                ) : (
                  <div className="hidden" key={i}></div>
                );
              })}
            </Card>
          </>
        )}
      </motion.div>
    </main>
  );
}

function perLength(inputLength: number, textLength: number) {
  return Math.floor((inputLength / textLength) * 100);
}
