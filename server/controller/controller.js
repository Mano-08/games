const { getClient } = require("../db/get-client");
const hashPassword = require("../utils/hash-passwords");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    console.log("wef");
  } catch (error) {
    console.log("console.lgreg");
  }
};

const register = async (req, res) => {
  console.log("received regeister req");

  try {
    const db = await getClient();

    const { email, password } = req.body;

    const searchUserQuery = `
    SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE email = '${email}'
    );
    `;

    const userExists = await db.query(searchUserQuery);

    if (userExists) {
      res.status(200).json({ error: true, message: "email already taken" });
    } else {
      const hashedPassword = await hashPassword(password);
      const insertUserQuery = `
        INSERT INTO users (email, password)
        VALUES ('${email}', '${hashedPassword}');
    `;
      const { rows } = await db.query(insertUserQuery);
      const userId = rows[0].id;

      const token = jwt.sign({ userId }, process.env.JWTSECRETKEY, {
        expiresIn: "30d",
      });

      res
        .status(200)
        .json({ error: false, token, message: "registered successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  login,
  register,
};
