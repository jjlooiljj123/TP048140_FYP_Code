const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PerformanceAccumulatedValuesSchema = new mongoose.Schema({
  performanceAccumulatedValues_activityAverageTimeToServerACustomer: {
    type: Number,
  },
  performanceAccumulatedValues_activityQuantityCounted: {
    type: Number,
  },
  performanceAccumulatedValues_shopAverageTimeToServerACustomer: {
    type: Number,
  },
  performanceAccumulatedValues_shopQuantityCounted: {
    type: Number,
  },
  performanceAccumulatedValues_activityId: {
    type: String,
  },
  performanceAccumulatedValues_shopId: {
    type: String,
  },
  performanceAccumulatedValues_latestTimestamp: {
    type: Date,
  },
});

module.exports = mongoose.model(
  "PerformanceAccumulatedValues",
  PerformanceAccumulatedValuesSchema
);
