const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopPerformanceAnalysisSchema = mongoose.Schema({
  shopPerformanceAnalysis_shop: {
    type: String,
    required: true,
  },
  shopPerformanceAnalysis_createdtDatetime: {
    type: String,
    required: true,
  },
  shopPerformanceAnalysis_createdTimestamp: {
    type: Date,
    required: true,
  },
  shopPerformanceAnalysis_startTime: {
    type: Number,
  },
  shopPerformanceAnalysis_endTime: {
    type: Number,
  },
  shopPerformanceAnalysis_dayOfWeek: {
    type: String,
    required: true,
  },
  shopPerformanceAnalysis_arrivalRate: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_serviceRate: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_serviceRatePerServer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_averageInterarrivalTime: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_averageTimeToServerACustomer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_averageTimeSpentInQueue: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_averageTimeSpentInSystem: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_utilizationOfServer: {
    // type: mongoose.Types.Decimal128,
    type: Number,
  },
  shopPerformanceAnalysis_hour: {
    type: String,
  },
});

module.exports = mongoose.model(
  "ShopPerformanceAnalysis",
  shopPerformanceAnalysisSchema
);
