const ShopPerformance = require("../models/ShopPerformance");
const ShopPerformanceAnalysis = require("../models/ShopPerformanceAnalysis");
const Queue = require("../models/Queue");
const QueueData = require("../models/QueueData");
const ShopStatus = require("../models/ShopStatus");
const PerformanceAccumulatedValues = require("../models/PerformanceAccumulatedValues");

const {
  currentDateTime,
  todayDay,
  currentTimestamp,
  convertMillisecondToMinute,
  getHourFromDatetimeAnalysis,
} = require("../Utils/currentDateTime");

// create the shop performance, used for frontend graph plotting
// called in queue controller, when a queue is created or the queue is updated (when there is a change in the params of the function)
exports.createShopPerformance = async (
  shopId,
  queueLength,
  serving,
  systemLength
) => {
  try {
    const shopPerformance = ShopPerformance({
      shopPerformance_shop: shopId,
      shopPerformance_timestamp: currentTimestamp(),
      shopPerformance_datetime: currentDateTime(),
      shopPerformance_day: todayDay(),
      shopPerformance_queueLength: queueLength,
      shopPerformance_servingLength: serving,
      shopPerformance_systemLength: systemLength,
    });
    const result = await shopPerformance.save();
    return result;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve the shopPerformance of the specify day
// http://localhost:8080/performance/shopPerformance/:shopId/?startTime=startTime&endTime=endTime
exports.getShopPerformanceOfOneDay = async (req, res, next) => {
  const shopId = req.params.shopId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    const numberOfShopPerformances = await ShopPerformance.find({
      shopPerformance_shop: shopId,
      shopPerformance_datetime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const shopPerformances = await ShopPerformance.find({
      shopPerformance_shop: shopId,
      shopPerformance_datetime: { $gt: startTime, $lt: endTime },
    }).sort({ shopPerformance_timestamp: 1 });
    res.status(200).json({
      message: "shopPerformance fetched.",
      numberOfShopPerformances: numberOfShopPerformances,
      shopPerformances: shopPerformances,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// TAKE CARE OF THE TIMEINTERVAL, USER NEED TO DECIDE WHAT UNIT (USUALLY MINUTE)
// create shopPerformanceAnalysis, used for data analysis
// called for cron job (currently in combined performance controller)
// called from external request (currently in combined performance controller)
exports.createShopPerformanceAnalysis = async (
  shopId,
  startTime,
  endTime,
  timeInterval
) => {
  try {
    const arrivalRate = await calculateArrivalRate(shopId, startTime, endTime);
    const serviceRate = await calculateServiceRate(shopId, startTime, endTime);
    const serviceRatePerServer = await calculateServiceRatePerServer(
      shopId,
      startTime,
      endTime
    );
    const averageInterarrivalTime = await calculateInterarrivalTime(
      shopId,
      startTime,
      endTime,
      timeInterval
    );
    const averageTimeToServerACustomer = await calculateAverageTimeToServeACustomer(
      shopId,
      startTime,
      endTime
    );
    const averageTimeSpentInQueue = await calculateAverageTimeSpentInQueue(
      shopId,
      startTime,
      endTime
    );
    const averageTimeSpentInSystem = await calculateAverageTimeSpentInSystem(
      shopId,
      startTime,
      endTime
    );
    const utilizationOfServer = await calculateUtilizationOfServer(
      shopId,
      startTime,
      endTime,
      timeInterval,
      averageTimeToServerACustomer
    );
    const shopPerformanceAnalysis = ShopPerformanceAnalysis({
      shopPerformanceAnalysis_shop: shopId,
      shopPerformanceAnalysis_createdtDatetime: currentDateTime(),
      shopPerformanceAnalysis_createdTimestamp: currentTimestamp(),
      shopPerformanceAnalysis_startTime: startTime,
      shopPerformanceAnalysis_endTime: endTime,
      shopPerformanceAnalysis_dayOfWeek: todayDay(),
      shopPerformanceAnalysis_arrivalRate: arrivalRate,
      shopPerformanceAnalysis_serviceRate: serviceRate,
      shopPerformanceAnalysis_serviceRatePerServer: serviceRatePerServer,
      shopPerformanceAnalysis_averageInterarrivalTime: averageInterarrivalTime,
      shopPerformanceAnalysis_averageTimeToServerACustomer: averageTimeToServerACustomer,
      shopPerformanceAnalysis_averageTimeSpentInQueue: averageTimeSpentInQueue,
      shopPerformanceAnalysis_averageTimeSpentInSystem: averageTimeSpentInSystem,
      shopPerformanceAnalysis_utilizationOfServer: utilizationOfServer,
    });
    const shopPerformanceAnalysisResult = shopPerformanceAnalysis.save();
    return shopPerformanceAnalysisResult;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve the shopPerformance analysis of the specified day
// http://localhost:8080/performance/shopPerformanceAnalysis/:shopId/?startTime=startTime&endTime=endTime
exports.getShopPerformanceAnalysisOfOneDay = async (req, res, next) => {
  const shopId = req.params.shopId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    const numberOfShopPerformanceAnalysis = await ShopPerformanceAnalysis.find({
      shopPerformanceAnalysis_shop: shopId,
      shopPerformanceAnalysis_startTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const shopPerformanceAnalysis = await ShopPerformanceAnalysis.find({
      shopPerformanceAnalysis_shop: shopId,
      shopPerformanceAnalysis_startTime: { $gt: startTime, $lt: endTime },
    }).sort({ shopPerformanceAnalysis_createdTimestamp: 1 });

    for (let i = 0; i < numberOfShopPerformanceAnalysis; i++) {
      // shopPerformanceAnalysis[
      //   i
      // ].shopPerformanceAnalysis_averageInterarrivalTime = convertMillisecondToMinute(
      //   shopPerformanceAnalysis[i]
      //     .shopPerformanceAnalysis_averageInterarrivalTime
      // );
      shopPerformanceAnalysis[
        i
      ].shopPerformanceAnalysis_averageTimeToServerACustomer = convertMillisecondToMinute(
        shopPerformanceAnalysis[i]
          .shopPerformanceAnalysis_averageTimeToServerACustomer
      );
      shopPerformanceAnalysis[
        i
      ].shopPerformanceAnalysis_averageTimeSpentInQueue = convertMillisecondToMinute(
        shopPerformanceAnalysis[i]
          .shopPerformanceAnalysis_averageTimeSpentInQueue
      );
      shopPerformanceAnalysis[
        i
      ].shopPerformanceAnalysis_averageTimeSpentInSystem = convertMillisecondToMinute(
        shopPerformanceAnalysis[i]
          .shopPerformanceAnalysis_averageTimeSpentInSystem
      );
      shopPerformanceAnalysis[
        i
      ].shopPerformanceAnalysis_hour = getHourFromDatetimeAnalysis(
        shopPerformanceAnalysis[i].shopPerformanceAnalysis_createdtDatetime
      );
    }

    res.status(200).json({
      message: "shopPerformanceAnalysis fetched.",
      numberOfShopPerformanceAnalysis: numberOfShopPerformanceAnalysis,
      shopPerformanceAnalysis: shopPerformanceAnalysis,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to calculate the arrival rate of the shop (pverall)
// used in the function 'createShopPerformanceAnalysis'
const calculateArrivalRate = async (shopId, startTime, endTime) => {
  try {
    const totalCreatedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_queueDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    return totalCreatedQueues;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the service rate per server of the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateServiceRatePerServer = async (shopId, startTime, endTime) => {
  let totalNumberofServer = 0;
  let averageServiceRatePerServer;
  try {
    const numberOfTotalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    });

    if (numberOfTotalServedQueues == 0) {
      averageServiceRatePerServer = 0;
    } else {
      for (let i = 0; i < numberOfTotalServedQueues; i++) {
        totalNumberofServer =
          totalNumberofServer + totalServedQueues[i].queue_numberOfServer;
      }
      const averageNumberOfServer =
        totalNumberofServer / numberOfTotalServedQueues;
      averageServiceRatePerServer =
        numberOfTotalServedQueues / averageNumberOfServer;
    }
    return averageServiceRatePerServer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the total service rate of the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateServiceRate = async (shopId, startTime, endTime) => {
  try {
    const numberOfTotalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    return numberOfTotalServedQueues;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the interarrival timeof the customer for the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateInterarrivalTime = async (
  shopId,
  startTime,
  endTime,
  timeInterval
) => {
  let interArrivalTime = 0;
  try {
    const NumberOfTotalCreatedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_queueDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    if (NumberOfTotalCreatedQueues > 0) {
      interArrivalTime = timeInterval / NumberOfTotalCreatedQueues;
    }
    return interArrivalTime;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// // to calculate the average time to for a server to serve a customer for the shop (overall)
// // used in the function 'createShopPerformanceAnalysis'
// const calculateAverageTimeToServeACustomer = async (
//   shopId,
//   startTime,
//   endTime
// ) => {
//   let totalServingTime;
//   let averageTimeToServeACustomer;
//   try {
//     const NumberOfTotalServedQueues = await Queue.find({
//       queue_shop: shopId,
//       // queue_stage: 1,
//       queue_completeTimestamp: { $gt: startTime, $lt: endTime },
//     }).countDocuments();
//     const totalServedQueues = await Queue.find({
//       queue_shop: shopId,
//       // queue_stage: 1,
//       queue_completeTimestamp: { $gt: startTime, $lt: endTime },
//     });
//     if (NumberOfTotalServedQueues == 0) {
//       averageTimeToServeACustomer = -1; // -1 means no infor to be used in calculation
//     } else {
//       for (let i = 0; i < NumberOfTotalServedQueues; i++) {
//         let servingTime =
//           totalServedQueues[i].queue_completeTimestamp.getTime() -
//           totalServedQueues[i].queue_servedTimestamp.getTime();
//         totalServingTime = totalServingTime + servingTime;
//       }
//       averageTimeToServeACustomer =
//         totalServingTime / NumberOfTotalServedQueues;
//     }
//     return averageTimeToServeACustomer;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// to calculate the average time to for a server to serve a customer for the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateAverageTimeToServeACustomer = async (
  shopId,
  startTime,
  endTime
) => {
  let totalServingTime = 0;
  let averageTimeToServeACustomer = 0;
  try {
    const NumberOfTotalServedQueues = await QueueData.find({
      // queue_shop: shopId,
      // // queue_stage: 1,
      // queueData_status: 3,
      // queueData_dateTime: { $gt: startTime, $lt: endTime },
      queueData_shopId: shopId,
      // queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueues = await QueueData.find({
      // queue_shop: shopId,
      // // queue_stage: 1,
      // queueData_status: 3,
      // queueData_dateTime: { $gt: startTime, $lt: endTime },
      queueData_shopId: shopId,
      // queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });
    console.log("NumberOfTotalServedQueues", NumberOfTotalServedQueues);
    if (NumberOfTotalServedQueues == 0) {
      averageTimeToServeACustomer = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOfTotalServedQueues; i++) {
        let totalCalledQueueData = await QueueData.find({
          queueData_queue: totalServedQueues[i].queueData_queue,
          queueData_shopId: shopId,
          queueData_status: 2,
        });
        let servingTime =
          totalServedQueues[i].queueData_timestamp.getTime() -
          totalCalledQueueData[0].queueData_timestamp.getTime();
        totalServingTime = totalServingTime + servingTime;
      }
      averageTimeToServeACustomer =
        totalServingTime / NumberOfTotalServedQueues;

      const performanceAccumulatedValues = await PerformanceAccumulatedValues.find(
        {
          performanceAccumulatedValues_shopId: shopId,
        }
      );

      if (performanceAccumulatedValues.length == 0) {
        let newPerformanceAccumulatedValues = PerformanceAccumulatedValues({
          performanceAccumulatedValues_shopId: shopId,
          performanceAccumulatedValues_shopQuantityCounted: NumberOfTotalServedQueues,
          performanceAccumulatedValues_shopAverageTimeToServerACustomer: averageTimeToServeACustomer,
        });
        const resultPerformanceAccumulatedValues = await newPerformanceAccumulatedValues.save();
      } else {
        const oldNumberOfTotalServedQueues =
          performanceAccumulatedValues[0]
            .performanceAccumulatedValues_shopQuantityCounted;
        const oldAverageTimeToServeACustomer =
          performanceAccumulatedValues[0]
            .performanceAccumulatedValues_shopAverageTimeToServerACustomer;

        const totalNumberOfTotalServedQueues =
          oldNumberOfTotalServedQueues + NumberOfTotalServedQueues;

        const oldTotalServingTime =
          oldNumberOfTotalServedQueues * oldAverageTimeToServeACustomer;

        const newTotalServingTime = oldTotalServingTime + totalServingTime;

        averageTimeToServeACustomer =
          newTotalServingTime / totalNumberOfTotalServedQueues;

        performanceAccumulatedValues[0].performanceAccumulatedValues_shopQuantityCounted = totalNumberOfTotalServedQueues;
        performanceAccumulatedValues[0].performanceAccumulatedValues_shopAverageTimeToServerACustomer = averageTimeToServeACustomer;
        const resultPerformanceAccumulatedValues = await performanceAccumulatedValues[0].save();
      }
    }
    return averageTimeToServeACustomer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the average time to for a customer spent in queue for the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateAverageTimeSpentInQueue = async (shopId, startTime, endTime) => {
  let totalWaitingTime = 0;
  let averageTotalWaitingTime = 0;
  try {
    const NumberOftotalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalServedQueues == 0) {
      averageTotalWaitingTime = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOftotalServedQueues; i++) {
        totalWaitingTime =
          totalWaitingTime + totalServedQueues[i].queue_totalWaitingTime;
      }
      averageTotalWaitingTime = totalWaitingTime / NumberOftotalServedQueues;
    }
    return averageTotalWaitingTime;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the average time to for a customer spent in system for the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateAverageTimeSpentInSystem = async (
  shopId,
  startTime,
  endTime
) => {
  let totalTimeInSystem = 0;
  let averageTimeSpentInSystem = 0;
  try {
    const NumberOftotalCompletedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_completeDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalCompletedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_completeDateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalCompletedQueues == 0) {
      averageTimeSpentInSystem = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOftotalCompletedQueues; i++) {
        totalTimeInSystem =
          totalTimeInSystem + totalCompletedQueues[i].queue_totalTimeInSystem;
      }
      averageTimeSpentInSystem =
        totalTimeInSystem / NumberOftotalCompletedQueues;
    }
    return averageTimeSpentInSystem;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the utilization of server for the shop (overall)
// used in the function 'createShopPerformanceAnalysis'
const calculateUtilizationOfServer = async (
  shopId,
  startTime,
  endTime,
  timeInterval,
  timeToServerACustomer
) => {
  let totalNumberofServer = 0;
  let utilization = 0;
  try {
    const NumberOftotalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueues = await Queue.find({
      queue_shop: shopId,
      // queue_stage: 1,
      queue_servedDateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalServedQueues == 0) {
      utilization = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOftotalServedQueues; i++) {
        totalNumberofServer =
          totalNumberofServer + totalServedQueues[i].queue_numberOfServer;
      }
      const averageNumberOfServer =
        totalNumberofServer / NumberOftotalServedQueues;
      const averageTimeToServerACustomer = convertMillisecondToMinute(
        timeToServerACustomer
      );
      const maxServingCapability =
        (timeInterval / averageTimeToServerACustomer) * averageNumberOfServer;
      utilization = NumberOftotalServedQueues / maxServingCapability;
    }
    return utilization;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the total time to clear the shop queue (overall)
// ROUTE NOT YET CREATED
// not in used because not accurate, there are different activities with different time needed
const totalTimeToClearShopQueue = async (analysisObject, shopId) => {
  let totalTimeToClearShopQueue;
  try {
    const averageTimeToServerACustomer =
      analysisObject.shopPerformanceAnalysis_averageTimeToServerACustomer;
    if (averageTimeToServerACustomer <= 0) {
      totalTimeToClearShopQueue = -1; // -1 means no infor to be used in calculation
    } else {
      const shop = await ShopStatus.findById(shopId);
      const currentQueueLength = shop.shopStatus_queueLength;
      const numberOfServer = shop.shopStatus_numberOfServer;
      totalTimeToClearShopQueue =
        (currentQueueLength * averageTimeToServerACustomer * 60000) /
        numberOfServer;
    }
    return totalTimeToClearShopQueue;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// //warning to add servers
// // ROUTE NOT YET CREATED
// not in used because not accurate, there are different activities with different time needed
const numberOfServerNeeded = async (
  timeToClearCurrentQueue,
  analysisObject,
  shopId
) => {
  let numberOfServerNeeded;
  try {
    const averageTimeToServerACustomer =
      analysisObject.shopPerformanceAnalysis_averageTimeToServerACustomer;
    if (averageTimeToServerACustomer <= 0) {
      totalTimeToClearShopQueue = -1; // -1 means no infor to be used in calculation
    } else {
      const shop = await ShopStatus.findById(shopId);
      const currentQueueLength = shop.shopStatus_queueLength;
      numberOfServerNeeded =
        (currentQueueLength * averageTimeToServerACustomer * 60000) /
        timeToClearCurrentQueue;
    }
    return numberOfServerNeeded;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
