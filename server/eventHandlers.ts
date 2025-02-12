import { Server, Socket } from "socket.io";
import {
  findRoom,
  deleteRoom,
  generateHex,
  db,
  userExistsInRoom,
  deleteUserRoom,
  roomsTimeout,
  roomsTimeoutTime,
} from "./roomUtils";
import { TypeRoom } from "@/types/types";

const eventHandlers = (io: Server, socket: Socket) => {
  const handleCreateRoom = (text: string, time: number) => {
    let roomCode = generateHex();
    while (io.sockets.adapter.rooms.has(roomCode)) {
      roomCode = generateHex();
    }
    socket.join(roomCode);
    if (!roomsTimeout.find((room) => room.roomCode === roomCode)) {
      roomsTimeout.push({
        roomCode: roomCode,
        timeout: setTimeout(() => {
          destroyRoom(roomCode);
        }, roomsTimeoutTime),
      });
    }
    console.log(text, time);

    db.push({
      roomCode: roomCode,
      author: socket.id,
      gameStarted: false,
      text: text,
      users: [
        { id: socket.id, status: "active", inputLength: 0, inputText: "" },
      ],
      time: time,
      date: new Date(),
      messages: [],
    });
    console.log(`${socket.id} created and joined room: ${roomCode}`);
    console.log(
      db.forEach((room) => {
        if (room.roomCode === roomCode) {
          console.log(room);
          return;
        }
      }),
    );
    socket.emit("createRoom", roomCode);
    io.to(roomCode).emit(
      "noOfUsersInRoom",
      io.sockets.adapter.rooms.get(roomCode)?.size || 0,
    );
    socket.emit("init", findRoom(roomCode));
  };

  const handleInit = (roomCode: string) => {
    const room = findRoom(roomCode);
    socket.emit("init", room);
  };

  const handleRoomExists = (roomCode: string) => {
    const exists = io.sockets.adapter.rooms.has(roomCode);
    socket.emit("roomExists", exists ? "true" : "false");
  };

  const handleJoinRoom = (roomCode: string) => {
    if (io.sockets.adapter.rooms.has(roomCode)) {
      const room = findRoom(roomCode);
      if (!room) {
        io.to(roomCode).emit("leaveRoom", "Something went wrong");
        io.socketsLeave(roomCode);
        return;
      }

      if (room.gameStarted) {
        console.log("Game already started");
        socket.emit("joinRoom", "Game already started", "error");
        return;
      }

      console.log("GameStartedJOIN: ", room.gameStarted);

      const user = userExistsInRoom(roomCode, socket.id);
      if (!user) {
        room?.users.push({
          id: socket.id,
          status: "active",
          inputText: "",
          inputLength: 0,
        });
      }

      socket.join(roomCode);

      io.to(roomCode).emit("init", findRoom(roomCode));

      console.log(`${socket.id} joined room: ${roomCode}`);

      io.to(roomCode).emit("usersInRoom", room?.users);

      io.to(roomCode).emit(
        "noOfUsersInRoom",
        io.sockets.adapter.rooms.get(roomCode)?.size || 0,
      );
      socket.emit("joinRoom", "Room joined");
    } else {
      socket.emit("joinRoom", "Room does not exist", "error");
    }
  };

  const handleUsersInRoom = (roomCode: string) => {
    const room = findRoom(roomCode);
    if (!room) return;
    socket.emit("usersInRoom", room.users);
    socket.emit(
      "noOfUsersInRoom",
      io.sockets.adapter.rooms.get(roomCode)?.size || 1,
    );
  };
  const handleLeaveRoom = (roomCode: string) => {
    const room = findRoom(roomCode);
    if (room?.author === socket.id) {
      deleteRoom(roomCode);
      io.to(roomCode).emit("leaveRoom", "Admin left");
      io.socketsLeave(roomCode);
    }

    socket.leave(roomCode);
    deleteUserRoom(roomCode, socket.id);
    console.log(`${socket.id} left room: ${roomCode}`);

    io.to(roomCode).emit(
      "noOfUsersInRoom",
      io.sockets.adapter.rooms.get(roomCode)?.size || 0,
    );
    io.to(roomCode).emit("usersInRoom", findRoom(roomCode)?.users);

    const roomSize = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
    if (roomSize === 0) {
      deleteRoom(roomCode);
    }
  };

  const handleMessageRoom = (roomCode: string, msg: string) => {
    const room = findRoom(roomCode);
    if (!room) return;
    room.messages.push(msg);
    console.log(`Message in room ${roomCode}: ${msg}`);
    io.to(roomCode).emit("message", msg);
  };

  const handleNoOfUsersInRoom = (roomCode: string) => {
    const roomSize = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
    socket.emit("noOfUsersInRoom", roomSize);
  };

  const handleLetsbegin = (roomCode: string) => {
    const room = findRoom(roomCode);
    if (!room) {
      io.to(roomCode).emit("leaveRoom", "Something went wrong");
      io.socketsLeave(roomCode);
      return;
    }
    room.gameStarted = true;
    console.log("GameStarted: ", room.gameStarted);

    io.to(roomCode).emit("gameLetsbegin", "Game is starting");
  };

  const handleDisconnect = () => {
    console.log(
      `Disconnected Client ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`,
    );

    db.forEach((room) => {
      let i = false;
      room.users.forEach((user) => {
        i = false;
        if (room.author === socket.id) {
          io.to(room.roomCode).emit("leaveRoom", "Admin left");
          io.socketsLeave(room.roomCode);
          deleteUserRoom(room.roomCode, socket.id);
        }
        if (user.id !== socket.id) {
          deleteUserRoom(room.roomCode, socket.id);
        }
      });
      if (i) {
        io.to(room.roomCode).emit(
          "noOfUsersInRoom",
          io.sockets.adapter.rooms.get(room.roomCode)?.size || 0,
        );
        io.to(room.roomCode).emit("usersInRoom", room.users);
      }
    });
  };

  function destroyRoom(roomCode: string) {
    if (roomsTimeout.find((room) => room.roomCode === roomCode)) {
      roomsTimeout.forEach((room) => {
        if (room.roomCode === roomCode) {
          clearTimeout(room.timeout);
        }
      });
      roomsTimeout.shift();
      io.to(roomCode).emit("leaveRoom", "Time Out"); // Notify clients
      io.socketsLeave(roomCode); // Force users to leave the room
      deleteRoom(roomCode); // Delete room from db
      console.log(`Room ${roomCode} destroyed.`);
    }
  }

  return {
    handleInit,
    handleRoomExists,
    handleUsersInRoom,
    handleMessageRoom,
    handleCreateRoom,
    handleJoinRoom,
    handleLetsbegin,
    handleNoOfUsersInRoom,
    handleLeaveRoom,
    handleDisconnect,
  };
};

export default eventHandlers;
