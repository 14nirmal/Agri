const express = require("express");
const Router = express.Router();

const { ObjectId, Timestamp } = require("mongodb");
const isAuthorized = require("../Auth");

const Feedback = require("../../DB/Feedbackschema");
const signupModel = require("../../DB/SignupSchema");
const FeedBackRoute = Router.post(
  "/api/feedback/add",
  isAuthorized,
  async (req, res) => {
    try {
      const { rating, primary_use, feedback } = req.body;
      const { id } = req.body;

      const farmer_data = await signupModel.findById(new ObjectId(id));
      const { first_name, last_name, phone_number } = farmer_data;
      if (!rating || !primary_use || !feedback) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      const newFeedback = new Feedback({
        farmer_name: first_name + " " + last_name,
        phone_number,
        rating,
        primary_use,
        feedback,
      });
      await newFeedback.save();

      res.status(200).json({ msg: "Feedback submitted successfully" });
    } catch (error) {
      console.error(" Error submitting feedback:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

const showFeedBackRotes = Router.get("/api/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = { FeedBackRoute, showFeedBackRotes };
