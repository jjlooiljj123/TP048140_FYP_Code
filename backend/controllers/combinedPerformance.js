const shopPerformanceController = require("./shopPerformance");
const activityPerformanceController = require("./activityPerformance");
const serverPerformanceController = require("./serverPerformance");

const ShopActivity = require("../models/ShopActivity");
const Shop = require("../models/Shop");
const ActivityPerformanceAnalysis = require("../models/ActivityPerformanceAnalysis");
const User = require("../models/User");
const PerformanceAccumulatedValues = require("../models/PerformanceAccumulatedValues");
const {
  stageOneEstimatedTime,
  activityAverageTime,
} = require("./queueLengthAndTimeCalculation");
const { getNumberOfServersOfStageOne } = require("./serverPerformance");

const io = require("../socket");

const {
  todayDay,
  currentDateTime,
  datetimeAfterOneHour,
} = require("../Utils/currentDateTime");
const ShopStatus = require("../models/ShopStatus");
const Queue = require("../models/Queue");

// run batch to create analysis
// called in app.js
exports.cronCreateAnalysis = async (startTime, endTime, timeInterval) => {
  let shops;
  let shopId;
  let createShopPerformanceAnalysisResult;
  let shopActivities;
  let activityId;
  let activityPerformanceAnalysisResult;
  let servers;
  let serverId;
  let createServerPerformanceAnalysisResult;
  try {
    shops = await Shop.find();
    for (let i = 0; i < shops.length; i++) {
      shopId = shops[i]._id;
      createShopPerformanceAnalysisResult = await shopPerformanceController.createShopPerformanceAnalysis(
        shopId,
        startTime,
        endTime,
        timeInterval
      );
      shopActivities = await ShopActivity.find({
        shopActivity_shopStatus: shopId,
      });
      if (shopActivities.length > 0) {
        for (let j = 0; j < shopActivities.length; j++) {
          activityId = shopActivities[j]._id;
          activityPerformanceAnalysisResult = await activityPerformanceController.createActivityPerformanceAnalysis(
            shopId,
            activityId,
            startTime,
            endTime,
            timeInterval
          );

          // servers = await User.find({
          //   user_shop: shop[i],
          // });
          // for (let y = 0; i < servers.length; i++) {
          //   serverId = servers[y]._id;
          //   createServerPerformanceAnalysisResult = await serverPerformanceController.createServerPerformanceAnalysis(
          //     serverId,
          //     activityId,
          //     startTime,
          //     endTime,
          //     shopId
          //   );
          // }
        }
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    throw err;
  }
};

// // NEEDED TO CONVERT INTO WEBSOCKET TO SEND TO FRONT END
// // to get the numbers of server needed
// // http://localhost:8080/performance/serversNeeded/:shopId/?activityId=activityId
// exports.warningToAddServerForAnActivity = async (req, res, next) => {
//   const timeToClearCurrentQueue = req.body.timeToClearCurrentQueue;
//   const activityId = req.query.activityId;
//   const shopId = req.params.shopId;
//   const today = todayDay();
//   const currentDatetime = currentDateTime();
//   let activityPerformanceAnalysisObject;

//   try {
//     activityPerformanceAnalysisObject = await ActivityPerformanceAnalysis.find({
//       activityPerformanceAnalysis_shop: shopId,
//       activityPerformanceAnalysis_activityId: activityId,
//       activityPerformanceAnalysis_startHour: getHourFromDatetime(
//         currentDatetime
//       ),
//     }).sort({ activityPerformanceAnalysis_createdDatetime: -1 });
//     const numberOfServerNeededResult = await activityPerformanceController.numberOfServerNeeded(
//       timeToClearCurrentQueue,
//       activityPerformanceAnalysisObject[0],
//       activityId
//     );
//     res.statusCode(200).json({
//       message: `number of servers needed: ${numberOfServerNeededResult}`,
//       numberOfServerNeededResult: numberOfServerNeededResult,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode == 500;
//     }
//     next(err);
//   }
// };

// NEEDED TO CONVERT INTO WEBSOCKET TO SEND TO FRONT END
// to get the numbers of server needed
// called in queue controller
exports.warningToAddServerForStageOne = async (shopId) => {
  let timeToClearCurrentQueue;
  const today = todayDay();
  const currentDatetime = currentDateTime();
  let numberOfServerNeededResult = 1;
  let isNewServerNeeded = false;
  let extraNumberNeeded = 0;
  console.log("enter warningToAddServerForStageOne");
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("Could not find shop");
      error.statusCode = 404;
      return next(error);
    }
    console.log("enter warningToAddServerForStageOne shopStatus", shopId);
    timeToClearCurrentQueue = shopStatus.shopStatus_timeToClearQueue;
    console.log(
      "enter warningToAddServerForStageOne timeToClearCurrentQueue",
      timeToClearCurrentQueue
    );
    if (timeToClearCurrentQueue == -1) {
      numberOfServerNeededResult = -1;
      const error = new Error("Service not available yet");
      error.statusCode = 404;
      return next(error);
    }
    const stageOneWaitingTime = await stageOneEstimatedTime(
      shopId,
      today,
      currentDatetime
    );
    const lastQueueActivityArray = await Queue.find({
      queue_shop: shopId,
      queue_queueStatus: 1,
      queue_stage: 1,
    }).sort({ queue_queueDateTime: -1 });

    let stageOneNumberOfServer = await getNumberOfServersOfStageOne(shopId);

    if (lastQueueActivityArray.length > 0) {
      const lastQueueActivity = lastQueueActivityArray[0].queue_activityId;
      const lastActivityTime = await activityAverageTime(
        lastQueueActivity,
        today,
        currentDatetime
      );
      const actualWaitingTime = stageOneWaitingTime - lastActivityTime;
      // console.log(
      //   "enter warningToAddServerForStageOne stageOneWaitingTime",
      //   stageOneWaitingTime
      // );
      numberOfServerNeededResult = Math.ceil(
        actualWaitingTime / timeToClearCurrentQueue
      );
      // console.log(
      //   "enter warningToAddServerForStageOne numberOfServerNeededResult",
      //   numberOfServerNeededResult
      // );
      // stageOneNumberOfServer = await getNumberOfServersOfStageOne(shopId);

      if (numberOfServerNeededResult > stageOneNumberOfServer) {
        isNewServerNeeded = true;
        extraNumberNeeded = numberOfServerNeededResult - stageOneNumberOfServer;
      }
      // console.log(
      //   "enter warningToAddServerForStageOne numberOfServerNeededResult",
      //   numberOfServerNeededResult
      // );
      // console.log(
      //   "enter warningToAddServerForStageOne stageOneNumberOfServer",
      //   stageOneNumberOfServer
      // );
      // console.log(
      //   "enter warningToAddServerForStageOne extraNumberNeeded",
      //   extraNumberNeeded
      // );
      console.log(
        "enter warningToAddServerForStageOne actualWaitingTime",
        actualWaitingTime
      );
    }

    console.log(
      "enter warningToAddServerForStageOne extraNumberNeeded",
      extraNumberNeeded
    );

    io.getIo().emit("serversWarning", {
      shopId: shopId,
      stageOneNumberOfServer: stageOneNumberOfServer,
      numberOfServerNeeded: numberOfServerNeededResult,
      extraNumberNeeded: extraNumberNeeded,
      isNewServerNeeded: isNewServerNeeded,
    });
    return numberOfServerNeededResult;
    // res.statusCode(200).json({
    //   message: `number of servers needed: ${numberOfServerNeededResult}`,
    //   numberOfServerNeededResult: numberOfServerNeededResult,
    // });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    throw err;
  }
};

