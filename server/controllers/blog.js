const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authentication");
const Blog = require("../models/blog");
const User = require("../models/user");

// get all blogs
router.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", {
      username: 1,
      name: 1,
      id: 1,
    })
    .select("-__v");

  response.json(
    blogs.map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user,
      };
    })
  );
});

// create a new blog post
router.post("/", authenticateToken, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
    user: request.userId,
  });

  try {
    const savedBlog = await blog.save();
    console.log("savedBlog:", savedBlog);

    const user = await User.findById(request.userId);
    console.log("user:", user);

    user.blogs.push(savedBlog._id);
    const savedUser = await user.save();
    console.log("savedUser:", savedUser);

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
router.delete("/:id", authenticateToken, async (request, response) => {
  const blogId = request.params.id;
  const userId = request.userId;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== userId) {
    return response.status(401).json({ error: "unauthorized user" });
  }

  await Blog.findByIdAndRemove(blogId);

  response.status(204).end();
});

//route for updating a blog post
router.put("/:id", async (request, response) => {
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

module.exports = router;
