const express = require("express");
const router = require("./routes/router");
const bodyParser = require("body-parser");
const http = require("http");
const socketio = require("socket.io");

const { getClient } = require("./db/get-client");

const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/hello/:id", (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: { error: "none", text: "hello" } });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("join", (room) => {
    const clients = io.sockets.adapter.rooms.get(room);
    if (!clients || clients.size < 2) {
      socket.join(room);
      socket.emit("joined", room);
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("move", (data) => {
    io.to(data.room).emit("move", data);
  });
});

server.listen(PORT, async (req, res) => {
  console.log(`Listening to port ${PORT}`);
  const db = await getClient();

  let createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  `;

  const output = await db.query(createTableQuery);
});

app.use("/api", router);
