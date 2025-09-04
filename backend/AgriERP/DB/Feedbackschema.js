const Connection = require("./Connect");
const { ObjectId } = require("mongodb");

const mongoose = require("mongoose");
if (!Connection) {
  console.log("Database Connection Failed");
  return;
}

const FeedbackSchema = new mongoose.Schema(
  {
    farmer_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    primary_use: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
