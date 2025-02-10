"use client";

import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { Socket } from "socket.io-client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatProps = {
  socket: Socket;
  slug: string;
  messages: string[];
  setMessages: Dispatch<SetStateAction<string[]>>;
};

const Chat = ({ socket, slug, messages }: ChatProps) => {
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message to the room
  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("messageRoom", slug, message);
      setMessage("");
    }
  };

  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm md:p-6 lg:col-span-2">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
          <MessageSquare />
        </div>
        <h2 className="text-lg font-bold md:text-xl">Chat</h2>
      </div>

      <div className="custom-scrollbar mb-4 h-[300px] space-y-4 overflow-y-auto pr-2 md:h-[400px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800/30"
          >
            <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20 md:h-10 md:w-10">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                Photo
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-emerald-400">name</p>
              <p className="text-gray-300">{msg}</p>
            </div>
          </div>
        ))}
        <div className="h-0" ref={messagesEndRef}></div>
      </div>

      <form onSubmit={sendMessageHandler} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded bg-zinc-800/50 p-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="rounded bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 font-bold text-zinc-900 shadow-lg transition-all hover:from-blue-600 hover:to-teal-700 hover:text-zinc-100"
        >
          <Send strokeWidth={2} size={20} />
        </button>
      </form>
    </Card>
  );
};

export default Chat;
