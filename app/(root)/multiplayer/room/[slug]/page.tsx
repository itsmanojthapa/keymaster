"use client";

import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { useSocket } from "@/components/context/SocketContext";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const socket = useSocket();
  const [roomName, setRoom] = useState("home");

  if (!slug) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center">
      My Post: {slug}
      <div className="mt-3 flex w-full justify-center">
        <Chat socket={socket} slug={slug} />
      </div>
    </div>
  );
}
