const express = require("express");
const router = require("./routes/router");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db/pool");
const cookieParser = require("cookie-parser");

const { getClient } = require("./db/pool");

const cors = require("cors");
const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/hello/:id", (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: { error: "none", text: "hello" } });
});

io.on("connection", (socket) => {
  socket.on("join", ({ room, playerId }) => {
    const clients = io.sockets.adapter.rooms.get(room);
    if (!clients || clients.size < 2) {
      socket.join(room);
      io.sockets.adapter.rooms.get(room).size === 1 &&
        io.to(room).emit("playerJoined", { timeline: "first", playerId, room });
      io.sockets.adapter.rooms.get(room).size === 2 &&
        io
          .to(room)
          .emit("playerJoined", { timeline: "second", playerId, room });
    } else {
      socket.emit("full", room);
    }
  });
  socket.on("youWon", (data) => {
    console.log(data);
    io.to(data.room).emit("youWon", data);
  });
  socket.on("ready", (data) => {
    io.to(data.room).emit("ready", data);
  });
  socket.on("dropTorpedo", (data) => {
    io.to(data.room).emit("dropTorpedo", data);
  });
});

server.listen(PORT, async (req, res) => {
  console.log(`Listening to port ${PORT}`);

  let createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
    password VARCHAR(80) NOT NULL
  );
  `;

  await pool.query(createTableQuery);
});

app.use("/api", router);
