const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Blog post 1",
    author: "Author 1",
    url: "http://example.com/1",
    likes: 10,
  },
  {
    title: "Blog post 2",
    author: "Author 2",
    url: "http://example.com/2",
    likes: 5,
  },
  {
    title: "Blog post 3",
    author: "Author 3",
    url: "http://example.com/3",
    likes: 3,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "willremovethissoon",
    url: "willremovethissoon",
    likes: 0,
  });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
