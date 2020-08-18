const Queue = require("../models/Queue");
const ShopStatus = require("../models/ShopStatus");
const QueueStructure = require("../models/QueueStructure");
const ShopActivity = require("../models/ShopActivity");
const QueueData = require("../models/QueueData");
const User = require("../models/User");
const shopActivityController = require("../controllers/shopActivity");
const queueStructureController = require("../controllers/queueStructure");
const shopPerformanceController = require("../controllers/shopPerformance");
const serverPerformanceController = require("../controllers/serverPerformance");
const combinedPerformanceController = require("../controllers/combinedPerformance");
const queueLengthAndTimeCalculationController = require("../controllers/queueLengthAndTimeCalculation");
const io = require("../socket");

const {
  currentDateTime,
  todayDay,
  currentTimestamp,
  convertMillisecondToMinute,
  getDateFromDatetime,
} = require("../Utils/currentDateTime");

const { siceQueueNumber } = require("../Utils/queueNumberFormat");

const QUEUING = 1; //customer placed a queue and wait for their turns
const CALLED = 2; //customer turn reached after owner infor them
const ACCEPTED = 3; //customer shows up, owner accepted the queue
const SKIPPED = 4; //owner skip customer queue
const CANCELED = 5; //customer cancel the queue halfway
const NULL_DATA = null;

