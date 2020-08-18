const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serverPerformanceSchema = mongoose.Schema({
  serverPerformance_startDateTime: {
    type: Number,
    required: true,
  },
  serverPerformance_startTimestamp: {
    type: Date,
    required: true,
  },
  serverPerformance_dayOfWeek: {
    type: String,
    required: true,
  },
  serverPerformance_endDateTime: {
    type: Number,
    default: -1,
  },
  serverPerformance_endTimestamp: {
    type: Date,
  },
  serverPerformance_serverId: {
    type: String,
    required: true,
  },
  serverPerformance_activityId: {
    type: String,
    required: true,
  },
  serverPerformance_shopId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ServerPerformance", serverPerformanceSchema);
