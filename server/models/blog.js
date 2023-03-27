const mongoose = require("mongoose");
const mongoose2 = require("mongoose");
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = mongoose2.model("Blog", blogSchema);
