const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const helper = require("./test_helper");
const Blog = require("../models/blog"); // Import the Blog model

const api = supertest(app);

describe("blog API", () => {
  // Add the beforeEach block to set up the test database
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const blogPromises = blogObjects.map((blog) => blog.save());
    await Promise.all(blogPromises);
  });

  test("returns the correct amount of blog posts in the JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(3);
  });

  test("the unique identifier property is named id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Blog post 6",
      author: "Author 6",
      url: "http://example.com/6",
      likes: 6,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("Blog post 6");

    const authors = blogsAtEnd.map((blog) => blog.author);
    expect(authors).toContain("Author 6");
  });

  // Add the test for the default value of likes, should default to 0
  test("missing likes property defaults to 0", async () => {
    const newBlog = {
      title: "Blog with missing likes",
      author: "Author with missing likes",
      url: "http://example.com/missing-likes",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
