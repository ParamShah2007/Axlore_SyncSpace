const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "SyncSpace Backend is running",
  });
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join collaborative room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    console.log(`${socket.id} joined room: ${roomId}`);

    socket.emit("room-joined", {
      roomId: roomId,
      message: `Successfully joined room ${roomId}`,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`SyncSpace server running on http://localhost:${PORT}`);
});