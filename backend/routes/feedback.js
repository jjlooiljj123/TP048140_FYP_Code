const express = require("express");

const isAuth = require("../middleware/is-auth");
//const shopValidation = require("../validation/shopValidation");
const feedbackController = require("../controllers/feedback");

const router = express.Router();

// create feedback after queueing
// http://localhost:8080/feedback/:queueId
router.post("/:queueId", feedbackController.createFeedback);

// get all feedbacks for a shop
// http://localhost:8080/feedback/:shopId
router.get("/:shopId", feedbackController.getShopFeedbacks);

module.exports = router;
