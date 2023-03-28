const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://shraja7:321456987s@cluster0.zfxms6d.mongodb.net/testBlogsApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "CSS is hard",
  author: "John Doe",
  url: "https://johndoe.com/blog/css-is-hard",
  likes: 10,
});

blog.save().then((result) => {
  console.log("blog saved!");
  mongoose.connection.close();
});
/*
Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})*/
