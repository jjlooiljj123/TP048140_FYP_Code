const Queue = require("../models/Queue");
const ShopStatus = require("../models/ShopStatus");
const ActivityPerformanceAnalysis = require("../models/ActivityPerformanceAnalysis");
const ShopActivity = require("../models/ShopActivity");
const QueueStructure = require("../models/QueueStructure");
const QueueData = require("../models/QueueData");
const User = require("../models/User");
const shopActivityController = require("../controllers/shopActivity");
const queueStructureController = require("../controllers/activityPerformance");
const shopPerformanceController = require("../controllers/shopPerformance");
const serverPerformanceController = require("../controllers/serverPerformance");
const PerformanceAccumulatedValues = require("../models/PerformanceAccumulatedValues");

const {
  currentDateTime,
  todayDay,
  currentTimestamp,
  convertMillisecondToMinute,
  getHourFromDatetime,
} = require("../Utils/currentDateTime");

// // estimate the total waiting time of an activity with the current queue
// // called in shopActivity controller
// // called in shopStatus controller
// exports.estimatedTimeBasedOnActivity = async (
//   activityId,
//   dayOfWeek,
//   currentDatetime
// ) => {
//   let estimatedTime;
//   let averageTimeToServerACustomer;
//   let queueLength;
//   try {
//     const shopActivity = await ShopActivity.findById(activityId);
//     const activityPerformanceAnalysis = await ActivityPerformanceAnalysis.find({
//       activityPerformanceAnalysis_activityId: activityId,
//       activityPerformanceAnalysis_dayOfWeek: dayOfWeek,
//       activityPerformanceAnalysis_startHour: getHourFromDatetime(
//         currentDatetime
//       ),
//     }).sort({ activityPerformanceAnalysis_createdDatetime: -1 });
//     if (activityPerformanceAnalysis.length > 0) {
//       averageTimeToServerACustomer = convertMillisecondToMinute(
//         activityPerformanceAnalysis[0]
//           .activityPerformanceAnalysis_averageTimeToServerACustomer
//       );
//     } else {
//       // averageTimeToServerACustomer = -1;
//       averageTimeToServerACustomer =
//         shopActivity.shopActivity_defaultTimeToServeACustomer;
//     }
//     queueLength = shopActivity.shopActivity_queueLength;
//     estimatedTime = queueLength * averageTimeToServerACustomer;
//     convertMillisecondToMinute(estimatedTime);
//     return estimatedTime;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// estimate the total waiting time of an activity with the current queue
// called in shopActivity controller
// called in shopStatus controller
exports.estimatedTimeBasedOnActivity = async (
  activityId,
  dayOfWeek,
  currentDatetime
) => {
  let estimatedTime;
  let averageTimeToServerACustomer;
  let queueLength;
  try {
    const shopActivity = await ShopActivity.findById(activityId);
    const performanceAccumulatedValues = await PerformanceAccumulatedValues.find(
      {
        performanceAccumulatedValues_activityId: activityId,
      }
    );
    if (performanceAccumulatedValues.length > 0) {
      averageTimeToServerACustomer = convertMillisecondToMinute(
        performanceAccumulatedValues[0]
          .performanceAccumulatedValues_activityAverageTimeToServerACustomer
      );
    } else {
      // averageTimeToServerACustomer = -1;
      averageTimeToServerACustomer =
        shopActivity.shopActivity_defaultTimeToServeACustomer;
    }
    queueLength = shopActivity.shopActivity_queueLength;
    estimatedTime = queueLength * averageTimeToServerACustomer;
    convertMillisecondToMinute(estimatedTime);
    return estimatedTime;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// calculate the time needed for a server to finish servering a customer based on an activity
// called in queue controller
exports.activityAverageTime = async (
  activityId,
  dayOfWeek,
  currentDatetime
) => {
  return await averageTimeToServerACustomerBasedOnActivity(
    activityId,
    dayOfWeek,
    currentDatetime
  );
};

// // calculate the time needed for a server to finish servering a customer based on an activity
// // called in activityAverageTime function
// const averageTimeToServerACustomerBasedOnActivity = async (
//   activityId,
//   dayOfWeek,
//   currentDatetime
// ) => {
//   let averageTimeToServerACustomer;
//   try {
//     const shopActivity = await ShopActivity.findById(activityId);
//     const activityPerformanceAnalysis = await ActivityPerformanceAnalysis.find({
//       activityPerformanceAnalysis_activityId: activityId,
//       activityPerformanceAnalysis_dayOfWeek: dayOfWeek,
//       activityPerformanceAnalysis_startHour: getHourFromDatetime(
//         currentDatetime
//       ),
//     }).sort({ activityPerformanceAnalysis_createdDatetime: -1 });
//     if (activityPerformanceAnalysis.length > 0) {
//       averageTimeToServerACustomer = convertMillisecondToMinute(
//         activityPerformanceAnalysis[0]
//           .activityPerformanceAnalysis_averageTimeToServerACustomer
//       );
//     } else {
//       // averageTimeToServerACustomer = -1;
//       averageTimeToServerACustomer =
//         shopActivity.shopActivity_defaultTimeToServeACustomer;
//     }
//     return averageTimeToServerACustomer;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// calculate the time needed for a server to finish servering a customer based on an activity
// called in activityAverageTime function
const averageTimeToServerACustomerBasedOnActivity = async (
  activityId,
  dayOfWeek,
  currentDatetime
) => {
  let averageTimeToServerACustomer;
  try {
    const shopActivity = await ShopActivity.findById(activityId);
    const performanceAccumulatedValues = await PerformanceAccumulatedValues.find(
      {
        performanceAccumulatedValues_activityId: activityId,
      }
    );

    if (performanceAccumulatedValues.length > 0) {
      averageTimeToServerACustomer = convertMillisecondToMinute(
        performanceAccumulatedValues[0]
          .performanceAccumulatedValues_activityAverageTimeToServerACustomer
      );
    } else {
      // averageTimeToServerACustomer = -1;
      averageTimeToServerACustomer =
        shopActivity.shopActivity_defaultTimeToServeACustomer;
    }
    return averageTimeToServerACustomer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// calculate the total estiamted waiting time of the stage 1 queue
// called in queue controller
// called in shopActivity controller
// called in shopStatus controller
exports.stageOneEstimatedTime = async (shopId, dayOfWeek, currentDatetime) => {
  let newWaitingTimeForNextCustomer = 0;
  try {
    const stegeOneQueues = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 1,
    }).sort({ queue_queueDateTime: -1 });

    const stegeOneServedQueues = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).sort({ queue_servedDateTime: 1 });

    // works if theres only 1 server
    if (stegeOneQueues.length > 0) {
      const lastQueue = stegeOneQueues[0];
      const lastQUeueWaitingTime = lastQueue.queue_estimatedWaitingTime;
      const lastQueueActivityId = lastQueue.queue_activityId;
      const lastQueueRequiredTime = await averageTimeToServerACustomerBasedOnActivity(
        lastQueueActivityId,
        dayOfWeek,
        currentDatetime
      );
      newWaitingTimeForNextCustomer =
        lastQueueRequiredTime + lastQUeueWaitingTime;
    } else if (stegeOneQueues.length == 0 && stegeOneServedQueues.length > 0) {
      const servedFirstQueue = stegeOneServedQueues[0];
      const servingActivityId = servedFirstQueue.queue_activityId;
      const servingActivityRequiredTime = await averageTimeToServerACustomerBasedOnActivity(
        servingActivityId,
        dayOfWeek,
        currentDatetime
      );
      const timeLeftToComplete =
        servingActivityRequiredTime -
        convertMillisecondToMinute(
          currentTimestamp().getTime() -
            servedFirstQueue.queue_servedTimestamp.getTime()
        );
      newWaitingTimeForNextCustomer = timeLeftToComplete;
    }

    return newWaitingTimeForNextCustomer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// not sure what to do?????????????????????????????????
exports.updateQueuesEstimatedTimeStageOne = async (shopId) => {
  try {
    const stageOneCurrentlyServing = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).sort({ queue_servedDateTime: 1 });

    const stegeOneQueues = await Queue.find({
      queue_queueStatus: 1,
      queue_shop: shopId,
      queue_stage: 1,
    }).sort({ queue_queueDateTime: 1 });

    const stegeOneQueuesReverse = await Queue.find({
      queue_queueStatus: 1,
      queue_shop: shopId,
      queue_stage: 1,
    }).sort({ queue_queueDateTime: -1 });

    const stageOneNumberOfServer = serverPerformanceController.getNumberOfServersOfStageOne(
      shopId
    );

    for (let i = 0; i < stegeOneQueues.length; i++) {
      // if
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// not sure where to use it????????????????????????????????????????????
exports.calculateTimeLeftToServeACustomer = async (queueId) => {
  try {
    const queue = await Queue.findById(queueId);
    const activityId = queue.queue_activityId;
    const timeNeededForActivity = averageTimeToServerACustomerBasedOnActivity(
      activityId,
      todayDay(),
      currentDateTime()
    );
    const timeLeftToServeACustomer =
      timeNeededForActivity -
      convertMillisecondToMinute(
        currentTimestamp().getTime() - queue_servedTimestamp.getTime
      );
    return timeLeftToServeACustomer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// timeDifferenceBetweenNowAndServed
// not used
exports.stageOneTimeDifferenceBetweenNowAndServed = async (
  shopId,
  activityAverageTime
) => {
  let timeDifferenceBetweenNowAndServed = activityAverageTime - 1;
  try {
    const stageOneCurrentlyServing = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 2,
    }).sort({ queue_servedDateTime: 1 });
    if (stageOneCurrentlyServing.length > 0) {
      const firstServingServedTimeStamp =
        stageOneCurrentlyServing[0].queue_servedTimestamp;
      timeDifferenceBetweenNowAndServed =
        convertMillisecondToMinute(
          currentTimestamp().getTime() - firstServingServedTimeStamp.getTime()
        ) - 1; // minus 1 because it was ceil, not floor
    }
    return timeDifferenceBetweenNowAndServed;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// calculate the total queue length of the stage 1 queue
// called in queue controller
// called in shopActivity controller
// called in shopStatus controller
exports.stageOneLength = async (shopId) => {
  let stageOneQueueLength;
  try {
    // const shopStatus = await ShopStatus.findById(shopId);
    const numberOfStegeOneQueues = await Queue.find({
      queue_shop: shopId,
      queue_stage: 1,
      queue_queueStatus: 1,
    }).countDocuments();
    stageOneQueueLength = numberOfStegeOneQueues;
    // console.log("stageOneQueueLength:", stageOneQueueLength);
    return stageOneQueueLength;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
