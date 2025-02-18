import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import eventHandlers from "./eventHandlers";

const onConnection = (io: Server, socket: Socket) => {
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
};

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  io.on("connection", (socket: Socket) => onConnection(io, socket));
  console.log("Socket server initialized");
};
