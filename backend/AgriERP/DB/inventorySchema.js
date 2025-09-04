const { Mongoose, default: mongoose } = require("mongoose");
const Connect = require("./Connect");
const { ObjectId } = require("mongodb");
if (!Connect) {
  console.log("no connection found");
}

const InventorySchema = mongoose.Schema({
  item_name: { type: String, required: true },
  item_category: { type: String, required: true },
  farm_id: { type: ObjectId, required: true },
  item_quantity: { type: Number, required: true },
  item_unit: { type: String, required: true },
  supplier_name: { type: String, required: true },
  farmer_id: { type: ObjectId },
  item_value: { type: Number },
  note: { type: String },
  Timestamp: { type: Date, default: () => new Date() },
});

const InventoryModel = mongoose.model(
  "InventoryModel",
  InventorySchema,
  "inventoryData"
);
module.exports = InventoryModel;
