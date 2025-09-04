const mongoose = require("mongoose");
const Connect = require("./Connect");
const { ObjectId } = require("mongodb");
if (!Connect) {
  console.log("no connection found");
}

const transactionSchema = mongoose.Schema({
  item_id: { type: ObjectId, required: true },
  farm_id: { type: ObjectId, required: true },
  item_quantity: { type: Number, required: true },
  transaction_type: { type: String, required: true },
  used_for: {
    type: String,
    required: [
      function () {
        return this.transaction_type == "remove";
      },
      "used_for is a required field",
    ],
  },
  supplier_name: {
    type: String,
    required: [
      function () {
        return this.transaction_type == "add";
      },
      "supplier_name is required field",
    ],
  },
  note: { type: String },
  Timestamp: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model(
  "InventoryTrasansactionModel",
  transactionSchema,
  "inventoryTransactionData"
);
