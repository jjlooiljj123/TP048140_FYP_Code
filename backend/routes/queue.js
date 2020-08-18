const express = require("express");

const isAuth = require("../middleware/is-auth");
//const shopValidation = require("../validation/shopValidation");
const queueController = require("../controllers/queue");

const router = express.Router();

// for shop owner to create the plan for queuing
// http://localhost:8080/queue/queuePlan/:shopId
router.post("/queuePlan/:shopId", queueController.createQueuePlan);

// to retrieve the queue plan of a shop
// http://localhost:8080/queue/queuePlan/:shopId
// router.get("/queuePlan/:shopId", queueController.getQueuePlan);

// for customer/staff to place a queue
// http://localhost:8080/queue/customerQueue/:shopId
router.post("/customerQueue/:shopId", isAuth, queueController.createQueue);

// to retrieve all queues with conditions of a specific customer
// http://localhost:8080/queue/customerQueue/?condition=condition&&page=page
router.get("/customerQueue", isAuth, queueController.getCustomerQueues);

//to retrieve a specific queue of a customer
// http://localhost:8080/queue/customerQueue/:queueId
router.get("/customerQueue/:queueId", queueController.getQueue);

// to retrieve all the queues with conditions of a shop
// http://localhost:8080/queue/shopQueues/:shopId/?condition=condition&&stage=stage&&page=page
router.get("/shopQueues/:shopId", queueController.getShopQueues);

// update queue info
// this is usually called when a customer is being called to be served, customer cancelled the queue, customer been skipped, and customer been accepted
// http://localhost:8080/queue/customerQueues/:queueId/?action=action
router.put("/customerQueues/:queueId", isAuth, queueController.updateQueue);

module.exports = router;
