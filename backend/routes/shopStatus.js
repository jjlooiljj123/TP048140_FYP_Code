const express = require("express");

const shopStatusController = require("../controllers/shopStatus");
const isAuth = require("../middleware/is-auth");
// const authValidation = require("../validation/authValidation");

const router = express.Router();

// filtering fucntion, based on directory and queue length
// http://localhost:8080/shopStatus/?directory=directory&queueLentgth=queueLength&page=page
router.get("/", shopStatusController.filterShopStatus);

// to retrieve a specific shop status info
// http://localhost:8080/shopStatus/:shopStatusId/?stage=stage
router.get("/:shopStatusId", shopStatusController.getShopStatus);

// edit shop open/clsoe and accept queue, reservation
// http://localhost:8080/shopStatus/shopAvailability/:shopStatusId
router.put(
  "/shopAvailability/:shopStatusId",
  shopStatusController.shopOpenCloseAcceptQueueReservation
);

// staff start or stop serving for an activity
// action = add / minus
// http://localhost:8080/shopStatus/servingStaff/:shopStatusId/?action=action&activityId=activityId
router.post(
  "/servingStaff/:shopStatusId",
  isAuth,
  shopStatusController.staffStartStopServing
);

// updat the time desired to clear the queue
// http://localhost:8080/shopStatus/queueTime/:shopId/?time=time
router.post("/queueTime/:shopId", shopStatusController.updateTimeToClearQueue);

module.exports = router;
