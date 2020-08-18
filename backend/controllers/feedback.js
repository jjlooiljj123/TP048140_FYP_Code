const Queue = require("../models/Queue");
const Feedback = require("../models/Feedback");

// create feedback after queueing
// http://localhost:8080/feedback/:queueId
exports.createFeedback = async (req, res, next) => {
  const queuId = req.params.queueId;
  try {
    const queue = await Queue.findById(queuId);
    if (!queue) {
      const error = new Error("Could not find queue.");
      error.statusCode = 404;
      return next(error);
    }

    const feedback = new Feedback({
      feedback_rating: req.body.rating,
      feedback_message: req.body.message,
      feedback_shopId: queue.shop,
      feedback_customer: queue.customer,
    });

    const result = await feedback.save();
    queue.queue_feedback = result;
    await queue.save();

    res.status(200).json({
      message: "Feedback Submitted.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all feedbacks for a shop
// http://localhost:8080/feedback/:shopId
exports.getShopFeedbacks = async (req, res, next) => {
  const shopId = req.param.shopId;
  const currentPage = req.query.page || 1;
  const shopPerPage = 5;
  try {
    const totalFeedbacks = await Feedback.find({
      feedback_shopId: shopId,
    }).countDocuments();
    const feedbacks = await Feedback.find({ feedback_shopId: shopId })
      .sort({
        feedback_date: -1,
      })
      .skip((currentPage - 1) * shopPerPage)
      .limit(shopPerPage);

    res.status(200).json({
      message: "Feedbacks fetched.",
      totalFeedbacks: totalFeedbacks,
      feedbacks: feedbacks,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
