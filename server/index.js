const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./utils/config");

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

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//export app for testing
module.exports = app;
