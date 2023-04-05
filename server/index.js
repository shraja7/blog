const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./utils/config");
const bcrypt = require("bcrypt");
const User = require("./models/user");
//import login router
const loginRouter = require("./controllers/login");
const authenticateToken = require("./middleware/authentication");

const mongoUrl = config.MONGODB_URI;

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/login", loginRouter);

//connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// get all blogs
app.get("/api/blogs", authenticateToken, async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

// create a new blog post
app.post("/api/blogs", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const user = await User.findOne({});
  if (!user) {
    return response.status(400).json({ error: "no users in database" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    await user.blogs.push(savedBlog._id);
    await user.save();
    const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
      username: 1,
      name: 1,
    });
    response.status(201).json(populatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
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
