const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queueDataSchema = mongoose.Schema({
  queueData_queueLength: {
    type: Number,
  },
  queueData_dateTime: {
    type: Number,
    required: true,
  },
  queueData_timestamp: {
    type: Date,
    required: true,
  },
  queueData_dayOfWeek: {
    type: String,
    required: true,
  },
  queueData_stage: {
    type: String,
  },
  queueData_shopActiviy: {
    type: String,
  },
  queueData_shopActivityId: {
    type: String,
  },
  queueData_status: {
    type: Number,
  },
  queueData_server: {
    type: String,
  },
  queueData_customer: {
    type: String,
  },
  queueData_queue: {
    type: String,
  },
  queueData_shopId: {
    type: String,
  },
  queueData_numberOfServer: {
    type: Number,
  },
});

module.exports = mongoose.model("QueueData", queueDataSchema);
