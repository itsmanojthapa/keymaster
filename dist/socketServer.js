"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
// In-memory database for rooms
const db = [{ roomName: "home", messages: [] }];
// Generate a random hex string for room names
const generateHex = () => {
    return Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, "0");
};
// Initialize Socket.IO server
const initSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*", // Update as needed
            credentials: true,
        },
    });
    // Helper function to find a room in the database
    const findRoom = (roomName) => {
        return db.find((room) => room.roomName === roomName);
    };
    // Helper function to delete a room from the database
    const deleteRoom = (roomName) => {
        const index = db.findIndex((room) => room.roomName === roomName);
        if (index !== -1) {
            db.splice(index, 1);
            console.log(`Room deleted: ${roomName}`);
        }
    };
    io.on("connection", (socket) => {
        console.log(`Client connected ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`);
        // Handle socket errors
        socket.on("error", (err) => {
            console.error(`Socket error (${socket.id}):`, err);
        });
        // Initialize room for a client
        socket.on("init", (roomName) => {
            const room = findRoom(roomName);
            if (room) {
                socket.emit("init", room.messages);
            }
            else {
                socket.emit("init", []); // Send empty array if room doesn't exist
            }
        });
        // Check if a room exists
        socket.on("roomExists", (roomName) => {
            const exists = io.sockets.adapter.rooms.has(roomName);
            socket.emit("roomExists", exists ? "true" : "false");
        });
        // Handle messages in a room
        socket.on("messageRoom", (roomName, msg) => {
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
            var _a;
            let roomName = generateHex();
            while (io.sockets.adapter.rooms.has(roomName)) {
                roomName = generateHex(); // Ensure the room name is unique
            }
            socket.join(roomName);
            const room = { roomName, messages: [] };
            db.push(room);
            socket.emit("createRoom", roomName);
            console.log(`${socket.id} created and joined room: ${roomName}`);
            io.to(roomName).emit("arrSocketRoom", ((_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0);
            io.emit("arrSocket", io.engine.clientsCount);
        });
        socket.on("arrSocketRoom", (roomName) => {
            var _a;
            io.to(roomName).emit("arrSocketRoom", ((_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0);
        });
        // Join an existing room
        socket.on("joinRoom", (roomName) => {
            var _a;
            if (io.sockets.adapter.rooms.has(roomName)) {
                socket.join(roomName);
                const room = findRoom(roomName);
                socket.emit("init", (room === null || room === void 0 ? void 0 : room.messages) || []);
                console.log(`${socket.id} joined room: ${roomName}`);
                io.to(roomName).emit("arrSocketRoom", ((_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0);
                io.emit("arrSocket", io.engine.clientsCount);
                socket.emit("joinRoom", "Room joined");
            }
            else {
                socket.emit("joinRoom", "Room does not exist", "error");
            }
        });
        // Leave a room
        socket.on("leaveRoom", (roomName) => {
            var _a, _b;
            socket.leave(roomName);
            console.log(`${socket.id} left room: ${roomName}`);
            io.to(roomName).emit("arrSocketRoom", ((_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0);
            // Delete the room if it's empty
            const roomSize = ((_b = io.sockets.adapter.rooms.get(roomName)) === null || _b === void 0 ? void 0 : _b.size) || 0;
            if (roomSize === 0) {
                deleteRoom(roomName);
            }
        });
        // Handle client disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected ID: ${socket.id} | Total clients: ${io.engine.clientsCount}`);
            // Clean up rooms when a client disconnects
            const rooms = Array.from(socket.rooms);
            rooms.forEach((roomName) => {
                var _a;
                if (roomName !== socket.id) {
                    const roomSize = ((_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size) || 0;
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
exports.initSocket = initSocket;
