"use client";

// import { disSocket } from "@/utils/socketio";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export default function Chat({
  socket,
  slug,
}: {
  socket: Socket;
  slug: string;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedSockets, setConnectedSockets] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize socket event listeners
  useEffect(() => {
    if (socket) {
      // Listen for the number of connected sockets in the room

      socket.on("arrSocketRoom", (count: number) => {
        setConnectedSockets(count);
      });

      // Listen for new messages in the room
      socket.on("message", (msg: string) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Initialize the room and fetch existing messages
      socket.emit("joinRoom", slug);
      socket.once("init", (msgs: string[]) => {
        if (msgs) setMessages(msgs);
      });

      setInterval(() => {
        socket.emit("arrSocketRoom", slug);
      }, 1000 * 5);

      // Cleanup socket listeners on component unmount
      return () => {
        socket.off("arrSocketRoom");
        socket.off("message");
        socket.off("init");
      };
    }
  }, [socket, slug]);

  // Send a message to the room
  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("messageRoom", slug, message);
      setMessage("");
    }
  };

  // useEffect(() => {
  //   return () => {
  //     if (socket) disSocket();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // });

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="mt-3 w-full max-w-xl rounded-lg bg-zinc-800 p-6 text-white shadow-md">
          <h1 className="mb-4 text-2xl font-bold">
            Real-time Chat: {slug} ({connectedSockets} users){" "}
            <span>~{socket?.connected ? "🍏" : "🍎"}</span>
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
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
