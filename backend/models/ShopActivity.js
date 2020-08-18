const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopActivitySchema = mongoose.Schema({
  shopActivity_activity: {
    type: String,
  },
  shopActivity_description: {
    type: String,
  },
  shopActivity_priority: {
    type: Number,
  },
  shopActivity_shopStatus: {
    type: String,
  },
  shopActivity_queueStage: {
    type: Number,
  },
  shopActivity_queueStructure: {
    type: String,
  },
  shopActivity_queueLength: {
    type: Number,
    default: 0,
  },
  shopActivity_defaultTimeToServeACustomer: {
    type: Number,
    default: 5,
  },
});

module.exports = mongoose.model("ShopActivity", shopActivitySchema);
