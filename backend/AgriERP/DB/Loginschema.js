const mongoose = require("mongoose");
const connect = require("./Connect");

const LoginSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const loginModel = mongoose.model("admin", LoginSchema);

module.exports = loginModel;
