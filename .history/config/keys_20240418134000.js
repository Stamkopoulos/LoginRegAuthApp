const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MongoURI: process.env.MONGODB_URI,
};
