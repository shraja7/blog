const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");

const api = supertest(app);

describe("blog API", () => {
  test("returns the correct amount of blog posts in the JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(4);
  });
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
