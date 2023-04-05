const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");
const authentication = require("../middleware/authentication");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // Find user by username
  const user = await User.findOne({ username });

  // If user doesn't exist, respond with error
  if (!user) {
    return response.status(401).json({ error: "Invalid username or password" });
  }

  // Check if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  // If password is incorrect, respond with error
  if (!passwordCorrect) {
    return response.status(401).json({ error: "Invalid username or password" });
  }

  // If user exists and password is correct, generate JWT and send it to client
  const token = jwt.sign(
    { username: user.username, id: user._id },
    config.SECRET_KEY
  );
  response.status(200).json({ token });
});

// Use authentication middleware for protected routes
loginRouter.use(authentication);

module.exports = loginRouter;
