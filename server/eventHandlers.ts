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
import { calculateStats } from "../lib/CalculateStats";

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

    db.push({
      roomCode: roomCode,
      author: socket.id,
      gameStarted: false,
      gameStartedTime: null,
      gameEnded: false,
      text: text,
      users: [
        { id: socket.id, status: "active", inputLength: 0, inputText: "" },
      ],
      time: time,
      date: new Date(),
      messages: [],
    });
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
        socket.emit("joinRoom", "Game already started", "error");
        return;
      }

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
    // Start game after 3 seconds
    room.gameStartedTime = new Date(Date.now() + 3 * 1000);

    io.to(roomCode).emit("gameLetsbegin", "Game is starting");
    // Stop listening to typing after game duration ends
    setTimeout(
      () => {
        const room = findRoom(roomCode);
        if (!room) {
          io.to(roomCode).emit("leaveRoom", "Something went wrong");
          io.socketsLeave(roomCode);
          return;
        }
        room.gameEnded = true;
        io.to(roomCode).emit("gameEnd");

        room?.users.map((user) => {
          const stats = calculateStats(
            user.inputText,
            room?.text,
            user?.timetaken || room.time * 1000,
          );
          user.resultData = stats;
        });
        io.to(roomCode).emit("gameResult", room?.users);

        // Finally, remove users from the room after resultDuration
        setTimeout(() => {
          io.to(roomCode).emit("leaveRoom", "Session completed");
          io.socketsLeave(roomCode);
          //store room data in cloud db
          deleteRoom(roomCode); // Cleanup room data
        }, 1000 * 30);
      },
      1000 * (room.time + 3),
    );
  };

  const handleTyping = (
    roomCode: string,
    inputLength: number,
    inputText: string,
  ) => {
    const room = findRoom(roomCode);
    if (!room) {
      io.to(roomCode).emit("leaveRoom", "Something went wrong");
      io.socketsLeave(roomCode);
      return;
    }
    if (room.gameEnded) return;
    if (!room.gameStarted) {
      return;
    }

    const user = room.users.find((user) => user.id === socket.id);
    if (user) {
      user.inputLength = inputLength;
      user.inputText = inputText;
      if (room.text.length === inputLength) {
        user.timetaken = Date.now() - room.gameStartedTime!.getTime();
      }
    }

    io.to(roomCode).emit("gameTyping", socket.id, inputLength);
  };

  const handleDisconnect = () => {
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
    handleTyping,
    handleDisconnect,
  };
};

export default eventHandlers;
