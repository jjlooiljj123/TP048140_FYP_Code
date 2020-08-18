const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopStatusSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  shopStatus_shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  shopStatus_owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopStatus_shopName: {
    type: String,
    required: true,
  },
  shopStatus_branch: {
    type: String,
    required: true,
  },
  shopStatus_logoUrl: {
    type: String,
    required: true,
  },
  shopStatus_directory: {
    type: String,
    required: true,
  },
  shopStatus_queueLength: {
    type: Number,
    default: 0,
  },
  shopStatus_stageOneQueueLength: {
    type: Number,
    default: 0,
  },
  shopStatus_servingLength: {
    type: Number,
    default: 0,
  },
  shopStatus_systemLength: {
    type: Number,
    default: 0,
  },
  shopStatus_currentlyServing: [
    {
      type: String,
    },
  ],
  shopStatus_currentQueueNumber: {
    type: String,
    default: null,
  },
  shopStatus_shopOpenClose: {
    type: Boolean,
  },
  shopStatus_shopAcceptQueue: {
    type: Boolean,
  },
  shopStatus_timeLimitForCustomer: {
    type: Number,
  },
  shopStatus_numberOfServer: {
    type: Number,
    default: 0,
  },
  shopStatus_reservationAvailability: {
    type: Boolean,
  },
  shopStatus_queueStructures: [
    {
      type: Schema.Types.ObjectId,
      ref: "QueueStructure",
      default: null,
    },
  ],
  shopStatus_shopActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShopActivity",
      default: null,
    },
  ],
  shopStatus_queueDiscipline: {
    type: String,
  },
  shopStatus_maxQueueLength: {
    type: Number,
    default: -1,
  },
  shopStatus_stageOneWaitingTime: {
    type: Number,
    default: -1,
  },
  shopStatus_timeToClearQueue: {
    type: Number,
    default: 999,
  },
  shopStatus_hasQueuePlan: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ShopStatus", ShopStatusSchema);
