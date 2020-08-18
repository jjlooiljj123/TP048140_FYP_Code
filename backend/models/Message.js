const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
  message: {
    type: Map,
    of: String,
  },
});
// Sender /Customer
// Receiver/ ShopStatus
// Message
// DateTime

module.exports = mongoose.model("MessageSchema", messageSchema);
