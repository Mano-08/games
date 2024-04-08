const express = require("express");
const router = require("./routes/router");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db/pool");
const cookieParser = require("cookie-parser");
const { validateToken } = require("./middleware/validateToken");

const cors = require("cors");
const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  socket.on("join", ({ room, playerId, token }) => {
    validateToken(token, async function (err, response) {
      if (err) {
        socket.emit("invalidtoken");
      } else {
        const getScoreQuery = `SELECT score FROM battleship WHERE username='${response.userId}'`;
        const result = await pool.query(getScoreQuery);
        const score = result.rows[0].score;
        const clients = io.sockets.adapter.rooms.get(room);
        if (!clients || clients.size < 2) {
          socket.join(room);
          io.sockets.adapter.rooms.get(room).size === 1 &&
            io.to(room).emit("playerJoined", {
              timeline: "first",
              playerId,
              room,
              score,
            });
          io.sockets.adapter.rooms.get(room).size === 2 &&
            io.to(room).emit("playerJoined", {
              timeline: "second",
              playerId,
              room,
              score,
            });
        } else {
          socket.emit("full", room);
        }
      }
    });
  });

  socket.on("oneShipDown", ({ room, playerId, shipId }) => {
    io.to(room).emit("oneShipDown", { playerId, shipId });
  });
  socket.on("leaveRoom", ({ room, username }) => {
    socket.leave(room);
    console.log(username);
    const roomExists = io.sockets.adapter.rooms.has(room);
    const clientsInRoom = roomExists
      ? io.sockets.adapter.rooms.get(room).size
      : 0;
    if (clientsInRoom === 1) io.to(room).emit("playerLeft", { username });
  });
  socket.on("youWon", (data) => {
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

  const createBattleshipTable = `
  CREATE TABLE IF NOT EXISTS battleship (
    username VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
    score INT NOT NULL
  );
  `;
  await pool.query(createBattleshipTable);

  const createWhackAPlaneTable = `
  CREATE TABLE IF NOT EXISTS whackaplane (
    username VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
    score INT NOT NULL
  );
  `;
  await pool.query(createWhackAPlaneTable);
});

app.use("/api", router);
