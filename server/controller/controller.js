const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
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
        res.cookie("authtoken", token, { httpOnly: true });
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
          await pool.query(insertUserQuery);

          const token = jwt.sign(
            { userId: username },
            process.env.JWTSECRETKEY,
            {
              expiresIn: "30d",
            }
          );

          res.cookie("authtoken", token, { httpOnly: true });
          res.status(200).json({ token });
        });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  signin,
  signup,
};