// create a queue planning for a shop, including the queue structure and the shop activity
// http://localhost:8080/queue/queuePlan/5eaae7e66843c736f45c8c70
exports.createQueuePlan = async (req, res, next) => {
  const shopId = req.params.shopId;
  const ownerId = req.userId;
  const queueDiscipline = req.body.queueDiscipline;
  const shopActivitiesArray = [];
  const strcuturesArray = [];
  const maxQueueLength = req.body.maxQueueLength;
  const timeLimitForCustomer = req.body.timeLimitForCustomer;

  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }

    // queue structure
    for (let i = 0; i < req.body.structures.length; i++) {
      const stageNumber = req.body.structures[i].stageNumber;
      const nameOfStage = req.body.structures[i].nameOfStage;
      const description = req.body.structures[i].description;
      const structures = await queueStructureController.createQueueStructure(
        stageNumber,
        nameOfStage,
        description,
        shopId
      );
      strcuturesArray.push(structures);
    }

    // shopActivities
    for (let i = 0; i < req.body.shopActivities.length; i++) {
      const structure = strcuturesArray[i];
      for (let j = 0; j < req.body.shopActivities[i].length; j++) {
        const activities = await shopActivityController.createShopActivity(
          req.body.shopActivities[i][j][0],
          req.body.shopActivities[i][j][1],
          req.body.shopActivities[i][j][2],
          structure._id,
          shopStatus._id,
          i + 1,
          req.body.shopActivities[i][j][3]
        );
        shopActivitiesArray.push(activities);
      }
    }

    // update the shop status (initially empty)
    shopStatus.shopStatus_queueDiscipline = queueDiscipline;
    shopStatus.shopStatus_queueStructures = strcuturesArray;
    shopStatus.shopStatus_shopActivities = shopActivitiesArray;
    shopStatus.shopStatus_maxQueueLength = maxQueueLength;
    shopStatus.shopStatus_timeLimitForCustomer = timeLimitForCustomer;
    shopStatus.shopStatus_hasQueuePlan = true;
    const result = await shopStatus.save();

    res.status(200).json({
      message: "Queue Plan Created",
      shopStatus: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// customer/staff places a queue for a shop
// http://localhost:8080/queue/customerQueue/5eaae7e66843c736f45c8c70
exports.createQueue = async (req, res, next) => {
  const customerId = req.userId; // can be other role oher than customer
  const customer = await User.findById(customerId); // can be other role oher than customer
  const shopId = req.params.shopId;
  const shopStatus = await ShopStatus.findById(shopId);
  const stage = req.body.queueStage;
  const shopActivityId = req.body.shopActivityId;
  const shopActivity = await ShopActivity.findById(shopActivityId);
  const currentDatetime = currentDateTime();
  const timsestampNow = currentTimestamp();
  try {
    // validate the shopStatus
    if (!shopStatus) {
      const error = new Error("Could not find shop.");
      error.statusCode = 404;
      return next(error);
    }
    // validate the shopActivity
    if (!shopActivity) {
      const error = new Error("Could not find shop activity.");
      error.statusCode = 404;
      return next(error);
    }
    // validate the customer
    if (!customer) {
      const error = new Error("Could not find User.");
      error.statusCode = 404;
      return next(error);
    }
    // customer can place 1 queue for 1 shop only, but the staff and owner can place a queue for multiple shop
    if (customer.user_role == "customer") {
      const alreadyHasQueueForThisShop = await Queue.find({
        queue_customer: customerId,
        queue_shop: shopId,
        queue_queueStatus: { $lt: 3 },
      });
      if (alreadyHasQueueForThisShop.length != 0) {
        const error = new Error("Already queued for this shop.");
        error.statusCode = 404;
        return next(error);
      }
    }

    // generate queue number whenever a customer place a queue
    const queueNumber = generateQueueNumber(
      shopStatus.shopStatus_currentQueueNumber
    );

    // the waiting length allocated for the person joining the queue (shop current queue length + 1)
    const newWaitingLength =
      (await queueLengthAndTimeCalculationController.stageOneLength(shopId)) +
      1;

    /* START CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */

    // the average time that the activity took
    let activityAverageTime = await queueLengthAndTimeCalculationController.activityAverageTime(
      shopActivityId,
      todayDay(),
      currentDatetime
    );

    // get the number of active servers in stage
    const activeServer = await serverPerformanceController.getNumberOfServersOfStageOne(
      shopId
    );

    // the number of server that serving the customer
    const numberOfBusyServer = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).countDocuments();

    // number of available server to serve customer at the moment
    const numberOfFreeServer = activeServer - numberOfBusyServer;

    console.log("activeServer:", activeServer);
    console.log("numberOfBusyServer:", numberOfBusyServer);
    console.log("numberOfFreeServer:", numberOfFreeServer);

    let timeSincePreviousQUeueServed;
    let estimatedWaitingTime;

    // when a person join a queue and there is server ready to serve that persoon
    if (newWaitingLength <= numberOfFreeServer) {
      // when there are free server which ready to server
      estimatedWaitingTime = 1; // etimated waiting time = 1 beacsue you can be called every single time
      console.log("enter if");
      //when the queue length is more than the number of free server
    } else if (newWaitingLength > numberOfFreeServer) {
      // when the servers are busy
      const currentlyServingQueue = await Queue.find({
        queue_shop: shopId,
        queue_stage: 1,
        queue_queueStatus: 2,
      }).sort({ queue_servedDateTime: 1 });

      // when there is no free server
      if (currentlyServingQueue.length >= activeServer) {
        // decide which server might serve the newly joined person
        let recordToBeRead = (newWaitingLength % activeServer) - 1; // -1 becasue of index
        if (recordToBeRead < 0) {
          // modulus = 0 means it will be served by the last server
          recordToBeRead = activeServer - 1; // last server index
        }

        // get the time left for the server to since start serving activity
        timeSincePreviousQUeueServed = convertMillisecondToMinute(
          currentTimestamp().getTime() -
            currentlyServingQueue[
              recordToBeRead
            ].queue_servedTimestamp.getTime()
        );

        activityAverageTime = await queueLengthAndTimeCalculationController.activityAverageTime(
          currentlyServingQueue[recordToBeRead].queue_activityId
        );

        // becasue the actual serving time might exceed the estimated serving time
        // if (timeSincePreviousQUeueServed < 1) {
        //   timeSincePreviousQUeueServed = 1;
        // }

        // get the time left for the server to fnish serving
        let timeLeftToCompletePreviousQueue =
          activityAverageTime - timeSincePreviousQUeueServed;

        // becasue the actual serving time might exceed the estimated serving time
        if (timeLeftToCompletePreviousQueue < 1) {
          timeLeftToCompletePreviousQueue = 1;
        }

        estimatedWaitingTime =
          timeLeftToCompletePreviousQueue +
          activityAverageTime * //weakness: for one activity one
            (Math.ceil(newWaitingLength / activeServer) - 1); //??? why -1, becasue to minus the "timeLeftToCompletePreviousQueue"
      } else {
        // // !!!!! logic not correct
        // // when there are free server, but still soeone queue in front of you
        // const queue = await Queue.find({
        //   queue_shop: shopId,
        //   queue_stage: 1,
        //   queue_queueStatus: 1,
        // }).sort({ queue_queueDateTime: -1 });
        // let recordToBeRead = (newWaitingLength % activeServer) - 1;
        // // previously i code like this, but dont know why
        // // if (recordToBeRead < 0) {
        // //   recordToBeRead = 0;
        // // }
        // if (recordToBeRead < 0) {
        //   // modulus = 0 means it will be served by the last server
        //   recordToBeRead = activeServer - 1; // last server index
        // }

        // // got issue, because didnt take the served person into account!!!
        // previousQueueWaitingTime =
        //   queue[recordToBeRead].queue_estimatedWaitingTime;
        // estimatedWaitingTime = previousQueueWaitingTime + activityAverageTime;

        // when there are free server, but still soeone queue in front of you
        const queue = await Queue.find({
          queue_shop: shopId,
          queue_stage: 1,
          queue_queueStatus: 1,
        }).sort({ queue_queueDateTime: -1 });

        const previousActivityAverageTime = await queueLengthAndTimeCalculationController.activityAverageTime(
          queue[0].queue_activityId,
          todayDay(),
          currentDatetime
        );

        previousQueueWaitingTime = queue[0].queue_estimatedWaitingTime;
        estimatedWaitingTime =
          previousQueueWaitingTime + previousActivityAverageTime;
      }
    }

    /* FINISH CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */

    // console.log("newWaitingLength:", newWaitingLength);
    // console.log("estimatedWaitingTime:", estimatedWaitingTime);
    const queue = new Queue({
      queue_shop: shopStatus._id,
      queue_customer: customerId,
      queue_queueNumber: queueNumber,
      queue_pax: req.body.pax,
      queue_description: req.body.description,
      queue_queueStatus: QUEUING,
      queue_waitingLength: newWaitingLength,
      queue_estimatedWaitingTime: estimatedWaitingTime,
      queue_activityId: shopActivity._id,
      queue_activity: shopActivity.shopActivity_activity,
      queue_priority: req.body.priority,
      queue_queueDiscipline: req.body.queueDiscipline,
      queue_stage: stage,
      queue_queueDateTime: currentDatetime,
      queue_queueTimestamp: timsestampNow,
      queue_dayOfWeek: todayDay(),
      queue_numberOfServer: activeServer,
    });
    const resultQueue = await queue.save(); // create a new queue

    // add queue length according to the activity
    shopActivity.shopActivity_queueLength =
      shopActivity.shopActivity_queueLength + 1;
    const resultShopActivity = await shopActivity.save();

    shopStatus.shopStatus_currentQueueNumber = queueNumber; // update latest queue number in the shop status model
    shopStatus.shopStatus_queueLength = shopStatus.shopStatus_queueLength + 1; // update the shop queue length in the shop status model
    if (stage == 1) {
      shopStatus.shopStatus_stageOneQueueLength =
        shopStatus.shopStatus_stageOneQueueLength + 1; // update the shop stage 1 queue length in the shop status model
    }
    shopStatus.shopStatus_systemLength = shopStatus.shopStatus_systemLength + 1; // add 1 into system length
    const resultShopStatus = await shopStatus.save(); // save the updated shop status data

    // create a new queue data whenever a queue is created
    const resultQueueData = await updateQueueData(
      newWaitingLength,
      stage,
      QUEUING,
      shopActivity.shopActivity_activity,
      shopActivity._id,
      NULL_DATA,
      customer._id,
      resultQueue._id,
      shopId,
      resultShopStatus.shopStatus_numberOfServer
    );

    queue.queue_queueData.push(resultQueueData); // push the created queue data into the queue data array in queue model
    queue.save();

    /* not yet compelted, calculate the system length */
    const shopPerformanceResult = await shopPerformanceController.createShopPerformance(
      shopStatus._id,
      newWaitingLength, // this is only for stage 1, how about other stage
      shopStatus.shopStatus_servingLength,
      shopStatus.shopStatus_systemLength
    );

    //Disabled at the moment, no particular reason, becasue customer queue can be queried in QUeue Model also
    // customer.queues.push(queue)
    // customer.save()

    /**DONE FOR CREATING QUEUE, THE LATER PART IS TO SEND BACK THE REQUEST WITH RELAVANT FORMAT THAT ACCEPTED BY THE FRONTEND */

    // just for sending back to the frontend for dispalying purpose
    const slicedQueueNumber = siceQueueNumber(resultQueue.queue_queueNumber);
    resultQueue.queue_queueNumber = slicedQueueNumber;

    let estimatedTimeByShop = await queueLengthAndTimeCalculationController.stageOneEstimatedTime(
      resultShopStatus._id,
      todayDay(),
      currentDateTime()
    );
    resultShopStatus.shopStatus_stageOneWaitingTime = estimatedTimeByShop;

    await combinedPerformanceController.warningToAddServerForStageOne(shopId);

    // io
    io.getIo().emit("queues", {
      action: "create",
      queue: resultQueue,
      shopStatus: resultShopStatus,
      shopId: resultShopStatus._id,
    });

    res.status(200).json({
      message: "Queue created successfully!",
      queue: resultQueue,
      shopStatus: resultShopStatus,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all queues of a customer (all, active, completed)
// http://localhost:8080/queue/customerQueue/?condition=condition&&page=page
exports.getCustomerQueues = async (req, res, next) => {
  const customerId = req.userId;
  const condition = req.query.condition || "all"; // all, active, completed
  const currentPage = req.query.page || 1;
  const shopPerPage = 9999;

  try {
    // get all queues of a customer
    // sort by queue number descending order
    if (condition == "all") {
      const totalAllQueues = await Queue.find({
        queue_customer: customerId,
      }).countDocuments();
      const allQueues = await Queue.find({ queue_customer: customerId })
        .sort({
          queue_queueNumber: -1,
        })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);

      for (let i = 0; i < totalAllQueues; i++) {
        let shopStatus = await ShopStatus.findById(allQueues[i].queue_shop);
        allQueues[i].queue_shopImageUrl = shopStatus.shopStatus_logoUrl;
        allQueues[i].queue_shopName = shopStatus.shopStatus_shopName;
        allQueues[i].queue_shopBranch = shopStatus.shopStatus_branch;

        const slicedQueueNumber = siceQueueNumber(
          allQueues[i].queue_queueNumber
        );
        allQueues[i].queue_queueNumber = slicedQueueNumber;
      }

      res.status(200).json({
        message: "customer all queues fetched",
        total: totalAllQueues,
        queues: allQueues,
      });
    }
    // get active queues of a customer
    // sort by queue number descending order
    else if (condition == "active") {
      const toalActiveQueues = await Queue.find({
        queue_customer: customerId,
        queue_queueStatus: { $gt: 0, $lt: 3 },
      }).countDocuments();
      const activeQueues = await Queue.find({
        queue_customer: customerId,
        queue_queueStatus: { $gt: 0, $lt: 3 },
      })
        .sort({ queue_estimatedWaitingTime: 1 })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);

      for (let i = 0; i < toalActiveQueues; i++) {
        let shopStatus = await ShopStatus.findById(activeQueues[i].queue_shop);
        activeQueues[i].queue_shopImageUrl = shopStatus.shopStatus_logoUrl;
        activeQueues[i].queue_shopName = shopStatus.shopStatus_shopName;
        activeQueues[i].queue_shopBranch = shopStatus.shopStatus_branch;

        const slicedQueueNumber = siceQueueNumber(
          activeQueues[i].queue_queueNumber
        );
        activeQueues[i].queue_queueNumber = slicedQueueNumber;
      }

      res.status(200).json({
        message: "customer active queues fetched",
        total: toalActiveQueues,
        queues: activeQueues,
      });
    }
    // get completed queues of a customer
    // sort by queue number descending order
    else if (condition == "completed") {
      const totalCompletedQueues = await Queue.find({
        queue_customer: customerId,
        queue_queueStatus: { $gt: 2 },
      }).countDocuments();
      const completedQueues = await Queue.find({
        queue_customer: customerId,
        queue_queueStatus: { $gt: 2 },
      })
        .sort({ queue_queueNumber: -1 })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);

      console.log("completedQueues", completedQueues);
      for (let i = 0; i < totalCompletedQueues; i++) {
        console.log("queuid", completedQueues[i]._id);
        let shopStatus = await ShopStatus.findById(
          completedQueues[i].queue_shop
        );
        completedQueues[i].queue_shopImageUrl = shopStatus.shopStatus_logoUrl;
        completedQueues[i].queue_shopName = shopStatus.shopStatus_shopName;
        completedQueues[i].queue_shopBranch = shopStatus.shopStatus_branch;

        const slicedQueueNumber = siceQueueNumber(
          completedQueues[i].queue_queueNumber
        );
        completedQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          completedQueues[i].queue_totalWaitingTime
        );
        console.log(
          "completedQueues[i].queue_totalWaitingTime1",
          completedQueues[i].queue_totalWaitingTime
        );
        completedQueues[i].queue_totalWaitingTime = totalWaitingTime;
        console.log(
          "completedQueues[i].queue_totalWaitingTime",
          completedQueues[i].queue_totalWaitingTime
        );

        completedQueues[i].queue_date = getDateFromDatetime(
          completedQueues[i].queue_queueDateTime
        );
      }

      res.status(200).json({
        message: "customer completed queues fetched",
        total: totalCompletedQueues,
        queues: completedQueues,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get a specific queue by id
// http://localhost:8080/queue/5eab0062d60b2a40b0e3ff12
exports.getQueue = async (req, res, next) => {
  const queueId = req.params.queueId;
  const queue = await Queue.findById(queueId);
  try {
    if (!queue) {
      const error = new Error("No queue found.");
      error.statusCode = 404;
      return next(error);
    }
    // averageTimeToServerACustomerBasedOnActivity()

    const slicedQueueNumber = siceQueueNumber(queue.queue_queueNumber);
    queue.queue_queueNumber = slicedQueueNumber;

    const totalWaitingTime = convertMillisecondToMinute(
      queue.queue_totalWaitingTime
    );
    queue.queue_totalWaitingTime = totalWaitingTime;

    queue.queue_date = getDateFromDatetime(queue.queue_queueDateTime);

    res.status(200).json({
      message: "Queue fetched.",
      queue: queue,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve all the queues with conditions of a shop (all, active, queuing, called, completed, serving)
// http://localhost:8080/queue/shopQueues/:shopId/?condition=condition&&stage=stage&&page=page
exports.getShopQueues = async (req, res, next) => {
  const shopId = req.params.shopId;
  const stageParam = req.query.stage || { $gt: 0 };
  const condition = req.query.condition || "all"; // all, active, completed
  const currentPage = req.query.page || 1;
  const shopPerPage = 50;
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    // get all queues of that shop
    if (condition == "all") {
      let allShopQueues;
      let shopQueues;
      allShopQueues = await Queue.find({
        queue_shop: shopId,
      }).countDocuments();
      // if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
      shopQueues = await Queue.find({ queue_shop: shopId })
        .sort({
          queue_stage: 1,
          queue_queueNumber: 1,
        })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);
      // }

      for (let i = 0; i < allShopQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(shopQueues.queue_queueNumber);
        shopQueues.queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopQueues.queue_totalWaitingTime
        );
        shopQueues.queue_totalWaitingTime = totalWaitingTime;

        shopQueues.queue_date = getDateFromDatetime(
          shopQueues.queue_queueDateTime
        );
      }

      res.status(200).json({
        message: "all queues fetched - FIFO",
        numberOfShopQueues: allShopQueues,
        shopQueues: shopQueues,
      });
    }
    // get queues to be processed of that shop
    // based on queue discipline (the order to show)
    else if (condition == "active") {
      console.log("enter active");
      let allShopActiveQueues;
      let shopActiveQueues;
      allShopActiveQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: { $gt: 0, $lt: 3 },
      }).countDocuments();
      // if its first-in-first-out, then sort by the queue number and stage in ascending order
      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopActiveQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: { $gt: 0, $lt: 3 },
        })
          .sort({ queue_queueNumber: 1, stage: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      // if its priority queuing, then sort by the stage, priority, queue number in ascending order
      else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopActiveQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: { $gt: 0, $lt: 3 },
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }

      for (let i = 0; i < allShopActiveQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(
          shopActiveQueues[i].queue_queueNumber
        );
        shopActiveQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopActiveQueues[i].queue_totalWaitingTime
        );
        shopActiveQueues[i].queue_totalWaitingTime = totalWaitingTime;

        shopActiveQueues[i].queue_date = getDateFromDatetime(
          shopActiveQueues[i].queue_queueDateTime
        );
      }
      res.status(200).json({
        message: `active queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopActiveQueues,
        shopQueues: shopActiveQueues,
      });
    } else if (condition == "queuing") {
      let allShopQueuingQueues;
      let shopQueuingQueues;
      allShopQueuingQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: 1,
      }).countDocuments();
      // if its first-in-first-out, then sort by the queue number and stage in ascending order
      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopQueuingQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: 1,
        })
          .sort({ queue_queueNumber: 1, stage: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      // if its priority queuing, then sort by the stage, priority, queue number in ascending order
      else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopQueuingQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: 1,
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }

      for (let i = 0; i < allShopQueuingQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(
          shopQueuingQueues[i].queue_queueNumber
        );
        shopQueuingQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopQueuingQueues[i].queue_totalWaitingTime
        );
        shopQueuingQueues[i].queue_totalWaitingTime = totalWaitingTime;

        shopQueuingQueues[i].queue_date = getDateFromDatetime(
          shopQueuingQueues[i].queue_queueDateTime
        );
      }

      res.status(200).json({
        message: `active queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopQueuingQueues,
        shopQueues: shopQueuingQueues,
      });
    } else if (condition == "called") {
      let allShopCalledQueues;
      let shopCalledQueues;
      allShopCalledQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: 2,
      }).countDocuments();
      // if its first-in-first-out, then sort by the queue number and stage in ascending order
      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopCalledQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: 2,
        })
          .sort({ queue_queueNumber: 1, stage: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      // if its priority queuing, then sort by the stage, priority, queue number in ascending order
      else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopCalledQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: 2,
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }

      for (let i = 0; i < allShopCalledQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(
          shopCalledQueues[i].queue_queueNumber
        );
        shopCalledQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopCalledQueues[i].queue_totalWaitingTime
        );
        shopCalledQueues[i].queue_totalWaitingTime = totalWaitingTime;

        shopCalledQueues[i].queue_date = getDateFromDatetime(
          shopCalledQueues[i].queue_queueDateTime
        );
      }

      res.status(200).json({
        message: `active queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopCalledQueues,
        shopQueues: shopCalledQueues,
      });
    }
    // get completed queues of that shop
    // based on queue discipline (the order to show)
    else if (condition == "completed") {
      let allShopCompletedQueues;
      let shopCompletedQueues;
      allShopCompletedQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: { $gt: 2 },
      }).countDocuments();

      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopCompletedQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: { $gt: 2 },
        })
          .sort({ queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      } else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopCompletedQueues = await Queue.find({
          queue_shop: shopId,
          queue_stage: stageParam,
          queue_queueStatus: { $gt: 2 },
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }

      for (let i = 0; i < allShopCompletedQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(
          shopCompletedQueues[i].queue_queueNumber
        );
        shopCompletedQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopCompletedQueues[i].queue_totalWaitingTime
        );
        shopCompletedQueues[i].queue_totalWaitingTime = totalWaitingTime;

        shopCompletedQueues[i].queue_date = getDateFromDatetime(
          shopCompletedQueues[i].queue_queueDateTime
        );
      }
      res.status(200).json({
        message: `completed queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopCompletedQueues,
        shopQueues: shopCompletedQueues,
      });
    } else if (condition == "serving") {
      let allShopServingQueues;
      let shopServingQueues;
      allShopServingQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: 2,
      }).countDocuments();

      shopServingQueues = await Queue.find({
        queue_shop: shopId,
        queue_stage: stageParam,
        queue_queueStatus: 2,
      })
        .sort({ queue_stage: 1 })
        .skip((currentPage - 1) * shopPerPage)
        .limit(shopPerPage);

      for (let i = 0; i < allShopServingQueues; i++) {
        const slicedQueueNumber = siceQueueNumber(
          shopServingQueues[i].queue_queueNumber
        );
        shopServingQueues[i].queue_queueNumber = slicedQueueNumber;

        const totalWaitingTime = convertMillisecondToMinute(
          shopServingQueues[i].queue_totalWaitingTime
        );
        shopServingQueues[i].queue_totalWaitingTime = totalWaitingTime;

        shopServingQueues[i].queue_date = getDateFromDatetime(
          shopServingQueues[i].queue_queueDateTime
        );
      }
      res.status(200).json({
        message: `Serving queues fetched`,
        numberOfShopQueues: allShopServingQueues,
        shopQueues: shopServingQueues,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve all the queues with conditions of a shop
// http://localhost:8080/queue/shopActivityQueues/:activityId/?condition=condition&&page=page
exports.getShopQueuesByActivity = async (req, res, next) => {
  const activityId = req.params.activityId;
  const condition = req.query.condition || "active"; // all, active, completed
  const currentPage = req.query.page || 1;
  const shopPerPage = 50;
  try {
    const shopActivity = await ShopActivity.findById(activityId);
    if (!shopActivity) {
      const error = new Error("No shop activity found.");
      error.statusCode = 404;
      return next(error);
    }
    // get all queues of that activity
    if (condition == "all") {
      let allShopActivityQueues;
      let shopActivityQueues;
      allShopActivityQueues = await Queue.find({
        queue_activityId: activityId,
      }).countDocuments();
      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopActivityQueues = await Queue.find({ queue_activityId: activityId })
          .sort({
            queue_queueNumber: 1,
          })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      res.status(200).json({
        message: "all queues fetched - FIFO",
        numberOfShopQueues: allShopActivityQueues,
        shopQueues: shopActivityQueues,
      });
    }
    // get queues to be processed of that activity
    // based on queue discipline (the order to show)
    else if (condition == "active") {
      let allShopActivityActiveQueues;
      let shopActivityActiveQueues;
      allShopActivityActiveQueues = await Queue.find({
        queue_activityId: activityId,
        queue_queueStatus: { $gt: 0, $lt: 3 },
      }).countDocuments();
      // if its first-in-first-out, then sort by the queue number and stage in ascending order
      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopActivityActiveQueues = await Queue.find({
          queue_activityId: activityId,
          queue_queueStatus: { $gt: 0, $lt: 3 },
        })
          .sort({ queue_queueNumber: 1, stage: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      // if its priority queuing, then sort by the stage, priority, queue number in ascending order
      else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopActivityActiveQueues = await Queue.find({
          queue_activityId: activityId,
          queue_queueStatus: { $gt: 0, $lt: 3 },
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      res.status(200).json({
        message: `active queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopActivityActiveQueues,
        shopQueues: shopActivityActiveQueues,
      });
    }
    // get completed queues of that activity
    // based on queue discipline (the order to show)
    else if (condition == "completed") {
      let allShopActivityCompletedQueues;
      let shopActivityCompletedQueues;
      allShopActivityCompletedQueues = await Queue.find({
        queue_activityId: activityId,
        queue_queueStatus: { $gt: 2 },
      }).countDocuments();

      if (shopStatus.shopStatus_queueDiscipline == "FIFO") {
        shopActivityCompletedQueues = await Queue.find({
          queue_activityId: activityId,
          queue_queueStatus: { $gt: 2 },
        })
          .sort({ queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      } else if (shopStatus.shopStatus_queueDiscipline == "PQ") {
        shopActivityCompletedQueues = await Queue.find({
          queue_activityId: activityId,
          queue_queueStatus: { $gt: 2 },
        })
          .sort({ queue_stage: 1, queue_priority: 1, queue_queueNumber: 1 })
          .skip((currentPage - 1) * shopPerPage)
          .limit(shopPerPage);
      }
      res.status(200).json({
        message: `completed queues fetched - ${shopStatus.shopStatus_queueDiscipline}`,
        numberOfShopQueues: allShopActivityCompletedQueues,
        shopQueues: shopActivityCompletedQueues,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// update queue info
// this is usually called when a customer is being called to be served, customer cancelled the queue, customer been skipped, and customer been accepted
// http://localhost:8080/queue/customerQueues/5eabc41103933f195cf977c3/?action=xxxx
exports.updateQueue = async (req, res, next) => {
  const queueId = req.params.queueId;
  const userId = req.userId;
  let userRole = null;
  const action = req.query.action;
  let shopStatusResult = null;

  const currentShopActivityId = req.body.currentShopActivityId;
  const nextShopActivityId = req.body.nextShopActivityId;
  const stage = req.body.stage;

  try {
    //check the user exist to get the role of the user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("No User found!");
      error.statusCode = 404;
      return next(error);
    }
    userRole = user.user_role;

    //check if the queue exist
    const queue = await Queue.findById(queueId);
    if (!queue) {
      const error = new Error("No Queue found!");
      error.statusCode = 404;
      return next(error);
    }

    const shopStatus = await ShopStatus.findById(queue.queue_shop);
    if (!shopStatus) {
      const error = new Error("No Shop found!");
      error.statusCode = 404;
      return next(error);
    }
    let currentShopActivityObject = await ShopActivity.findById(
      currentShopActivityId
    );
    if (!currentShopActivityObject) {
      const error = new Error("No current shop activity!");
      error.statusCode = 404;
      return next(error);
    }
    let nextShopActivityObject;
    if (action == "proceed") {
      nextShopActivityObject = await ShopActivity.findById(nextShopActivityId);
      if (!nextShopActivityObject) {
        const error = new Error("No next shop activity!");
        error.statusCode = 404;
        return next(error);
      }
    }
    // const queueStructure = await QueueStructure.findById(stage);
    // if (!queueStructure) {
    //   const error = new Error("No stage found!");
    //   error.statusCode = 404;
    //   return next(error);
    // }

    let QUEUE_LENGTH_ARGUMENT = null;
    let STAGE_OF_THE_QUEUE_ARGUMENT = queue.queue_stage;
    let QUEUE_STATUS_ARGUMENT = null;
    let QUEUE_SERVER_ARGUMENT = null;
    let QUEUE_CUSTOMER_ARGUMENT = null;
    let QUEUE_QUEUEID_ARGUMENT = queueId;
    let SHOP_STATUS_ARGUMENT = null;
    let WAITING_LENGTH_OF_THE_QUEUE_ARGUMENT = queue.queue_waitingLength;
    let RES_MESSAGE = null;

    let activeServer = await serverPerformanceController.getNumberOfActiveServerOfActivity(
      currentShopActivityObject._id
    );
    //update the record of queue data based on action
    // cancel = customer cancel the queue halfway
    // skip = owner skip customer queue
    // called = customer turn reached after owner infor them
    // accepted = owner completed serving the queue
    // proceed = start to queue for the next stage
    let resultQueueData = "";
    if (action == "cancel" && userRole == "customer") {
      QUEUE_LENGTH_ARGUMENT = -1;
      QUEUE_STATUS_ARGUMENT = CANCELED;
      QUEUE_CUSTOMER_ARGUMENT = queue.queue_customer;
      queue.queue_queueStatus = CANCELED;
      RES_MESSAGE = "Queue Deleted";
    } else if (action == "skip" && userRole != "customer") {
      QUEUE_LENGTH_ARGUMENT = -1;
      QUEUE_STATUS_ARGUMENT = SKIPPED;
      QUEUE_SERVER_ARGUMENT = userId;
      QUEUE_CUSTOMER_ARGUMENT = queue.queue_customer;
      queue.queue_queueStatus = SKIPPED;
      RES_MESSAGE = "Queue Skipped";
    } else if (action == "called" && userRole != "customer") {
      QUEUE_LENGTH_ARGUMENT = 0;
      QUEUE_STATUS_ARGUMENT = CALLED;
      QUEUE_SERVER_ARGUMENT = userId;
      QUEUE_CUSTOMER_ARGUMENT = queue.queue_customer;
      queue.queue_queueStatus = CALLED;
      RES_MESSAGE = "Reach Your Turn!";
    } else if (action == "accepted" && userRole != "customer") {
      QUEUE_LENGTH_ARGUMENT = -1;
      QUEUE_STATUS_ARGUMENT = ACCEPTED;
      QUEUE_SERVER_ARGUMENT = userId;
      QUEUE_CUSTOMER_ARGUMENT = queue.queue_customer;
      queue.queue_queueStatus = ACCEPTED;
      RES_MESSAGE = "Queue completed!";
    } else if (action == "proceed" && userRole != "customer") {
      QUEUE_LENGTH_ARGUMENT =
        nextShopActivityObject.shopActivity_queueLength + 1;
      QUEUE_STATUS_ARGUMENT = QUEUING;
      QUEUE_SERVER_ARGUMENT = userId;
      QUEUE_CUSTOMER_ARGUMENT = queue.queue_customer;
      queue.queue_queueStatus = QUEUING;
      RES_MESSAGE = `Proceed to ${nextShopActivityObject.shopActivity_activity}`;

      // create a queue Data for the proceeded queue
      let queueDataToEndCurrentStage = await updateQueueData(
        -1,
        queue.queue_stage,
        3,
        currentShopActivityObject.shopActivity_activity,
        currentShopActivityObject._id,
        QUEUE_SERVER_ARGUMENT,
        QUEUE_CUSTOMER_ARGUMENT,
        QUEUE_QUEUEID_ARGUMENT,
        shopStatus._id,
        activeServer
      );

      // update the queue length of the new activity
      nextShopActivityObject.shopActivity_queueLength =
        nextShopActivityObject.shopActivity_queueLength + 1;
      await nextShopActivityObject.save();

      shopStatus.shopStatus_queueLength = shopStatus.shopStatus_queueLength + 1;
      shopStatus.shopStatus_servingLength =
        shopStatus.shopStatus_servingLength - 1;

      activeServer = await serverPerformanceController.getNumberOfActiveServerOfActivity(
        nextShopActivityObject._id
      );
      // update queue activity
      queue.queue_activityId = nextShopActivityObject._id;
      queue.queue_activity = nextShopActivityObject.shopActivity_activity;
      queue.queue_stage = stage + 1;
      queue.queue_servedDateTime = currentDateTime();
      queue.queue_servedTimestamp = currentTimestamp();
      queue.queue_numberOfServer = activeServer;

      currentShopActivityObject = nextShopActivityObject;

      /* START CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */
      // estimate time
      let activityAverageTime = await queueLengthAndTimeCalculationController.activityAverageTime(
        nextShopActivityObject._id,
        todayDay(),
        currentDateTime()
      );

      const shopId = shopStatus._id;

      let previousQueueWaitingTime;

      const activityQueues = await Queue.find({
        queue_activityId: nextShopActivityObject._id,
        queue_queueStatus: 1,
      }).sort({ queue_servedTimestamp: -1 });

      const newWaitingLength = activityQueues.length + 1;

      const numberOfBusyServer = await Queue.find({
        queue_activityId: nextShopActivityObject._id,
        queue_queueStatus: 2,
      }).countDocuments();

      const numberOfFreeServer = activeServer - numberOfBusyServer;

      console.log("activeServer:", activeServer);
      console.log("numberOfBusyServer:", numberOfBusyServer);
      console.log("numberOfFreeServer:", numberOfFreeServer);
      let timeSincePreviousQUeueServed;
      let estimatedWaitingTime;

      if (newWaitingLength <= numberOfFreeServer) {
        // when there are free server which ready to server
        estimatedWaitingTime = 1;
        console.log("enter if");
      } else if (newWaitingLength > numberOfFreeServer) {
        // when the servers are busy
        const currentlyServingQueue = await Queue.find({
          queue_activityId: nextShopActivityObject._id,
          queue_queueStatus: 2,
        }).sort({ queue_servedDateTime: 1 });

        if (currentlyServingQueue.length >= activeServer) {
          let recordToBeRead = (newWaitingLength % activeServer) - 1;
          if (recordToBeRead < 0) {
            recordToBeRead = activeServer - 1;
          }
          timeSincePreviousQUeueServed = convertMillisecondToMinute(
            currentTimestamp().getTime() -
              currentlyServingQueue[
                recordToBeRead
              ].queue_servedTimestamp.getTime()
          );

          // // becasue the actual serving time might exceed the estimated serving time
          // if (timeSincePreviousQUeueServed < 1) {
          //   timeSincePreviousQUeueServed = 1;
          // }

          let timeLeftToCompletePreviousQueue =
            activityAverageTime - timeSincePreviousQUeueServed;
          // becasue the actual serving time might exceed the estimated serving time
          if (timeLeftToCompletePreviousQueue < 1) {
            timeLeftToCompletePreviousQueue = 1;
          }

          estimatedWaitingTime =
            timeLeftToCompletePreviousQueue +
            activityAverageTime *
              (Math.ceil(newWaitingLength / activeServer) - 1);
        } else {
          // when there are free server, but still soeone queue in front of you
          // const previousQueue = await Queue.find({
          //   queue_activityId: nextShopActivityObject._id,
          //   queue_queueStatus: 1,
          // }).sort({ queue_queueDateTime: -1 });
          // let recordToBeRead = (newWaitingLength % activeServer) - 1;

          // if (recordToBeRead < 0) {
          //   recordToBeRead = 0;
          // }
          // previousQueueWaitingTime =
          //   previousQueue[recordToBeRead].queue_estimatedWaitingTime;
          // estimatedWaitingTime = previousQueueWaitingTime + activityAverageTime;

          const activityQueue = await Queue.find({
            queue_activityId: nextShopActivityObject._id,
            queue_queueStatus: 1,
          }).sort({ queue_servedDateTime: -1 });

          estimatedWaitingTime =
            activityAverageTime + activityQueue[0].queue_estimatedWaitingTime;
        }
      }
      /* FINISH CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */
      queue.queue_estimatedWaitingTime = estimatedWaitingTime;
    }

    // create queue data to record down the action time
    resultQueueData = await updateQueueData(
      QUEUE_LENGTH_ARGUMENT,
      STAGE_OF_THE_QUEUE_ARGUMENT,
      QUEUE_STATUS_ARGUMENT,
      currentShopActivityObject.shopActivity_activity,
      currentShopActivityObject._id,
      QUEUE_SERVER_ARGUMENT,
      QUEUE_CUSTOMER_ARGUMENT,
      QUEUE_QUEUEID_ARGUMENT,
      shopStatus._id,
      activeServer
    );
    queue.queue_queueData.push(resultQueueData);
    queue.queue_waitingLength = QUEUE_LENGTH_ARGUMENT; //update the current waiting length to 0

    // reduce queue length in shopstatus and shop activity
    if (
      (action == "cancel" && queue.queue_queueStatus == 1) ||
      action == "called"
    ) {
      // if (queueStructure.queueStructure_stageNumber == 1) {
      shopStatus.shopStatus_queueLength = shopStatus.shopStatus_queueLength - 1;
      if (stage == 1) {
        shopStatus.shopStatus_stageOneQueueLength =
          shopStatus.shopStatus_stageOneQueueLength - 1;
      }
      // }
      currentShopActivityObject.shopActivity_queueLength =
        currentShopActivityObject.shopActivity_queueLength - 1;
      await currentShopActivityObject.save();

      updateQueueBehindThis(
        shopStatus._id,
        QUEUE_STATUS_ARGUMENT,
        WAITING_LENGTH_OF_THE_QUEUE_ARGUMENT,
        STAGE_OF_THE_QUEUE_ARGUMENT,
        currentShopActivityObject._id,
        shopStatus
      );
    }

    //update the currently serving length
    if (action == "called") {
      shopStatus.shopStatus_servingLength =
        shopStatus.shopStatus_servingLength + 1;

      queue.queue_servedDateTime = currentDateTime();
      const CURRENT_TIMESTAMP = currentTimestamp();
      queue.queue_servedTimestamp = CURRENT_TIMESTAMP;
      // subtract the served time by queue time
      const totalWaitingTime =
        CURRENT_TIMESTAMP.getTime() - queue.queue_queueTimestamp.getTime();
      if (queue.queue_totalWaitingTime == null) {
        queue.queue_totalWaitingTime = totalWaitingTime;
      }
      if (queue.queue_totalWaitingTime != null) {
        queue.queue_totalWaitingTime =
          queue.queue_totalWaitingTime + totalWaitingTime;
      }
      queue.queue_estimatedWaitingTime = 0;
      // to update the the current serving number if no one is queueing after this
      // updateServingNumber, not needed because i can query by search
    }
    if (action == "accepted" || action == "skip") {
      shopStatus.shopStatus_servingLength =
        shopStatus.shopStatus_servingLength - 1;
      queue.queue_completeDateTime = currentDateTime();
      const CURRENT_TIMESTAMP = currentTimestamp();
      queue.queue_completeTimestamp = CURRENT_TIMESTAMP;
      // subtract the completed time by queue time
      const totalTimeInSystem =
        CURRENT_TIMESTAMP.getTime() - queue.queue_queueTimestamp.getTime();
      queue.queue_totalTimeInSystem = totalTimeInSystem;
    }
    // update the system length as the user left the shop
    if (action == "accepted" || action == "skip" || action == "cancel") {
      shopStatus.shopStatus_systemLength =
        shopStatus.shopStatus_systemLength - 1;
    }

    const queueResult = await queue.save();
    shopStatusResult = await shopStatus.save();

    await combinedPerformanceController.warningToAddServerForStageOne(
      shopStatus._id
    );

    const shopPerformanceResult = await shopPerformanceController.createShopPerformance(
      shopStatusResult._id,
      shopStatusResult.shopStatus_queueLength,
      shopStatusResult.shopStatus_servingLength,
      shopStatusResult.shopStatus_systemLength
    );

    // return the queue with the frontend data format
    queueResult.queue_shopImageUrl = shopStatusResult.shopStatus_logoUrl;
    queueResult.queue_shopName = shopStatusResult.shopStatus_shopName;
    queueResult.queue_shopBranch = shopStatusResult.shopStatus_branch;

    const slicedQueueNumber = siceQueueNumber(queueResult.queue_queueNumber);
    queueResult.queue_queueNumber = slicedQueueNumber;

    const totalWaitingTime = convertMillisecondToMinute(
      queueResult.queue_totalWaitingTime
    );
    queueResult.queue_totalWaitingTime = totalWaitingTime;

    queueResult.queue_date = getDateFromDatetime(
      queueResult.queue_queueDateTime
    );

    let estimatedTimeByShop = await queueLengthAndTimeCalculationController.stageOneEstimatedTime(
      shopStatusResult._id,
      todayDay(),
      currentDateTime()
    );
    shopStatusResult.shopStatus_stageOneWaitingTime = estimatedTimeByShop;
    // io
    io.getIo().emit("queues", {
      action: "update",
      queue: queueResult,
      queueId: queueResult._id,
      shopStatus: shopStatusResult,
    });

    res.status(200).json({
      message: RES_MESSAGE,
      resultQueueData: resultQueueData,
      queueResult: queueResult,
      shopStatusResult: shopStatusResult,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// generate unique queue number based on todays date
// add 1 to previous queue number
function generateQueueNumber(currentQueueNumber) {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2).toString();
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2).toString();
  // current year
  let year = date_ob.getFullYear().toString();
  let dateToday = year + month + date;

  let prevQueueNumber = currentQueueNumber;
  let nextQueueNumber;
  let newDayQueueNumber = dateToday + "00001";
  if (prevQueueNumber == null) {
    nextQueueNumber = newDayQueueNumber;
  } else if (prevQueueNumber < newDayQueueNumber) {
    nextQueueNumber = newDayQueueNumber;
  } else {
    nextQueueNumber = parseInt(prevQueueNumber, 10) + 1;
  }
  return nextQueueNumber;
}

// create queue data
async function updateQueueData(
  queueLength,
  stage,
  status,
  shopActivity,
  shopActivityId,
  server,
  customer,
  queue,
  shopId,
  numberOfServer
) {
  try {
    const queueData = QueueData({
      queueData_queueLength: queueLength,
      queueData_stage: stage,
      queueData_shopActiviy: shopActivity,
      queueData_shopActivityId: shopActivityId,
      queueData_status: status,
      queueData_server: server,
      queueData_customer: customer,
      queueData_queue: queue,
      queueData_dateTime: currentDateTime(),
      queueData_timestamp: currentTimestamp(),
      queueData_dayOfWeek: todayDay(),
      queueData_shopId: shopId,
      queueData_numberOfServer: numberOfServer,
    });
    const result = await queueData.save();
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
}

// update the (people) queues behind when a person is called to be served or that person leaves the queue halfway
async function updateQueueBehindThis(
  shopStatusId,
  queueStatus,
  waitingLength,
  stage,
  activityId,
  shopStatusResult
) {
  let pushDataResults;
  let averageTimeToServerACustomer;
  let totalWaitingTime = 0;
  let arrayQueuesBehindUpdatedqueue = [];

  const queuesBehindThisArray = await Queue.find({
    queue_shop: shopStatusId,
    // queue_queueStatus: queueStatus,
    queue_queueStatus: QUEUING,
    queue_stage: stage,
    queue_waitingLength: { $gt: waitingLength },
  }).sort({ queue_queueNumber: 1 });

  let queuesInFrontThisArray;

  let activeServer;
  let activityAverageTime;
  let newWaitingLength;
  let numberOfBusyServer;
  let currentlyServingQueue;
  if (stage == 1) {
    activeServer = await serverPerformanceController.getNumberOfServersOfStageOne(
      shopStatusId
    );
    numberOfBusyServer = await Queue.find({
      queue_shop: shopStatusId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).countDocuments();

    currentlyServingQueue = await Queue.find({
      queue_shop: shopStatusId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).sort({ queue_servedDateTime: 1 });

    queuesInFrontThisArray = await Queue.find({
      queue_shop: shopStatusId,
      queue_queueStatus: 1,
      queue_stage: 1,
      queue_waitingLength: { $lt: waitingLength },
    }).sort({ queue_queueNumber: -1 });
  } else {
    activeServer = await serverPerformanceController.getNumberOfActiveServerOfActivity(
      activityId
    );
    activityAverageTime = await queueLengthAndTimeCalculationController.activityAverageTime(
      activityId,
      todayDay(),
      currentDateTime()
    );
    numberOfBusyServer = await Queue.find({
      queue_shop: shopStatusId,
      queue_activityId: activityId,
      queue_queueStatus: 2,
    }).countDocuments();

    currentlyServingQueue = await Queue.find({
      queue_shop: shopStatusId,
      queue_activityId: activityId,
      queue_queueStatus: 2,
    }).sort({ queue_servedDateTime: 1 });

    queuesInFrontThisArray = await Queue.find({
      queue_shop: shopStatusId,
      queue_queueStatus: 1,
      queue_activityId: activityId,
      queue_waitingLength: { $lt: waitingLength },
    }).sort({ queue_queueNumber: -1 });
  }

  const numberOfFreeServer = activeServer - numberOfBusyServer;

  let timeSincePreviousQUeueServed;
  let estimatedWaitingTime;

  //update the waiting length of the people queuing behind this person and their queue data
  for (let i = 0; i < queuesBehindThisArray.length; i++) {
    //
    newWaitingLength = queuesBehindThisArray[i].queue_waitingLength - 1;
    queuesBehindThisArray[i].queue_waitingLength =
      queuesBehindThisArray[i].queue_waitingLength - 1;
    //

    /* START CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */
    averageTimeToServerACustomer = await queueLengthAndTimeCalculationController.activityAverageTime(
      queuesBehindThisArray[i].queue_activityId,
      todayDay(),
      currentDateTime()
    );

    console.log("averageTimeToServerACustomer:", averageTimeToServerACustomer);

    if (newWaitingLength <= numberOfFreeServer) {
      // when there are free server which ready to server
      estimatedWaitingTime = 1;
      console.log("enter if");
    } else if (newWaitingLength > numberOfFreeServer) {
      // when the servers are busy

      if (currentlyServingQueue.length >= activeServer) {
        console.log("enter else if if");
        let recordToBeRead = (newWaitingLength % activeServer) - 1;
        if (recordToBeRead < 0) {
          recordToBeRead = activeServer - 1;
        }
        console.log("else if else - recordToBeRead:", recordToBeRead);
        timeSincePreviousQUeueServed = convertMillisecondToMinute(
          currentTimestamp().getTime() -
            currentlyServingQueue[
              recordToBeRead
            ].queue_servedTimestamp.getTime()
        );

        // // becasue the actual serving time might exceed the estimated serving time
        // if (timeSincePreviousQUeueServed < 1) {
        //   timeSincePreviousQUeueServed = 1;
        // }

        // console.log(
        //   "else if else - timeSincePreviousQUeueServed:",
        //   timeSincePreviousQUeueServed
        // );

        averageTimeToServerACustomer = await queueLengthAndTimeCalculationController.activityAverageTime(
          currentlyServingQueue[recordToBeRead].queue_activityId
        );

        let timeLeftToCompletePreviousQueue =
          averageTimeToServerACustomer - timeSincePreviousQUeueServed;
        // becasue the actual serving time might exceed the estimated serving time
        if (timeLeftToCompletePreviousQueue < 1) {
          timeLeftToCompletePreviousQueue = 1;
        }
        console.log(
          "else if else - timeLeftToCompletePreviousQueue:",
          timeLeftToCompletePreviousQueue
        );
        estimatedWaitingTime =
          timeLeftToCompletePreviousQueue +
          averageTimeToServerACustomer *
            (Math.ceil(newWaitingLength / activeServer) - 1);
        console.log(
          "else if else - estimatedWaitingTime:",
          estimatedWaitingTime
        );
      } else {
        console.log("enter else if else");
        // // when there are free server, but still soeone queue in front of you
        // const queue = queuesInFrontThisArray;

        // let recordToBeRead = (newWaitingLength % activeServer) - 1;

        // if (recordToBeRead < 0) {
        //   recordToBeRead = 0;
        // }
        // previousQueueWaitingTime =
        //   queue[recordToBeRead].queue_estimatedWaitingTime;
        // estimatedWaitingTime =
        //   previousQueueWaitingTime + averageTimeToServerACustomer;

        // when there are free server, but still soeone queue in front of you
        const queue = queuesInFrontThisArray;

        // let recordToBeRead = (newWaitingLength % activeServer) - 1;

        // if (recordToBeRead < 0) {
        //   recordToBeRead = 0;
        // }
        previousQueueWaitingTime = queue[0].queue_estimatedWaitingTime;
        estimatedWaitingTime =
          previousQueueWaitingTime + averageTimeToServerACustomer;
      }
      console.log("estimatedWaitingTime:", estimatedWaitingTime);
    }
    /* FINISH CALCULATING THE ETIMATED WAITING TIME FOR THIS CUSTOMER QUEUE */

    queuesBehindThisArray[i].queue_estimatedWaitingTime = estimatedWaitingTime;

    console.log(
      "waiting length:",
      queuesBehindThisArray[i].queue_waitingLength
    );
    console.log(
      "estimated waiting time:",
      queuesBehindThisArray[i].queue_estimatedWaitingTime
    );

    const result = await queuesBehindThisArray[i].save();

    // for socket io
    result.queue_shopImageUrl = shopStatusResult.shopStatus_logoUrl;
    result.queue_shopName = shopStatusResult.shopStatus_shopName;
    result.queue_shopBranch = shopStatusResult.shopStatus_branch;

    const slicedQueueNumber = siceQueueNumber(result.queue_queueNumber);
    result.queue_queueNumber = slicedQueueNumber;

    const totalWaitingTime = convertMillisecondToMinute(
      result.queue_totalWaitingTime
    );
    result.queue_totalWaitingTime = totalWaitingTime;

    result.queue_date = getDateFromDatetime(result.queue_queueDateTime);
    // io
    io.getIo().emit("queues", {
      action: "updateBehind",
      queue: result,
      queueId: result._id,
      shopStatus: shopStatusResult,
    });
  }
}

// used for run batch
exports.runBatchUpdateEstimatedQaitingTime = async () => {
  try {
    const activeQueues = await Queue.find({
      queue_queueStatus: 1,
    });
    for (let i = 0; i < activeQueues.length; i++) {
      if (activeQueues[i].queue_estimatedWaitingTime > 1) {
        activeQueues[i].queue_estimatedWaitingTime =
          activeQueues[i].queue_estimatedWaitingTime - 1;
        await activeQueues[i].save();
      }
      io.getIo().emit("cron", {
        // action: "update",
        queueId: activeQueues[i]._id,
        // estimatedTime: activeQueues[i].queue_estimatedWaitingTime,
        queue: activeQueues[i],
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
