const Connection = require("./Connect");
const { ObjectId } = require("mongodb");
const financialModel = require("../DB/financialsSchema");

const mongoose = require("mongoose");
if (!Connection) {
  console.log("Database Connection Failed");
  return;
}

const activitySchema = new mongoose.Schema({
  // activity_id: { type: String, required: true },
  activity_type: { type: String, required: true },
  activity_date: { type: String, required: true },
  activity_description: { type: String, required: false },
  activity_status: { type: String, required: true },
  activity_image_url: { type: String, required: false },
});
const cropSchema = new mongoose.Schema({
  crop_name: { type: String, required: true },
  crop_variety: { type: String, required: true },
  crop_area: { type: String, required: true },
  crop_measurement_unit: { type: String, required: true },
  planting_date: { type: String, required: true },
  complete: { type: String, default: false },
  activities: {
    type: [activitySchema],
    default: [],
  },
});
const farmSchema = new mongoose.Schema({
  farmer_id: { type: ObjectId, required: true, ref: "farmers" },
  farm_name: { type: String, required: true },
  farm_size: { type: Number, required: true },
  measurement_unit: { type: String, required: true },
  soil_type: { type: String, required: true },
  crops: {
    type: [cropSchema],
    default: [],
  },
  isActive: { type: Boolean, default: true },
});

farmSchema.post("save", async function () {
  const isExist = await mongoose
    .model("financials")
    .findOne({ farm_id: this.id });

  if (!isExist) {
    const data = new financialModel({
      farm_id: this.id,
      farmer_id: this.farmer_id,
    });
    await data.save();
    // await mongoose.model("financials").insertOne({ farm_id: this._id });
  }
});

const farmModel = mongoose.model("farm", farmSchema);

module.exports = farmModel;
