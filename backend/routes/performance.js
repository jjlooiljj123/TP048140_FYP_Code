const express = require("express");

const shopPerformanceController = require("../controllers/shopPerformance");
const activityPerformanceController = require("../controllers/activityPerformance");
const serverPerformanceController = require("../controllers/serverPerformance");
const combinedPerformanceController = require("../controllers/combinedPerformance");

const router = express.Router();

// to retrieve the shopPerformance of the specify day
// http://localhost:8080/performance/shopPerformance/:shopId/?startTime=startTime&endTime=endTime
router.get(
  "/shopPerformance/:shopId",
  shopPerformanceController.getShopPerformanceOfOneDay
);

// to retrieve the shopPerformance analysis of the specified day
// http://localhost:8080/performance/shopPerformanceAnalysis/:shopId/?startTime=startTime&endTime=endTime
router.get(
  "/shopPerformanceAnalysis/:shopId",
  shopPerformanceController.getShopPerformanceAnalysisOfOneDay
);

// ONLY USE FOR DEMO PURPOSE
// to create the shopPerformance analysis of the specified time (interval)
// http://localhost:8080/performance/shopPerformanceAnalysis/:shopId
router.post(
  "/shopPerformanceAnalysis/:shopId",
  combinedPerformanceController.createShopPerformanceAnalysis
);

// ONLY USE FOR DEMO PURPOSE
// to create the activityPerformance analysis of the specified time (interval)
// http://localhost:8080/performance/activityPerformanceAnalysis/:shopId/?activityId=activityId
router.post(
  "/activityPerformanceAnalysis/:shopId",
  combinedPerformanceController.createActivityPerformanceAnalysis
);

// to retrieve the activityPerformance analysis of the specified day
// http://localhost:8080/performance/activityPerformanceAnalysis/:shopId/?activityId=activityId&startTime=startTime&endTime=endTime
router.get(
  "/activityPerformanceAnalysis",
  activityPerformanceController.getActivityPerformanceAnalysisOfOneDay
);

// // NEEDED TO CONVERT INTO WEBSOCKET TO SEND TO FRONT END
// // to get the numbers of server needed
// // http://localhost:8080/performance/serversNeeded/:shopId/?activityId=activityId
// router.post(
//   "/serversNeeded",
//   combinedPerformanceController.warningToAddServerForAnActivity
// );

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceServer/:serverId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceServer/:serverId",
  serverPerformanceController.getServerPerformanceByServer
);

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceShop/:shopId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceShop/:shopId",
  serverPerformanceController.getServerPerformanceByShop
);

// to retrieve the serverPerformance of the specified time
// http://localhost:8080/performance/serverPerformanceActivity/:activityId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceActivity/:activityId",
  serverPerformanceController.getServerPerformanceByActivity
);

// ONLY USE FOR DEMO PURPOSE
// to create the serverPerformance analysis of the specified time (interval)
// http://localhost:8080/performance/serverPerformanceAnalysis/:shopId/?activityId=activityId&serverId=serverId
router.post(
  "/serverPerformanceAnalysis/:shopId",
  combinedPerformanceController.createServerPerformanceAnalysis
);

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisServer/:serverId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceAnalysisServer/:serverId",
  serverPerformanceController.getServerPerformanceAnalysisByServer
);

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisShop/:shopId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceAnalysisShop/:shopId",
  serverPerformanceController.getServerPerformanceAnalysisByShop
);

// to retrieve the serverPerformance analysis of the specified time
// http://localhost:8080/performance/serverPerformanceAnalysisActivity/:activityId/?startTime=startTime&endTime=endTime
router.get(
  "/serverPerformanceAnalysisActivity/:activityId",
  serverPerformanceController.getServerPerformanceAnalysisByActivity
);

module.exports = router;
