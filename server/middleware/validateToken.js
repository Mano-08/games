const jwt = require("jsonwebtoken");

module.exports.validateToken = async (token, callback) => {
  if (!token) {
    callback("InvalidToken");
  } else {
    jwt.verify(token, process.env.JWTSECRETKEY, (err, response) => {
      if (err) {
        callback("InvalidToken");
      } else {
        callback(null, response);
      }
    });
  }
};