// ONLY USE FOR DEMO PURPOSE
// to create the shopPerformance analysis of the specified time (interval)
// http://localhost:8080/performance/shopPerformanceAnalysis/:shopId
exports.createShopPerformanceAnalysis = async (req, res, next) => {
  const shopId = req.params.shopId;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const timeInterval = req.body.timeInterval;

  try {
    const shopPerformanceAnalysisResult = await shopPerformanceController.createShopPerformanceAnalysis(
      shopId,
      startTime,
      endTime,
      timeInterval
    );
    res.status(200).json({
      message: "create shopPerformanceAnalysisResult successfully",
      shopPerformanceAnalysisResult: shopPerformanceAnalysisResult,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    next(err);
  }
};

// ONLY USE FOR DEMO PURPOSE
// to create the activityPerformance analysis of the specified time (interval)
// http://localhost:8080/performance/activityPerformanceAnalysis/:shopId/?activityId=activityId
exports.createActivityPerformanceAnalysis = async (req, res, next) => {
  const shopId = req.params.shopId;
  const activityId = req.query.activityId;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const timeInterval = req.body.timeInterval;
  console.log("shopId", shopId);
  console.log("activityId", activityId);
  console.log("startTime", startTime);
  console.log("endTime", endTime);
  console.log("statimeIntervalrtTime", timeInterval);
  try {
    const activityPerformanceAnalysisResult = await activityPerformanceController.createActivityPerformanceAnalysis(
      shopId,
      activityId,
      startTime,
      endTime,
      timeInterval
    );
    res.status(200).json({
      message: "create activityPerformanceAnalysisResult successfully",
      activityPerformanceAnalysisResult: activityPerformanceAnalysisResult,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    next(err);
  }
};

// ONLY USE FOR DEMO PURPOSE
// to create the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysis/:shopId/?activityId=activityId&serverId=serverId
exports.createServerPerformanceAnalysis = async (req, res, next) => {
  const shopId = req.params.shopId;
  const activityId = req.query.activityId;
  const serverId = req.query.serverId;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

  try {
    const serverPerformanceAnalysisResult = await serverPerformanceController.createServerPerformanceAnalysis(
      serverId,
      activityId,
      startTime,
      endTime,
      shopId
    );
    res.status(200).json({
      message: "create serverPerformanceAnalysisResult successfully",
      serverPerformanceAnalysisResult: serverPerformanceAnalysisResult,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode == 500;
    }
    next(err);
  }
};
