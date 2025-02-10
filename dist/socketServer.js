"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const eventHandlers_1 = __importDefault(require("./eventHandlers"));
const onConnection = (io, socket) => {
    console.log(`Client connected ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`);
    const { handleInit, handleRoomExists, handleMessageRoom, handleCreateRoom, handleJoinRoom, handleUsersInRoom, handleNoOfUsersInRoom, handleLeaveRoom, handleDisconnect, } = (0, eventHandlers_1.default)(io, socket);
    socket.on("init", handleInit);
    socket.on("roomExists", handleRoomExists);
    socket.on("messageRoom", handleMessageRoom);
    socket.on("createRoom", handleCreateRoom);
    socket.on("joinRoom", handleJoinRoom);
    socket.on("leaveRoom", handleLeaveRoom);
    socket.on("noOfUsersInRoom", handleNoOfUsersInRoom);
    socket.on("usersInRoom", handleUsersInRoom);
    socket.on("disconnect", handleDisconnect);
};
const initSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    io.on("connection", (socket) => onConnection(io, socket));
    console.log("Socket server initialized");
};
exports.initSocket = initSocket;
