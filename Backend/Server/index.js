require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
require("dotenv").config();

// Application
const app = express();
app.use(cors());
app.use(express.json());

// Server
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Servern körs på http://localhost:3000");
});
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // ändra till React-porten
  methods: ["GET", "POST"], // Allowing GET/POST methods (might add more later)
});

io.on("connection", (socket) => {
  console.log("User connected ", socket.id); // Log the socket ID of the connected user

  // Listen for "send_message" events from the connected client
  socket.on("send_message", (data) => {
    console.log("Message Received ", data); // Log the received message data

    // Emit the received message data to all connected clients
    io.emit("receive_message", data);
  });
});

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
