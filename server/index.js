const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./utils/config");
const bcrypt = require("bcrypt");
const User = require("./models/user");

const mongoUrl = config.MONGODB_URI;

//middleware
app.use(cors());
app.use(express.json());

//connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

//post a new blog to the database

app.post("/api/blogs", (request, response) => {
  const blogData = request.body;

  if (!blogData.title || !blogData.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  if (blogData.likes === undefined) {
    blogData.likes = 0;
  }

  const blog = new Blog(blogData);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

// delete a blog post
app.delete("/api/blogs/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

//route for updating a blog post
app.put("/api/blogs/:id", async (request, response) => {
  const { id } = request.params;
  const blogData = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, {
      new: true,
    });
    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.error(error);
    response.status(400).send({ error: "malformed id" });
  }
});

//----------------------------------------------------------------
//ROUTE FOR ADDING A USER TO THE DATABASE
//----------------------------------------------------------------
// create a new user
app.post("/api/users", async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response.status(400).json({ error: "username or password missing" });
  }

  if (body.username.length < 3 || body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "username or password too short" });
  }

  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
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

//route for getting all users
// get all users
app.get("/api/users", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//export app for testing
module.exports = app;
