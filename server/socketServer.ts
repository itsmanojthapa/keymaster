import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import eventHandlers from "./eventHandlers";
import { authenticateSocket } from "./authenticate";
// import { getUserFromDB } from "@/lib/actions/getUserFromDB";

const onConnection = async (io: Server, socket: Socket) => {
  try {
    if (!socket.data.user) {
      socket.disconnect();
      return;
    }

    const {
      handleInit,
      handleRoomExists,
      handleMessageRoom,
      handleCreateRoom,
      handleJoinRoom,
      handleUsersInRoom,
      handleLetsbegin,
      handleNoOfUsersInRoom,
      handleLeaveRoom,
      handleTyping,
      handleDisconnect,
    } = eventHandlers(io, socket);

    socket.on("init", handleInit);
    socket.on("roomExists", handleRoomExists);
    socket.on("messageRoom", handleMessageRoom);
    socket.on("createRoom", handleCreateRoom);
    socket.on("joinRoom", handleJoinRoom);
    socket.on("leaveRoom", handleLeaveRoom);
    socket.on("noOfUsersInRoom", handleNoOfUsersInRoom);
    socket.on("usersInRoom", handleUsersInRoom);

    socket.on("gameLetsbegin", handleLetsbegin);
    socket.on("gameTyping", handleTyping);

    socket.on("disconnect", handleDisconnect);
  } catch (error) {
    console.error("❌ Error in onConnection:", error);
    socket.disconnect();
  }
};

export const initSocket = (httpServer: HttpServer) => {
  try {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.PUBLIC_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
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
