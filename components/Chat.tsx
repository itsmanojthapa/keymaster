"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export default function Chat({
  socket,
  slug,
}: {
  socket: Socket | null;
  slug: string;
}) {
  // const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedSockets, setConnectedSockets] = useState(0);
  const [room, setRoom] = useState(slug);
  const [roomName, setRoomName] = useState(room);
  const [totalUser, setTotalUser] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("arrSocket", (count: number) => setTotalUser(count));
      socket.on("arrSocketRoom", (count: number) => setConnectedSockets(count));
      socket.on("message", (msg: string) =>
        setMessages((prev) => [...prev, msg]),
      );

      socket.emit("joinRoom", roomName);
      socket.on("init", (msgs: string[]) => setMessages(msgs));
      socket.emit("arrSocketRoom", roomName);
    }

    return () => {
      if (socket) {
        socket.off("init");
        socket.off("arrSocket");
        socket.off("message");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("messageRoom", roomName, message);
      setMessage("");
    }
  };

  const changeRoomHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && roomName.trim()) {
      socket.emit("leaveRoom", room);
      setRoom(roomName);
      socket.emit("joinRoom", roomName);
    }
  };

  return (
    <>
      <div className="w-full max-w-xl">
        <div className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-md">
          <div className="flex justify-between">
            <div className="mb-4 text-2xl font-bold">
              Room Live: <span>{socket?.connected ? "🍏" : "🍎"}</span>
            </div>
            <p>Total Users: {totalUser}</p>
          </div>
          <p className="mb-2">Users in room: {connectedSockets}</p>
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
        <div className="mt-3 w-full max-w-xl rounded-lg bg-zinc-800 p-6 text-white shadow-md">
          <h1 className="mb-4 text-2xl font-bold">
            Real-time Chat <span>{socket?.connected ? "🍏" : "🍎"}</span>
          </h1>
          <div className="mb-4 h-96 overflow-y-auto rounded-lg border p-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2 rounded bg-zinc-700 p-2">
                {msg}
              </div>
            ))}
            <div className="h-0" ref={messagesEndRef}></div>
          </div>
          <form onSubmit={sendMessageHandler} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded border p-2 text-black"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
