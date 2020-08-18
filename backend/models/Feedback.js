const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new mongoose.Schema({
  feedback_rating: {
    type: Number,
  },
  feedback_message: {
    type: String,
  },
  feedback_shopId: {
    type: String,
  },
  feedback_date: {
    type: Date,
    default: Date.now,
  },
  feedback_customer: {
    type: String,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
