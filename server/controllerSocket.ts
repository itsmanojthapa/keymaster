import { Server, Socket } from "socket.io";
import {
  deleteRoom,
  generateHex,
  userExistsInRoom,
  getRoom,
  addUserToRoomUsers,
  getUsersDataInRoom,
  roomExists,
  inactiveUserRoom,
  startGame,
  endGame,
  getUser,
  setRoomTTL,
  calculateResult,
} from "./controllerRedis";
import { TypeCreateRoom, TypeRoom, TypeUser } from "../types/types";
import { pubClient } from "./redisClient";
import { jsRoomDataToRedis, jsUserToRedis } from "../utils/redisJsConverter";

const controller = (io: Server, socket: Socket) => {
  const handleCreateRoom = async (data: TypeCreateRoom) => {
    let roomCode = generateHex();
    while (io.sockets.adapter.rooms.has(roomCode)) {
      roomCode = generateHex();
    }

    socket.join(roomCode);

    const roomData: TypeRoom = {
      roomCode: roomCode,
      adminUserID: socket.data.user.id,
      adminSocketID: socket.id,
      gameStarted: false,
      gameStartedTime: undefined,
      gameEnded: false,
      users: [socket.data.user.id],
      text: data.text,
      time: data.selectedTime,
      date: new Date(),
    };
    const user: TypeUser = {
      socketID: socket.id,
      userID: socket.data.user.id,
      name: socket.data.user.name,
      image: socket.data.user.image,
      status: "active",
      inputLength: 0,
      inputText: "",
      wpm: undefined,
      accuracy: undefined,
      correct: undefined,
      wrong: undefined,
    };

    const redisRoomData = jsRoomDataToRedis(roomData);
    const redisUser = jsUserToRedis(user);

    // Now, properly store it in Redis
    await pubClient.hSet(`room:${roomCode}:roomData`, redisRoomData);
    // Create user in Redis
    await pubClient.hSet(
      `room:${roomCode}:user:${socket.data.user.id}`,
      redisUser,
    );
    await setRoomTTL(roomCode, 60 * 10);
    socket.emit("createRoom", roomCode);
  };

  const handleInit = async (roomCode: string) => {
    socket.emit("init", await getRoom(roomCode));
  };

  const handleRoomExists = async (roomCode: string) => {
    socket.emit("roomExists", await roomExists(roomCode));
  };

  const handleJoinRoom = async (roomCode: string) => {
    if (await roomExists(roomCode)) {
      const room = await getRoom(roomCode);
      if (!room) {
        return;
      }

      if (room.gameStarted) {
        socket.emit("joinRoom", "Game already started", "error");
        return;
      }

      const user = await userExistsInRoom(roomCode, socket.data.user.id);

      if (!user) {
        const user: TypeUser = {
          socketID: socket.id,
          userID: socket.data.user.id,
          name: socket.data.user.name,
          image: socket.data.user.image,
          status: "active",
          inputLength: 0,
          inputText: "",
          wpm: undefined,
          accuracy: undefined,
          correct: undefined,
          wrong: undefined,
        };

        const redisUser = jsUserToRedis(user);
        await pubClient.hSet(
          `room:${roomCode}:user:${socket.data.user.id}`,
          redisUser,
        );

        const ttl = await pubClient.TTL(`room:${roomCode}:roomData`); //get remaining time
        await addUserToRoomUsers(roomCode, socket.data.user.id);
        await pubClient.expire(
          `room:${roomCode}:user:${socket.data.user.id}`,
          ttl,
        );
      } else {
        await pubClient.hSet(
          `room:${roomCode}:user:${socket.data.user.id}`,
          "status",
          "active",
        );
      }

      socket.join(roomCode);
      socket.emit("joinRoom", "Room joined");
      handleGetUsers(roomCode);
      handleInit(roomCode);
    } else {
      socket.emit("joinRoom", "Room does not exist", "error");
    }
  };

  const handleGetUsers = async (roomCode: string) => {
    io.to(roomCode).emit("getUsers", await getUsersDataInRoom(roomCode));
  };

  const handleLeaveRoom = async (roomCode: string) => {
    const room: TypeRoom | undefined = await getRoom(roomCode);
    if (room?.adminSocketID === socket.id) {
      destroyRoom(roomCode, "Admin Left");
      return;
    }
    socket.leave(roomCode);
    inactiveUserRoom(roomCode, socket.data.user.id);
    handleGetUsers(roomCode);
  };

  const handleMessage = async (roomCode: string, msg: string) => {
    io.to(roomCode).emit("message", socket.data.user.id, msg);
  };

  // const handleNoOfUsersInRoom = async (roomCode: string) => {
  //   socket.emit("noOfUsersInRoom", await getNoOfUsersInRoom(roomCode));
  // };

  const handleStart = async (roomCode: string) => {
    // make TTL at least 5 min more so that game can be played setRoomTTL(roomCode, 60 * 5);
    const room = await getRoom(roomCode);
    if (!room) {
      socket.emit("start", "Room does not exist", "error");
      return;
    }
    await startGame(roomCode);
    io.to(roomCode).emit("start", "Game is starting");
    // Stop listening to typing after game duration ends
    setTimeout(
      async () => {
        await endGame(roomCode);
        io.to(roomCode).emit("end");

        await calculateResult(roomCode);

        //now return updated users data
        const usersData = await getUsersDataInRoom(roomCode);
        io.to(roomCode).emit("result", usersData);

        //store room data in cloud db
        setTimeout(() => {
          // Finally, remove users from the room after resultDuration
          destroyRoom(roomCode, "Game Ended");
        }, 1000 * 60); //leave room after 1 minute of game End
      },
      1000 * (room.time + 3), // Calculate Game result after game duration + 3 sec timer
    );
  };

  const handleTyping = async (roomCode: string, inputText: string) => {
    const room = await getRoom(roomCode);
    if (!room) {
      socket.emit("leaveRoom", "Something went wrong");
      return;
    }
    if (room.gameEnded) return;
    if (!room.gameStartedTime) {
      return;
    }

    const user = await getUser(roomCode, socket.data.user.id);
    if (user) {
      if (user.inputLength >= room.text.length) return;
      user.inputLength = inputText.length;
      user.inputText = inputText;
      if (room.text.length === inputText.length) {
        user.timetaken = Date.now() - room.gameStartedTime;
      }
      const redisUser = jsUserToRedis(user);
      await pubClient.hSet(
        `room:${roomCode}:user:${socket.data.user.id}`,
        redisUser,
      );
      io.to(roomCode).emit("gameTyping", socket.data.user.id, inputText.length);
    } else {
      socket.emit("leaveRoom", "Something went wrong");
    }
  };

  const handleDisconnect = async () => {
    const keys = await pubClient.keys(`room:*:user:${socket.data.user.id}`);
    // if (keys.length > 0) {
    //   for (const key of keys) {
    //     await pubClient.hSet(key, "status", "inactive");
    //   }
    // }

    keys
      .filter((key) => key.split(":")[0] === "room")
      .forEach(async (key) => {
        console.log("key", key);

        const roomCode = key.split(":")[1];
        console.log("room", roomCode);
        const room = await getRoom(roomCode);

        if (room?.adminSocketID === socket.id) {
          destroyRoom(roomCode, "Admin Left");
        } else {
          inactiveUserRoom(roomCode, socket.data.user.id);
          handleGetUsers(roomCode);
        }
      });
  };

  // -----------------------------------------------------------------------------------------------------------------

  const destroyRoom = async (roomCode: string, reason: string) => {
    io.to(roomCode).emit("leaveRoom", reason);
    io.socketsLeave(roomCode);
    deleteRoom(roomCode);
  };

  // -----------------------------------------------------------------------------------------------------------------

  return {
    handleInit,
    handleRoomExists,
    handleGetUsers,
    handleMessage,
    handleCreateRoom,
    handleJoinRoom,
    handleStart,
    handleLeaveRoom,
    handleTyping,
    handleDisconnect,
  };
};

export default controller;
