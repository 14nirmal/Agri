const express = require("express");
const routes = express.Router();
const isAuthorized = require("../Auth");
const farmModel = require("../../DB/farmSchema");
const signupModel = require("../../DB/SignupSchema");
const { ObjectId } = require("mongodb");
const financialModel = require("../../DB/financialsSchema");
const InventoryModel = require("../../DB/inventorySchema");

const dashBoardRoute = routes.get(
  "/api/farmer/dashboard",
  isAuthorized,
  async (req, res) => {
    const farmer_id = new ObjectId(req.body.id);
    const { first_name, last_name, phone_number, email } =
      await signupModel.findById(new ObjectId(farmer_id));
    const farmData = await farmModel.find({ farmer_id });
    const financialData = await financialModel.find({ farmer_id });
    const inventoryData = await InventoryModel.find({ farmer_id });

    const farmerData = { first_name, last_name, phone_number, email };
    const total_income = financialData.reduce(
      (sum, farm) => farm.total_income + sum,
      0
    );
    const total_expense = financialData.reduce(
      (sum, farm) => farm.total_expense + sum,
      0
    );
    let total_active_crops = 0;
    const cropdata = farmData.map((farm) => {
      const data = farm.crops.filter((crop) => crop.complete == "false");
      if (data.length != 0) {
        total_active_crops += data.length;
      }
      // crops = [...crops, farm.crops];
    });

    const total_farm = farmData?.length || 0;
    const inventory_value = inventoryData.reduce(
      (sum, inventory) => sum + inventory.item_value * inventory.item_quantity,
      0
    );
    //const { item_category, item_unit, item_value, item_name } = inventoryData;
    //console.log(inventoryData);
    const categoryofItems = [
      ...new Set(inventoryData.map((inventory) => inventory.item_category)),
    ];

    const categoryWiseInventoryData = [];
    for (let category of categoryofItems) {
      const commonCategoryData = inventoryData.filter(
        (inventory) => inventory.item_category == category
      );
      const total_value = commonCategoryData.reduce(
        (sum, item) => sum + item.item_value * item.item_quantity,
        0
      );
      const numberofItems = commonCategoryData.length;
      categoryWiseInventoryData.push({
        item_category: category,
        total_value,
        numberofItems,
      });
    }
    const farmWiseFinancialData = financialData.map((farm) => {
      const farm_name = farmData.find((f) => f.id == farm.farm_id)?.farm_name;
      const total_income = farm.total_income;
      const total_expense = farm.total_expense;
      return {
        farm_name,
        total_income,
        total_expense,
      };
    });

    res.status(200).send({
      farmData,
      farmerData,
      total_expense,
      total_income,
      total_farm,
      total_active_crops,

      farmData: farmData.map((farm) => {
        return {
          farm_name: farm.farm_name,
          farm_size: farm.farm_size,
          measurement_unit: farm.measurement_unit,
          soil_type: farm.soil_type,
          isActive: farm.isActive,
          total_crops: farm.crops.length,
        };
      }),
      inventory: {
        inventory_value,
        total_items: inventoryData.length,
        inventories: categoryWiseInventoryData,
      },
      farmWiseFinancialData,
    });
  }
);

module.exports = dashBoardRoute;
