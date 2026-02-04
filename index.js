const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store message history
let messages = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Send old messages when user joins
  socket.emit("messageHistory", messages);

  // Receive message from client
  socket.on("sendMessage", (data) => {
    messages.push(data);

    // Broadcast message to all users
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});