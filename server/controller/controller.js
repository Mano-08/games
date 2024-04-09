const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const { validateToken } = require("../middleware/validateToken");
require("dotenv").config();

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExistsQuery = `SELECT * FROM users WHERE username='${username}'`;
    const userResult = await pool.query(userExistsQuery);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "invaliduser" });
    }
    const user = userResult.rows[0];
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result) {
        const token = jwt.sign({ userId: username }, process.env.JWTSECRETKEY, {
          expiresIn: "30d",
        });
        res.status(200).json({ token });
      } else {
        res.status(400).json({ message: "invalidpassword" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const results = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE username='${username}')`
    );
    if (results.rows[0].exists) {
      return res.status(400).json({ message: "userexists" });
    } else {
      bcrypt.genSalt(11, async function (err, salt) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
          }
          const insertUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hash}');`;
          const insertScoreQuery_battleship = `INSERT INTO battleship (username, score) VALUES ('${username}', 0);`;
          const insertScoreQuery_whackaplane = `INSERT INTO whackaplane (username, score) VALUES ('${username}', 0);`;

          await pool.query(insertUserQuery);
          await pool.query(insertScoreQuery_battleship);
          await pool.query(insertScoreQuery_whackaplane);
          const token = jwt.sign(
            { userId: username },
            process.env.JWTSECRETKEY,
            {
              expiresIn: "30d",
            }
          );

          res.status(200).json({ token });
        });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatescore_battleship = async (req, res) => {
  try {
    const { token, score } = req.body;
    validateToken(token, async (err, response) => {
      if (err) {
        res.status(401).json({ message: "invalidToken" });
      } else {
        const { userId } = response;
        const updateScoreQuery = `UPDATE battleship SET score = ${score} WHERE username='${userId}'`;
        await pool.query(updateScoreQuery);
        res.status(200).json({ message: "scoreupdated" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getscore_whackaplane = async (req, res) => {
  try {
    const { token } = req.body;
    validateToken(token, async (err, response) => {
      if (err) {
        res.status(401).json({ message: "invalidToken" });
      } else {
        const { userId } = response;
        const getScoreQuery = `SELECT score FROM whackaplane WHERE username='${userId}'`;
        const result = await pool.query(getScoreQuery);
        const score = result.rows[0].score;
        res.status(200).json({ highScore: score });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatescore_whackaplane = async (req, res) => {
  try {
    const { token, score } = req.body;
    validateToken(token, async (err, response) => {
      if (err) {
        res.status(401).json({ message: "invalidToken" });
      } else {
        const { userId } = response;
        const updateScoreQuery = `UPDATE whackaplane SET score = ${score} WHERE username='${userId}'`;

        await pool.query(updateScoreQuery);
        res.status(200).json({ message: "scoreupdated" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signin,
  signup,
  updatescore_battleship,
  getscore_whackaplane,
  updatescore_whackaplane,
};
