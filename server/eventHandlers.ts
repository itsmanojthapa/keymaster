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
import { TypeCreateRoom } from "../types/types";

const eventHandlers = (io: Server, socket: Socket) => {
  const handleCreateRoom = (data: TypeCreateRoom) => {
    let roomCode = generateHex();
    while (io.sockets.adapter.rooms.has(roomCode)) {
      roomCode = generateHex();
    }
    socket.join(roomCode);

    roomsTimeout.push({
      roomCode: roomCode,
      timeout: setTimeout(() => {
        destroyRoom(roomCode);
      }, roomsTimeoutTime),
    });

    db.push({
      roomCode: roomCode,
      authorUserID: socket.data.user.id,
      authorSocketID: socket.id,
      gameStarted: false,
      gameStartedTime: null,
      gameEnded: false,
      text: data.text,
      users: [
        {
          socketID: socket.id,
          userID: socket.data.user.id,
          name: socket.data.user.name,
          image: socket.data.user.image,
          status: "active",
          inputLength: 0,
          inputText: "",
        },
      ],
      time: data.selectedTime,
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

      const user = userExistsInRoom(roomCode, socket.data.user.id);
      if (!user) {
        room?.users.push({
          userID: socket.data.user.id,
          socketID: socket.id,
          name: socket.data.user.name,
          image: socket.data.user.image,
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
    if (room?.authorSocketID === socket.id) {
      deleteRoom(roomCode);
      io.to(roomCode).emit("leaveRoom", "Admin left");
      io.socketsLeave(roomCode);
    }

    socket.leave(roomCode);
    deleteUserRoom(roomCode, socket.data.user.id);

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

        //store room data in cloud db
        setTimeout(() => {
          // Finally, remove users from the room after resultDuration
          io.to(roomCode).emit("leaveRoom", "Session completed");
          io.socketsLeave(roomCode);
          deleteRoom(roomCode); // Cleanup room data
        }, 1000 * 30); //leave room after 30 seconds
      },
      1000 * (room.time + 3), // Calculate Game result after game duration + 3 sec timer
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

    const user = room.users.find((user) => user.userID === socket.data.user.id);
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
        if (room.authorSocketID === socket.id) {
          io.to(room.roomCode).emit("leaveRoom", "Admin left");
          io.socketsLeave(room.roomCode);
          destroyRoom(room.roomCode);
        } else if (user.socketID !== socket.id) {
          i = true;
          deleteUserRoom(room.roomCode, socket.data.user.id);
        }
      });
      if (i) {
        //user disconnected from room but not admin update users in room
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
