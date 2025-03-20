import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import controller from "./controllerSocket";
import { authenticateSocket } from "./authenticate";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redisClient";

const onConnection = async (io: Server, socket: Socket) => {
  try {
    if (!socket.data.user) {
      socket.disconnect();
      return;
    }

    const {
      handleInit,
      handleRoomExists,
      handleMessage,
      handleCreateRoom,
      handleJoinRoom,
      handleGetUsers,
      handleStart,
      handleLeaveRoom,
      handleTyping,
      handleDisconnect,
    } = controller(io, socket);

    socket.on("createRoom", handleCreateRoom);
    socket.on("roomExists", handleRoomExists);
    socket.on("init", handleInit);
    socket.on("joinRoom", handleJoinRoom);
    socket.on("leaveRoom", handleLeaveRoom);
    socket.on("message", handleMessage);
    socket.on("getUsers", handleGetUsers);

    socket.on("start", handleStart);
    socket.on("typing", handleTyping);

    socket.on("disconnect", handleDisconnect);
  } catch (error) {
    console.error("❌ Error in onConnection:", error);
    socket.disconnect();
  }
};

export const initSocket = async (httpServer: HttpServer) => {
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);

    const io = new Server(httpServer, {
      cors: {
        origin: process.env.AUTH_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
      adapter: createAdapter(pubClient, subClient),
    });

    // Use middleware for authentication
    io.use(authenticateSocket);

    io.on("connection", (socket: Socket) => onConnection(io, socket));
    console.log("🚀 Socket server initialized ");
  } catch (err) {
    console.log("❌ Error initializing socket server");
    console.log(err);
  }
};
