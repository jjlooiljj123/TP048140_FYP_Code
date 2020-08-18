const express = require("express");

const isAuth = require("../middleware/is-auth");
//const shopValidation = require("../validation/shopValidation");
const shopActivityController = require("../controllers/shopActivity");

const router = express.Router();

// get all shop activities
// http://localhost:8080/shopActivity/allActivities/:shopId/?stage=stage
router.get(
  "/allActivities/:shopId",
  shopActivityController.getAllShopActivities
);

// get specific shop activitiy
// http://localhost:8080/shopActivity/:activityId
router.get("/:activityId", shopActivityController.getShopActivity);

module.exports = router;
