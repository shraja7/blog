const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, config.SECRET_KEY, (err, user) => {
    if (err) {
      console.log(`Error verifying JWT: ${err}`);
      return res.sendStatus(403);
    }
    req.user = user;
    req.userId = user.id;

    console.log(`Authenticated user: ${JSON.stringify(user)}`);
    next();
  });
};

module.exports = authenticateToken;
