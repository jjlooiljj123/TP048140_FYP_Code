const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  user_password: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    required: true,
  },
  user_shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  user_queues: [
    {
      type: String,
    },
  ],
  user_favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShopStatus",
    },
  ],
  user_servingShopActivityId: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
