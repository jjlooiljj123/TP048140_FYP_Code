const ActivityPerformanceAnalysis = require("../models/ActivityPerformanceAnalysis");
const Queue = require("../models/Queue");
const QueueData = require("../models/QueueData");
const ShopStatus = require("../models/ShopStatus");
const ShopActivity = require("../models/ShopActivity");
const PerformanceAccumulatedValues = require("../models/PerformanceAccumulatedValues");

const {
  currentDateTime,
  todayDay,
  currentTimestamp,
  getHourFromDatetime,
  convertMillisecondToMinute,
} = require("../Utils/currentDateTime");

// create createActivityPerformance, used for data analysis
// ROUTE NOT YET CREATED
exports.createActivityPerformanceAnalysis = async (
  shopId,
  activityId,
  startTime,
  endTime,
  timeInterval
) => {
  try {
    const arrivalRate = await calculateArrivalRate(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const serviceRate = await calculateServiceRate(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const serviceRatePerServer = await calculateServiceRatePerServer(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const averageInterarrivalTime = await calculateInterarrivalTime(
      shopId,
      activityId,
      startTime,
      endTime,
      timeInterval
    );
    const averageTimeToServerACustomer = await calculateAverageTimeToServeACustomer(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const averageTimeSpentInQueue = await calculateAverageTimeSpentInQueue(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const averageTimeSpentInSystem = await calculateAverageTimeSpentInSystem(
      shopId,
      activityId,
      startTime,
      endTime
    );
    const utilizationOfServer = await calculateUtilizationOfServer(
      shopId,
      activityId,
      startTime,
      endTime,
      timeInterval,
      averageTimeToServerACustomer
    );
    const activityPerformanceAnalysis = ActivityPerformanceAnalysis({
      activityPerformanceAnalysis_shop: shopId,
      activityPerformanceAnalysis_activityId: activityId,
      activityPerformanceAnalysis_createdDatetime: currentDateTime(),
      activityPerformanceAnalysis_createdTimestamp: currentTimestamp(),
      activityPerformanceAnalysis_startTime: startTime,
      activityPerformanceAnalysis_endTime: endTime,
      activityPerformanceAnalysis_dayOfWeek: todayDay(),
      activityPerformanceAnalysis_startHour: getHourFromDatetime(startTime),
      activityPerformanceAnalysis_arrivalRate: arrivalRate,
      activityPerformanceAnalysis_serviceRate: serviceRate,
      activityPerformanceAnalysis_serviceRatePerServer: serviceRatePerServer,
      activityPerformanceAnalysis_averageInterarrivalTime: averageInterarrivalTime,
      activityPerformanceAnalysis_averageTimeToServerACustomer: averageTimeToServerACustomer,
      activityPerformanceAnalysis_averageTimeSpentInQueue: averageTimeSpentInQueue,
      activityPerformanceAnalysis_averageTimeSpentInSystem: averageTimeSpentInSystem,
      activityPerformanceAnalysis_utilizationOfServer: utilizationOfServer,
    });
    const activityPerformanceAnalysisResult = activityPerformanceAnalysis.save();
    return activityPerformanceAnalysisResult;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve the activityPerformance analysis of the specified day
// http://localhost:8080/performance/activityPerformanceAnalysis/:shopId/?activityId=activityId&startTime=startTime&endTime=endTime
exports.getActivityPerformanceAnalysisOfOneDay = async (req, res, next) => {
  const shopId = req.params.shopId;
  const activityId = req.query.activityId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopStatus = await ShopStatus.findById(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    const shopActivity = await ShopActivity.findById(activityId);
    if (!shopActivity) {
      const error = new Error("No shop activity found.");
      error.statusCode = 404;
      return next(error);
    }
    const numberOfActivityPerformanceAnalysis = await ActivityPerformanceAnalysis.find(
      {
        activityPerformanceAnalysis_shop: shopId,
        activityPerformanceAnalysis_activityId: activityId,
        activityPerformanceAnalysis_startTime: { $gt: startTime, $lt: endTime },
      }
    ).countDocuments();
    const activityPerformanceAnalysis = await ShopPerformanceAnalysis.find({
      activityPerformanceAnalysis_shop: shopId,
      activityPerformanceAnalysis_activityId: activityId,
      activityPerformanceAnalysis_startTime: { $gt: startTime, $lt: endTime },
    }).sort({ activityPerformanceAnalysis_createdTimestamp: 1 });
    res.status(200).json({
      message: "shopPerformanceAnalysis fetched.",
      numberOfActivityPerformanceAnalysis: numberOfActivityPerformanceAnalysis,
      activityPerformanceAnalysis: activityPerformanceAnalysis,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to calculate the arrival rate of the specific shop activity
// used in the function 'createActivityPerformance'
const calculateArrivalRate = async (shopId, activityId, startTime, endTime) => {
  try {
    const numberOfTotalCreatedQueuesData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
      queueData_status: 1,
    }).countDocuments();
    // const totalCreatedQueuesData = await QueueData.find({
    //   queueData_shopId: shopId,
    //   queueData_shopActivityId: activityId,
    //   queueData_dateTime: { $gt: 20200804003700, $lt: 20200804004700 },
    //   // queueData_status: 1,
    // });
    // console.log("totalCreatedQueuesData:", totalCreatedQueuesData);
    console.log("calculateArrivalRate:", numberOfTotalCreatedQueuesData);
    return numberOfTotalCreatedQueuesData;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the service rate per server of the specific shop activity
// used in the function 'createActivityPerformance'
const calculateServiceRatePerServer = async (
  shopId,
  activityId,
  startTime,
  endTime
) => {
  let totalNumberofServer = 0;
  let averageServiceRatePerServer;
  try {
    const numberOfTotalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });
    if (numberOfTotalServedQueueData == 0) {
      averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < numberOfTotalServedQueueData; i++) {
        totalNumberofServer =
          totalNumberofServer +
          totalServedQueueData[i].queueData_numberOfServer;
      }

      const averageNumberOfServer =
        totalNumberofServer / numberOfTotalServedQueueData;

      averageServiceRatePerServer =
        numberOfTotalServedQueueData / averageNumberOfServer;
    }

    console.log("calculateServiceRatePerServer:", averageServiceRatePerServer);
    return averageServiceRatePerServer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the total service rate of the specific shop activity
// used in the function 'createActivityPerformance'
const calculateServiceRate = async (shopId, activityId, startTime, endTime) => {
  try {
    const numberOfTotalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    console.log("calculateServiceRate:", numberOfTotalServedQueueData);
    return numberOfTotalServedQueueData;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the interarrival time of the customer for the specific shop activity
// used in the function 'createActivityPerformance'
const calculateInterarrivalTime = async (
  shopId,
  activityId,
  startTime,
  endTime,
  timeInterval
) => {
  let interArrivalTime = 0;
  try {
    const NumberOfTotalCreatedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 1,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    if (NumberOfTotalCreatedQueueData > 0) {
      interArrivalTime = timeInterval / NumberOfTotalCreatedQueueData;
    }
    console.log("calculateInterarrivalTime:", interArrivalTime);
    return interArrivalTime;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// // to calculate the average time to for a server to serve a customer for the specific shop activity
// // used in the function 'createActivityPerformance'
// const calculateAverageTimeToServeACustomer = async (
//   shopId,
//   activityId,
//   startTime,
//   endTime
// ) => {
//   let totalServingTime;
//   let averageTimeToServeACustomer;
//   try {
//     const NumberOfTotalServedQueueData = await QueueData.find({
//       queueData_shopId: shopId,
//       queueData_shopActivityId: activityId,
//       queueData_status: 3,
//       queueData_dateTime: { $gt: startTime, $lt: endTime },
//     }).countDocuments();
//     const totalServedQueueData = await QueueData.find({
//       queueData_shopId: shopId,
//       queueData_shopActivityId: activityId,
//       queueData_status: 3,
//       queueData_dateTime: { $gt: startTime, $lt: endTime },
//     });
//     if (NumberOfTotalServedQueueData == 0) {
//       averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
//     } else {
//       for (let i = 0; i < NumberOfTotalServedQueueData; i++) {
//         let totalCalledQueueData = await QueueData.find({
//           queueData_queue: totalServedQueueData[i].queueData_queue,
//           queueData_shopActivityId: activityId,
//           queueData_status: 2,
//         });
//         let servingTime =
//           totalServedQueueData[i].queueData_timestamp.getTime() -
//           totalCalledQueueData[0].queueData_timestamp.getTime();
//         totalServingTime = totalServingTime + servingTime;
//       }
//       averageTimeToServeACustomer =
//         totalServingTime / NumberOfTotalServedQueueData;
//     }
//     return averageTimeToServeACustomer;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// to calculate the average time to for a server to serve a customer for the specific shop activity
// used in the function 'createActivityPerformance'
const calculateAverageTimeToServeACustomer = async (
  shopId,
  activityId,
  startTime,
  endTime
) => {
  let totalServingTime = 0;
  let averageTimeToServeACustomer = 0;
  try {
    const NumberOfTotalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });

    if (NumberOfTotalServedQueueData == 0) {
      console.log("NumberOfTotalServedQueueData == 0");
      averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
    } else {
      console.log(
        "NumberOfTotalServedQueueData != 0",
        NumberOfTotalServedQueueData
      );
      for (let i = 0; i < NumberOfTotalServedQueueData; i++) {
        let totalCalledQueueData = await QueueData.find({
          queueData_queue: totalServedQueueData[i].queueData_queue,
          queueData_shopActivityId: activityId,
          queueData_status: 2,
        });
        let servingTime =
          totalServedQueueData[i].queueData_timestamp.getTime() -
          totalCalledQueueData[0].queueData_timestamp.getTime();
        totalServingTime = totalServingTime + servingTime;
      }
      console.log("totalServingTime", totalServingTime);
      averageTimeToServeACustomer =
        totalServingTime / NumberOfTotalServedQueueData;

      console.log("averageTimeToServeACustomer", averageTimeToServeACustomer);
      const performanceAccumulatedValues = await PerformanceAccumulatedValues.find(
        {
          performanceAccumulatedValues_activityId: activityId,
        }
      );
      console.log("performanceAccumulatedValues", performanceAccumulatedValues);
      if (performanceAccumulatedValues.length == 0) {
        console.log("enter if");
        let newPerformanceAccumulatedValues = PerformanceAccumulatedValues({
          performanceAccumulatedValues_activityId: activityId,
          performanceAccumulatedValues_activityQuantityCounted: NumberOfTotalServedQueueData,
          performanceAccumulatedValues_activityAverageTimeToServerACustomer: averageTimeToServeACustomer,
        });
        const resultPerformanceAccumulatedValues = await newPerformanceAccumulatedValues.save();
      } else {
        console.log("enter else");
        const oldNumberOfTotalServedQueues =
          performanceAccumulatedValues[0]
            .performanceAccumulatedValues_activityQuantityCounted;
        console.log(
          "oldNumberOfTotalServedQueues",
          oldNumberOfTotalServedQueues
        );
        const oldAverageTimeToServeACustomer =
          performanceAccumulatedValues[0]
            .performanceAccumulatedValues_activityAverageTimeToServerACustomer;
        console.log(
          "oldAverageTimeToServeACustomer",
          oldAverageTimeToServeACustomer
        );
        const totalNumberOfTotalServedQueues =
          oldNumberOfTotalServedQueues + NumberOfTotalServedQueueData;
        console.log(
          "totalNumberOfTotalServedQueues",
          totalNumberOfTotalServedQueues
        );
        const oldTotalServingTime =
          oldNumberOfTotalServedQueues * oldAverageTimeToServeACustomer;
        console.log("oldTotalServingTime", oldTotalServingTime);
        const newTotalServingTime = oldTotalServingTime + totalServingTime;
        console.log("newTotalServingTime", newTotalServingTime);
        averageTimeToServeACustomer =
          newTotalServingTime / totalNumberOfTotalServedQueues;
        console.log("averageTimeToServeACustomer", averageTimeToServeACustomer);
        performanceAccumulatedValues[0].performanceAccumulatedValues_activityQuantityCounted = totalNumberOfTotalServedQueues;
        performanceAccumulatedValues[0].performanceAccumulatedValues_activityAverageTimeToServerACustomer = averageTimeToServeACustomer;
        const resultPerformanceAccumulatedValues = await performanceAccumulatedValues[0].save();
      }
    }
    console.log(
      "calculateAverageTimeToServeACustomer:",
      averageTimeToServeACustomer
    );
    return averageTimeToServeACustomer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the average time to for a customer spent in queue for the specific shop activity
// used in the function 'createActivityPerformance'
const calculateAverageTimeSpentInQueue = async (
  shopId,
  activityId,
  startTime,
  endTime
) => {
  let totalWaitingTime = 0;
  let averageTotalWaitingTime = 0;
  try {
    const NumberOftotalCalledQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalCalledQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalCalledQueueData == 0) {
      averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
    } else {
      console.log("enter else");
      for (let i = 0; i < NumberOftotalCalledQueueData; i++) {
        let totalQueueQueueData = await QueueData.find({
          queueData_queue: totalCalledQueueData[i].queueData_queue,
          queueData_shopActivityId: activityId,
          queueData_status: 1,
        });

        let queuingTime =
          totalCalledQueueData[i].queueData_timestamp.getTime() -
          totalQueueQueueData[0].queueData_timestamp.getTime();

        totalWaitingTime = totalWaitingTime + queuingTime;
      }
      averageTotalWaitingTime = totalWaitingTime / NumberOftotalCalledQueueData;
    }
    console.log("calculateAverageTimeSpentInQueue:", averageTotalWaitingTime);
    return averageTotalWaitingTime;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the average time to for a customer spent in system for the specific shop activity
// used in the function 'createActivityPerformance'
const calculateAverageTimeSpentInSystem = async (
  shopId,
  activityId,
  startTime,
  endTime
) => {
  let totalTimeInSystem = 0;
  let averageTimeSpentInSystem = 0;
  try {
    const NumberOftotalCompletedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalCompletedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 3,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalCompletedQueueData == 0) {
      averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOftotalCompletedQueueData; i++) {
        let totalQueueQueueData = await QueueData.find({
          queueData_queue: totalCompletedQueueData[i].queueData_queue,
          queueData_shopActivityId: activityId,
          queueData_status: 1,
        });
        let timeSpentInSystem =
          totalCompletedQueueData[i].queueData_timestamp.getTime() -
          totalQueueQueueData[0].queueData_timestamp.getTime();

        totalTimeInSystem = totalTimeInSystem + timeSpentInSystem;
      }
      averageTimeSpentInSystem =
        totalTimeInSystem / NumberOftotalCompletedQueueData;
    }
    console.log("calculateAverageTimeSpentInSystem:", averageTimeSpentInSystem);
    return averageTimeSpentInSystem;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to calculate the utilization of server for the specific shop activity
// used in the function 'createActivityPerformance'
const calculateUtilizationOfServer = async (
  shopId,
  activityId,
  startTime,
  endTime,
  timeInterval,
  timeToServerACustomer
) => {
  let totalNumberofServer = 0;
  let utilization = 0;
  try {
    const NumberOftotalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    }).countDocuments();
    const totalServedQueueData = await QueueData.find({
      queueData_shopId: shopId,
      queueData_shopActivityId: activityId,
      queueData_status: 2,
      queueData_dateTime: { $gt: startTime, $lt: endTime },
    });
    if (NumberOftotalServedQueueData == 0) {
      averageServiceRatePerServer = -1; // -1 means no infor to be used in calculation
    } else {
      for (let i = 0; i < NumberOftotalServedQueueData; i++) {
        totalNumberofServer =
          totalNumberofServer +
          totalServedQueueData[i].queueData_numberOfServer;
      }
      const averageNumberOfServer =
        totalNumberofServer / NumberOftotalServedQueueData;
      const averageTimeToServerACustomer = convertMillisecondToMinute(
        timeToServerACustomer
      );
      const maxServingCapability =
        (timeInterval / averageTimeToServerACustomer) * averageNumberOfServer;
      console.log("averageTimeToServerACustomer", averageTimeToServerACustomer);
      console.log("averageNumberOfServer", averageNumberOfServer);
      console.log("timeInterval", timeInterval);
      console.log("maxServingCapability", maxServingCapability);
      console.log("NumberOftotalServedQueueData", NumberOftotalServedQueueData);
      utilization = NumberOftotalServedQueueData / maxServingCapability;
    }
    console.log("calculateUtilizationOfServer:", utilization);
    return utilization;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// // to calculate the total time to clear the shop queue (stage 1 only)
// // ROUTE NOT YET CREATED
// const totalTimeToClearActivityQueue = async (analysisObject, activityId) => {
//   let totalTimeToClearActivityQueue;
//   try {
//     const averageTimeToServerACustomer =
//       analysisObject.activityPerformanceAnalysis_averageTimeToServerACustomer;
//     if (averageTimeToServerACustomer <= 0) {
//       totalTimeToClearShopQueue = -1; // -1 means no infor to be used in calculation
//     } else {
//       const shopActivity = await ShopActivity.findById(activityId);
//       const currentQueueLength = shopActivity.shopActivity_queueLength;
//       const numberOfServer = shop.shopStatus_numberOfServer; //no record for how many server for that activity
//       totalTimeToClearActivityQueue =
//         (currentQueueLength * averageTimeToServerACustomer * 60000) /
//         numberOfServer;
//     }
//     return totalTimeToClearShopQueue;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// //warning to add servers
// // called in combined performance controller
// exports.numberOfServerNeeded = async (
//   timeToClearCurrentQueue,
//   analysisObject,
//   activityId
// ) => {
//   try {
//     const averageTimeToServerACustomer =
//       analysisObject.activityPerformanceAnalysis_averageTimeToServerACustomer;
//     const shopActivity = await ShopActivity.findById(activityId);
//     const currentQueueLength = shopActivity.shopActivity_queueLength;
//     const numberOfServerNeeded =
//       (currentQueueLength * averageTimeToServerACustomer * 60000) /
//       timeToClearCurrentQueue;
//     return numberOfServerNeeded;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };
