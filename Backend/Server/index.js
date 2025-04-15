require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

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



app.post("/create-user", async (req, res) => {
  const { email, password, username, name } = req.body;
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, name },
    });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
