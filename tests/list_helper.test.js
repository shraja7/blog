const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

//describe block for testing totalLikes
describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the likes of that blog", () => {
    const blogs = [
      {
        title: "Blog post 1",
        author: "Author 1",
        url: "http://example.com/1",
        likes: 10,
      },
    ];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(10);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
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
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(18);
  });
});
