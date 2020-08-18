const ServerPerformance = require("../models/ServerPerformance");
const ServerPerformanceAnalysis = require("../models/ServerPerformanceAnalysis");
const Queue = require("../models/Queue");
const User = require("../models/User");
const QueueData = require("../models/QueueData");
const ShopStatus = require("../models/ShopStatus");
const ShopActivity = require("../models/ShopActivity");

const {
  currentDateTime,
  todayDay,
  currentTimestamp,
} = require("../Utils/currentDateTime");

// to create a record for recording the performance of the staff when the staff start serving an for activity
// called in shopstatus controller
exports.createServerPerformance = async (serverId, activityId, shopId) => {
  try {
    const serverPerformance = ServerPerformance({
      serverPerformance_startDateTime: currentDateTime(),
      serverPerformance_startTimestamp: currentTimestamp(),
      serverPerformance_dayOfWeek: todayDay(),
      serverPerformance_serverId: serverId,
      serverPerformance_activityId: activityId,
      serverPerformance_shopId: shopId,
    });
    const serverPerformanceResult = await serverPerformance.save();
    // return serverPerformanceResult
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to end a record for recording the performance of the staff when the staff stop serving an for activity
// called in shopstatus controller
exports.updateServerPerformanceEndtime = async (serverId, activityId) => {
  let updatedResult;
  try {
    const serverPerformance = await ServerPerformance.find({
      serverPerformance_serverId: serverId,
      serverPerformance_activityId: activityId,
      serverPerformance_endDateTime: -1,
    }).sort({ serverPerformance_startDateTime: -1 });
    if (serverPerformance.length > 0) {
      serverPerformance[0].serverPerformance_endDateTime = currentDateTime();
      serverPerformance[0].serverPerformance_endTimestamp = currentTimestamp();
      updatedResult = await serverPerformance[0].save();
    } else {
      return;
    }
    // return updatedResult
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceServer/:serverId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceByServer = async (req, res, next) => {
  const serverId = req.params.serverId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;

  try {
    const server = await User.findById(serverId);
    if (!server) {
      const error = new Error("No server.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformances = await ServerPerformance.find({
      serverPerformance_serverId: serverId,
      serverPerformance_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance fetched.",
      serverPerformances: serverPerformances,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceShop/:shopId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceByShop = async (req, res, next) => {
  const shopId = req.params.shopId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopStatus = await User.ShopStatus(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformances = await ServerPerformance.find({
      serverPerformance_shopId: shopId,
      serverPerformance_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance fetched.",
      serverPerformances: serverPerformances,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceActivity/:activityId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceByActivity = async (req, res, next) => {
  const activityId = req.params.activityId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopActivity = await User.ShopActivity(activityId);
    if (!shopActivity) {
      const error = new Error("No shop activity found.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformances = await ServerPerformance.find({
      serverPerformance_activityId: activityId,
      serverPerformance_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance fetched.",
      serverPerformances: serverPerformances,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to get the number of active server of an activity
// called in queue controller
// called in shopstatus controller
exports.getNumberOfActiveServerOfActivity = async (activityId) => {
  try {
    const numberOfActiveServer = await ServerPerformance.find({
      serverPerformance_activityId: activityId,
      serverPerformance_endDateTime: -1,
    }).countDocuments();
    return numberOfActiveServer;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// // to get the number of active server of an activity
// // called in queue controller
// // called in queueLengthAndTimeCalculation
// // called in combinedPerformance controller
// exports.getNumberOfServersOfStageOne = async (shopId) => {
//   let numberOfServer = 0;
//   try {
//     const stageOneActivities = await ShopActivity.find({
//       shopActivity_queueStage: 1,
//       shopActivity_shopStatus: shopId,
//     });
//     for (let i = 0; i < stageOneActivities.length; i++) {
//       const numberOfActiveServer = await ServerPerformance.find({
//         serverPerformance_activityId: stageOneActivities[i]._id,
//         serverPerformance_endDateTime: -1,
//       }).countDocuments();
//       numberOfServer = numberOfServer + numberOfActiveServer;
//     }
//     return numberOfServer;
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     throw err;
//   }
// };

// to get the number of active server of an activity
// called in queue controller
// called in queueLengthAndTimeCalculation
// called in combinedPerformance controller
exports.getNumberOfServersOfStageOne = async (shopId) => {
  let numberOfServer = 0;
  let arrayServers = [];
  let finalArray = [];
  try {
    const stageOneActivities = await ShopActivity.find({
      shopActivity_queueStage: 1,
      shopActivity_shopStatus: shopId,
    });
    for (let i = 0; i < stageOneActivities.length; i++) {
      const activeServer = await ServerPerformance.find({
        serverPerformance_activityId: stageOneActivities[i]._id,
        serverPerformance_endDateTime: -1,
      });
      arrayServers.push(activeServer);
      // numberOfServer = numberOfServer + numberOfActiveServer;
    }

    for (let i = 0; i < arrayServers.length; i++) {
      finalArray = finalArray.concat(arrayServers[i]);
    }

    let setObj = new Set(); // create key value pair from array of array
    let result = finalArray.reduce((acc, item) => {
      if (!setObj.has(item.serverPerformance_serverId)) {
        setObj.add(item.serverPerformance_serverId, item);
        acc.push(item);
      }
      return acc;
    }, []); //converting back to array from mapobject

    // console.log("finalArray", result);

    return result.length;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to create the serverPerformance analysis of the specified time
// called in combined performnce controller
exports.createServerPerformanceAnalysis = async (
  serverId,
  activityId,
  startTime,
  endTime,
  shopId
) => {
  let totalServingTime;
  let averageTimeToServeACustomer;
  try {
    const numberOfServedQueues = await QueueData.find({
      queueData_shopActiviy: activityId,
      queueData_shopActivityId: serverId,
      queueData_queueLength: { $gt: startTime, $lt: endTime },
      queueData_status: 3,
    }).countDocuments();
    const servedQueues = await QueueData.find({
      queueData_shopActiviy: activityId,
      queueData_shopActivityId: serverId,
      queueData_queueLength: { $gt: startTime, $lt: endTime },
      queueData_status: 3,
    });
    if (numberOfServedQueues == 0) {
      averageTimeToServeACustomer = -1;
    } else {
      for (let i = 0; i < numberOfServedQueues; i++) {
        let totalCalledQueueData = await QueueData.find({
          queueData_queue: servedQueues[i].queueData_queue,
          queueData_shopActivityId: activityId,
          queueData_status: 2,
        });
        let servingTime =
          servedQueues[i].queueData_timestamp.getTime() -
          totalCalledQueueData[0].queueData_timestamp.getTime();
        totalServingTime = totalServingTime + servingTime;
      }
      averageTimeToServeACustomer = totalServingTime / numberOfServedQueues;
    }
    const serverPerformanceAnalysis = ServerPerformanceAnalysis({
      serverPerformanceAnalysis_startDateTime: startTime,
      serverPerformanceAnalysis_endDateTime: endTime,
      serverPerformanceAnalysis_analysisCreatedTimestamp: currentTimestamp(),
      serverPerformanceAnalysis_serverId: serverId,
      serverPerformanceAnalysis_activityId: activityId,
      serverPerformanceAnalysis_shopId: shopId,
      serverPerformanceAnalysis_totalCustomerServed: numberOfServedQueues,
      serverPerformanceAnalysis_averageTimeToServeAcustomer: averageTimeToServeACustomer,
    });
    const serverPerformanceAnalysisResult = await serverPerformanceAnalysis.save();
    return serverPerformanceAnalysisResult;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisServer/:serverId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceAnalysisByServer = async (req, res, next) => {
  const serverId = req.params.serverId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;

  try {
    const server = await User.findById(serverId);
    if (!server) {
      const error = new Error("No server.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformanceAnalysis = await ServerPerformanceAnalysis.find({
      serverPerformanceAnalysis_serverId: serverId,
      serverPerformanceAnalysis_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance Analysis fetched.",
      serverPerformanceAnalysis: serverPerformanceAnalysis,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisShop/:shopId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceAnalysisByShop = async (req, res, next) => {
  const shopId = req.params.shopId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopStatus = await User.ShopStatus(shopId);
    if (!shopStatus) {
      const error = new Error("No shop found.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformanceAnalysis = await ServerPerformanceAnalysis.find({
      serverPerformanceAnalysis_shopId: shopId,
      serverPerformanceAnalysis_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance Analysis fetched.",
      serverPerformanceAnalysis: serverPerformanceAnalysis,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisActivity/:activityId/?startTime=startTime&endTime=endTime
exports.getServerPerformanceAnalysisByActivity = async (req, res, next) => {
  const activityId = req.params.activityId;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  try {
    const shopActivity = await User.ShopActivity(activityId);
    if (!shopActivity) {
      const error = new Error("No shop activity found.");
      error.statusCode = 404;
      return next(error);
    }
    const serverPerformanceAnalysis = await ServerPerformanceAnalysis.find({
      serverPerformanceAnalysis_activityId: activityId,
      serverPerformanceAnalysis_startDateTime: { $gt: startTime, $lt: endTime },
    });
    res.status(200).json({
      message: "server performance Analysis fetched.",
      serverPerformanceAnalysis: serverPerformanceAnalysis,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
