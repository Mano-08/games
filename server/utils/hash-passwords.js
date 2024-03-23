const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      return hash;
    });
  });
};

module.exports = hashPassword;
