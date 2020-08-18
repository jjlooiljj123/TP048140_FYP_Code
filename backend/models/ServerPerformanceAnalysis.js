const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serverPerformanceAnalysisSchema = mongoose.Schema({
  serverPerformanceAnalysis_startDateTime: {
    type: Number,
    required: true,
  },
  // serverPerformanceAnalysis_startTimestamp: {
  //   type: Date,
  //   required: true,
  // },
  serverPerformanceAnalysis_endDateTime: {
    type: Number,
    default: -1,
  },
  // serverPerformanceAnalysis_endTimestamp: {
  //   type: Date,
  // },
  serverPerformanceAnalysis_analysisCreatedTimestamp: {
    type: Date,
  },
  serverPerformanceAnalysis_serverId: {
    type: String,
    required: true,
  },
  serverPerformanceAnalysis_activityId: {
    type: String,
    required: true,
  },
  serverPerformanceAnalysis_shopId: {
    type: String,
    required: true,
  },
  serverPerformanceAnalysis_totalCustomerServed: {
    type: Number,
  },
  serverPerformanceAnalysis_averageTimeToServeAcustomer: {
    type: String,
  },
});

module.exports = mongoose.model(
  "ServerPerformanceAnalysis",
  serverPerformanceAnalysisSchema
);
