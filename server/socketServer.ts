import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

// Define the structure of a room
interface Room {
  roomName: string;
  messages: string[];
}

// In-memory database for rooms
const db: Room[] = [{ roomName: "home", messages: [] }];

// Generate a random hex string for room names
const generateHex = (): string => {
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
};

// Initialize Socket.IO server
export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Update as needed
      credentials: true,
    },
  });

  // Helper function to find a room in the database
  const findRoom = (roomName: string): Room | undefined => {
    return db.find((room) => room.roomName === roomName);
  };

  // Helper function to delete a room from the database
  const deleteRoom = (roomName: string): void => {
    const index = db.findIndex((room) => room.roomName === roomName);
    if (index !== -1) {
      db.splice(index, 1);
      console.log(`Room deleted: ${roomName}`);
    }
  };

  io.on("connection", (socket: Socket) => {
    console.log(
      `Client connected ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`,
    );

    // Handle socket errors
    socket.on("error", (err: Error) => {
      console.error(`Socket error (${socket.id}):`, err);
    });

    // Initialize room for a client
    socket.on("init", (roomName: string) => {
      const room = findRoom(roomName);
      if (room) {
        socket.emit("init", room.messages);
      } else {
        socket.emit("init", []); // Send empty array if room doesn't exist
      }
    });

    // Check if a room exists
    socket.on("roomExists", (roomName: string) => {
      const exists = io.sockets.adapter.rooms.has(roomName);
      socket.emit("roomExists", exists ? "true" : "false");
    });

    // Handle messages in a room
    socket.on("messageRoom", (roomName: string, msg: string) => {
      let room = findRoom(roomName);
      if (!room) {
        room = { roomName, messages: [] };
        db.push(room);
      }
      room.messages.push(msg);
      console.log(`Message in room ${roomName}: ${msg}`);
      io.to(roomName).emit("message", msg);
    });

    // Create a new room
    socket.on("createRoom", () => {
      let roomName = generateHex();
      while (io.sockets.adapter.rooms.has(roomName)) {
        roomName = generateHex(); // Ensure the room name is unique
      }
      socket.join(roomName);
      const room = { roomName, messages: [] };
      db.push(room);
      socket.emit("createRoom", roomName);
      console.log(`${socket.id} created and joined room: ${roomName}`);
      io.to(roomName).emit(
        "arrSocketRoom",
        io.sockets.adapter.rooms.get(roomName)?.size || 0,
      );
      io.emit("arrSocket", io.engine.clientsCount);
    });

    socket.on("arrSocketRoom", (roomName: string) => {
      io.to(roomName).emit(
        "arrSocketRoom",
        io.sockets.adapter.rooms.get(roomName)?.size || 0,
      );
    });

    // Join an existing room
    socket.on("joinRoom", (roomName: string) => {
      if (io.sockets.adapter.rooms.has(roomName)) {
        socket.join(roomName);
        const room = findRoom(roomName);
        socket.emit("init", room?.messages || []);
        console.log(`${socket.id} joined room: ${roomName}`);
        io.to(roomName).emit(
          "arrSocketRoom",
          io.sockets.adapter.rooms.get(roomName)?.size || 0,
        );
        io.emit("arrSocket", io.engine.clientsCount);
        socket.emit("joinRoom", "Room joined");
      } else {
        socket.emit("joinRoom", "Room does not exist", "error");
      }
    });

    // Leave a room
    socket.on("leaveRoom", (roomName: string) => {
      socket.leave(roomName);
      console.log(`${socket.id} left room: ${roomName}`);
      io.to(roomName).emit(
        "arrSocketRoom",
        io.sockets.adapter.rooms.get(roomName)?.size || 0,
      );

      // Delete the room if it's empty
      const roomSize = io.sockets.adapter.rooms.get(roomName)?.size || 0;
      if (roomSize === 0) {
        deleteRoom(roomName);
      }
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log(
        `Client disconnected ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`,
      );

      // Clean up rooms when a client disconnects
      const rooms = Array.from(socket.rooms);
      rooms.forEach((roomName) => {
        if (roomName !== socket.id) {
          const roomSize = io.sockets.adapter.rooms.get(roomName)?.size || 0;
          if (roomSize === 0) {
            deleteRoom(roomName);
          }
        }
      });
    });
  });

  console.log("Socket server initialized");
  return io;
};
