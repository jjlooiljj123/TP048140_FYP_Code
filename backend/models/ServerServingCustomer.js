const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serverServingCustomerSchema = mongoose.Schema({
  serverServingCustomer_serverId: {
    type: String,
    required: true,
  },
  serverServingCustomer_shopId: {
    type: String,
  },
  serverServingCustomer_activityId: [
    {
      type: String,
    },
  ],
  serverServingCustomer_isServering: {
    type: Boolean,
  },
  serverServingCustomer_servedTimestamp: {
    type: String,
  },
});

module.exports = mongoose.model(
  "ServerServingCustomer",
  serverServingCustomerSchema
);
