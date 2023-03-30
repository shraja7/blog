require("dotenv").config({ path: "../.env" }); // loads .env file into process.env
//test if .env file is loaded
// console.log("MONGODB_URI from config.js: ", process.env.MONGODB_URI);
// console.log("TEST_MONGODB_URI from config.js: ", process.env.TEST_MONGODB_URI);

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const PORT = process.env.PORT; // http port

console.log("MONGODB_URI from config.js: ", MONGODB_URI);

module.exports = {
  MONGODB_URI,
  PORT,
};
