const Connection = require("./Connect");
const mongoose = require("mongoose");
if (!Connection) {
  console.log("Database Connection Failed");

  return;
}
const signupScema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: false },
  phone_number: { type: Number, required: true },
  image_url: { type: String, required: false },
  password: { type: String, required: true },
  status: { type: String, default: "active" },
  passwordChangedAt: { type: Date, default: Date.now() },
});

const signupModel = mongoose.model("Farmer", signupScema);

module.exports = signupModel;
