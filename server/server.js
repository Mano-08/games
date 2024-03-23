const express = require("express");
const router = require("./routes/router");
const bodyParser = require("body-parser");
const { getClient } = require("./db/get-client");

const app = express();
bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/api/hello/:id", (req, res) => {
  console.log(req);
  res.status(200).json({ message: { error: "none", text: "hello" } });
});

app.listen(PORT, async (req, res) => {
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
