const mongoose = require("mongoose");
require("dotenv").config();

const Connection = mongoose
  .connect(process.env.MONGODB_URl)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Error In Connection");
    return false;
  });

module.exports = Connection;
