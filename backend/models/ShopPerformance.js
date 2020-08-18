const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopPerformanceSchema = mongoose.Schema({
  shopPerformance_shop: {
    type: String,
    required: true,
  },
  shopPerformance_timestamp: {
    type: Date,
    required: true,
  },
  shopPerformance_datetime: {
    type: String,
    required: true,
  },
  shopPerformance_day: {
    type: String,
  },
  shopPerformance_queueLength: {
    type: Number,
    required: true,
  },
  shopPerformance_servingLength: {
    type: Number,
  },
  shopPerformance_systemLength: {
    type: Number,
    required: true,
  },
  // shopPerformance_analysisCalculated: {
  //   type: Boolean,
  //   default: false,
  // },
});

module.exports = mongoose.model("ShopPerformance", shopPerformanceSchema);
