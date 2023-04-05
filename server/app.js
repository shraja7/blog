const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const bcrypt = require("bcrypt");

const Blog = require("./models/blog");
const User = require("./models/user");

const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const authenticateToken = require("./middleware/authentication");

const mongoUrl = config.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use("/api/login", loginRouter);

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
