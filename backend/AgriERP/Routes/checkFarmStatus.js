const farmModel = require("../DB/farmSchema");
const { ObjectId } = require("mongodb");

const checkFarmStatus = async (farmId) => {
  if (!farmId) throw new Error("Farm ID is required");

  const farm = await farmModel.findById({ _id: new ObjectId(farmId) });
  if (!farm) throw new Error("Farm not found");

  if (!farm.isActive) {
    throw new Error("Farm is disabled. Action not allowed");
  }

  return farm; // Return the farm if active (optional)
};
module.exports = checkFarmStatus;
