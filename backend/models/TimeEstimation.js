const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeEstimationSchema = mongoose.Schema({
  timeEstimation_shopId: {
    type: String,
    required: true,
  },
  timeEstimation_dayOfWeek: {
    type: String,
    required: true,
  },
  timeEstimation_waitingTimePerPerson: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});

module.exports = mongoose.model("TimeEstimation", timeEstimationSchema);
