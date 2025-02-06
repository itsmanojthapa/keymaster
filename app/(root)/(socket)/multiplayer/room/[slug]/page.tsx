"use client";

import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { redirect } from "next/navigation";
import { disSocket, getSocket } from "@/utils/socketio";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const socket = getSocket();

  // Authentication check (replace with actual logic)
  function auth() {
    return true;
  }

  // Initialize socket and handle room logic
  useEffect(() => {
    if (!auth()) {
      redirect("/login");
    }

    if (!socket) {
      setTimeout(() => {
        toast.error("ERROR: Join from Multiplayer page");
      }, 100);
      redirect("/multiplayer");
    }

    // Resolve params and set slug
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);

      // Handle room existence response
      socket.on("roomExists", (exists: string) => {
        if (exists === "false") {
          setTimeout(() => {
            toast.error("ERROR: Room not found");
          }, 100);
          redirect("/multiplayer");
        }
      });

      // Check if the room exists
      socket.emit("roomExists", resolvedParams.slug);
    });
  }, [params, socket]);

  useEffect(() => {
    return () => {
      socket?.emit("leaveRoom", slug);
      setTimeout(() => toast.success("Exiting Room"), 100);
      disSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!socket || !slug) {
    return (
      <div className="flex flex-col items-center text-2xl">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div>My Post: {slug}</div>
      <Button
        onClick={() => {
          socket.emit("leaveRoom", slug);
          disSocket();
          setTimeout(() => toast.success("Disconnected"), 100);
          redirect("/multiplayer");
        }}
      >
        Disconnect
      </Button>
      <Chat socket={socket} slug={slug} />
    </div>
  );
}
