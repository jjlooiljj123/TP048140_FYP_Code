const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityPerformanceAnalysisSchema = mongoose.Schema({
  activityPerformanceAnalysis_shop: {
    type: String,
    required: true,
  },
  activityPerformanceAnalysis_activityId: {
    type: String,
    required: true,
  },
  activityPerformanceAnalysis_createdDatetime: {
    type: Number,
    required: true,
  },
  activityPerformanceAnalysis_createdTimestamp: {
    type: Date,
    required: true,
  },
  activityPerformanceAnalysis_startTime: {
    type: Number,
  },
  activityPerformanceAnalysis_endTime: {
    type: Number,
  },
  activityPerformanceAnalysis_dayOfWeek: {
    type: String,
    required: true,
  },
  activityPerformanceAnalysis_startHour: {
    type: Number,
  },
  activityPerformanceAnalysis_arrivalRate: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_serviceRate: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_serviceRatePerServer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_averageInterarrivalTime: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_averageTimeToServerACustomer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_averageTimeSpentInQueue: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_averageTimeSpentInSystem: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  activityPerformanceAnalysis_utilizationOfServer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
});

module.exports = mongoose.model(
  "ActivityPerformanceAnalysis",
  activityPerformanceAnalysisSchema
);
