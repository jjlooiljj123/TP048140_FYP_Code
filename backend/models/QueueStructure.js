const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queueStructureSchema = mongoose.Schema({
  queueStructure_stageNumber: {
    type: Number,
    default: 1,
  },
  // numberOfServer: {
  //   type: Number,
  // },
  queueStructure_nameOfStage: {
    type: String,
  },
  queueStructure_description: {
    type: String,
  },
  queueStructure_shop: {
    type: String,
    required: true,
  },
  // to prevent infinity loop
  // shopActivities: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "ShopActivity",
  //   },
  // ],
});

module.exports = mongoose.model("QueueStructure", queueStructureSchema);
