const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

userRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response.status(400).json({ error: "username or password missing" });
  }

  if (body.username.length < 3 || body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "username or password too short" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

userRouter.post("/login", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET_KEY);

  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = userRouter;
