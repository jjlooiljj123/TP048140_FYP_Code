const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new mongoose.Schema({
  shop_shopName: {
    type: String,
    required: true,
  },
  shop_branch: {
    type: String,
    required: true,
  },
  // shop_address: {
  //   type: String,
  //   required: true,
  // },
  shop_streetAddress1: {
    type: String,
    required: true,
  },
  shop_streetAddress2: {
    type: String,
  },
  shop_streetAddress3: {
    type: String,
  },
  shop_city: {
    type: String,
    required: true,
  },
  shop_postalCode: {
    type: String,
    required: true,
  },
  shop_state: {
    type: String,
    required: true,
  },
  shop_country: {
    type: String,
    required: true,
  },
  shop_directory: {
    type: String,
    required: true,
  },
  shop_imageUrl: {
    type: String,
    required: true,
  },
  shop_monOpen: {
    type: String,
    required: true,
  },
  shop_tueOpen: {
    type: String,
    required: true,
  },
  shop_wedOpen: {
    type: String,
    required: true,
  },
  shop_thuOpen: {
    type: String,
    required: true,
  },
  shop_friOpen: {
    type: String,
    required: true,
  },
  shop_satOpen: {
    type: String,
    required: true,
  },
  shop_sunOpen: {
    type: String,
    required: true,
  },
  shop_holOpen: {
    type: String,
    required: true,
  },
  shop_monClose: {
    type: String,
    required: true,
  },
  shop_tueClose: {
    type: String,
    required: true,
  },
  shop_wedClose: {
    type: String,
    required: true,
  },
  shop_thuClose: {
    type: String,
    required: true,
  },
  shop_friClose: {
    type: String,
    required: true,
  },
  shop_satClose: {
    type: String,
    required: true,
  },
  shop_sunClose: {
    type: String,
    required: true,
  },
  shop_holClose: {
    type: String,
    required: true,
  },
  shop_owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop_hasQueuePlan: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Shop", shopSchema);
