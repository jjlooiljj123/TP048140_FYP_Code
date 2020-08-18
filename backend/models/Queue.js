const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queueSchema = new mongoose.Schema({
  queue_shop: {
    // type: Schema.Types.ObjectId,
    // ref: "ShopStatus",
    type: String,
    required: true,
  },
  queue_customer: {
    type: String,
    required: true,
  },
  queue_queueNumber: {
    type: String,
    required: true,
  },
  queue_pax: {
    type: Number,
    required: true,
  },
  queue_description: {
    type: String,
  },
  queue_queueDateTime: {
    type: Number,
    default: null,
  },
  queue_servedDateTime: {
    type: Number,
    default: null,
  },
  queue_completeDateTime: {
    type: Number,
    default: null,
  },
  queue_queueTimestamp: {
    type: Date,
    default: null,
  },
  queue_servedTimestamp: {
    type: Date,
    default: null,
  },
  queue_completeTimestamp: {
    type: Date,
    default: null,
  },
  queue_dayOfWeek: {
    type: String,
    default: null,
  },
  queue_queueStatus: {
    type: Number,
    required: true,
  },
  queue_waitingLength: {
    type: Number,
    required: true,
  },
  queue_estimatedWaitingTime: {
    type: Number,
    default: 0,
  },
  queue_activityId: {
    type: String,
  },
  queue_activity: {
    type: String,
  },
  queue_priority: {
    type: Number,
  },
  queue_queueDiscipline: {
    type: String,
    required: true,
  },
  // queueStructure: {
  //   type: String,
  //   required: true,
  // },
  queue_stage: {
    type: Number,
  },
  queue_queueData: [
    {
      type: Schema.Types.ObjectId,
      ref: "QueueData",
    },
  ],
  queue_totalWaitingTime: {
    type: Number,
  },
  queue_totalTimeInSystem: {
    type: Number,
  },
  queue_numberOfServer: {
    type: Number,
    default: 0,
  },
  queue_feedback: {
    type: Schema.Types.ObjectId,
    ref: "Feedback",
  },
  queue_shopImageUrl: {
    type: String,
  },
  queue_shopName: {
    type: String,
  },
  queue_shopBranch: {
    type: String,
  },
  queue_date: {
    type: String,
  },
});

module.exports = mongoose.model("Queue", queueSchema);
