const express = require("express");
const routes = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const isAuthorized = require("../Auth");
const farmModel = require("../../DB/farmSchema");
const { ObjectId } = require("mongodb");
const { equals } = require("mongoose");
const checkFarmStatus = require("../checkFarmStatus");

routes.use(cookieParser());
routes.use(express.json());

const Addfarm = routes.post(
  "/api/farmer/addFarm",
  isAuthorized,
  async (req, res) => {
    try {
      const { id, farm_name } = req.body;

      req.body.farmer_id = id;
      const farm = await farmModel.aggregate([
        { $match: { farmer_id: id, farm_name } },
      ]);

      if (Boolean(farm.length)) {
        return res.status(400).json({ msg: "Farm Already added!" });
      }
      try {
        const data = new farmModel(req.body);
        const saveData = await data.save();
        return res.status(200).json({ msg: "Farm added Successfully!" });
      } catch (e) {
        console.log(e.message);
        return res.status(400).json({ msg: "Please fill required field!" });
      }
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error! try again!" });
    }
  }
);

//edit farm
const EditFarm = routes.put(
  "/api/farmer/farm/:farm_id/editfarm",
  isAuthorized,
  async (req, res) => {
    try {
      const { id, farm_name, farm_size, measurement_unit, soil_type } =
        req.body;
      req.body.farmer_id = id;
      try {
        await checkFarmStatus(req.params.farm_id);
      } catch (e) {
        return res.status(403).json({ msg: e.message });
      }
      const farm = await farmModel.aggregate([
        { $match: { farmer_id: id, farm_name } },
      ]);

      if (farm[0]._id.toString() !== req.params.farm_id) {
        if (Boolean(farm.length)) {
          return res.status(400).json({ msg: "Farm Name Already exists!" });
        }
      }

      const data = await farmModel.updateOne(
        { _id: new ObjectId(req.params.farm_id) },
        { $set: { farm_name, farm_size, measurement_unit, soil_type } }
      );
      if (data.matchedCount > 0) {
        return res.status(200).json({ msg: "FarmData Updated Successfully!" });
      } else {
        return res
          .status(404)
          .json({ msg: "Try Again ! something Happens Wrong" });
      }
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ msg: "Internal server error! try again!" });
    }
  }
);

//disabled Farm
const DisableFarm = routes.put(
  "/api/farmer/farm/:farm_id/disable",
  isAuthorized,
  async (req, res) => {
    try {
      const data = await farmModel.updateOne(
        { _id: new ObjectId(req.params.farm_id) },
        { $set: { isActive: req.body.isactive } }
      );
      if (data.matchedCount > 0) {
        return res.status(200).json({ msg: "FarmData Disabled Successfully!" });
      } else {
        return res
          .status(404)
          .json({ msg: "Try Again ! something Happens Wrong" });
      }
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ msg: "Internal server error! try again!" });
    }
  }
);

const viewFarm = routes.get(
  "/api/farmer/farms",
  isAuthorized,
  async (req, res) => {
    try {
      if (req.query.farm_id) {
        const farm = await farmModel.findOne({
          _id: new ObjectId(req.query.farm_id),
        });
        if (farm) {
          return res.status(200).json(farm);
        } else {
          return res.status(404).json({ msg: "No Farm Found!" });
        }
      }
      const farms = await farmModel.find({ farmer_id: req.cookies.F_id });
      if (farms.toString() == "") {
        return res.status(404).json({ msg: "no farm data found!" });
      }

      return res.status(200).json({ farms: farms });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error ! try again" });
    }
  }
);

module.exports = { Addfarm, viewFarm, EditFarm, DisableFarm };
