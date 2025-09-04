const express = require("express");
const Router = express.Router();

const { ObjectId, Timestamp } = require("mongodb");
const isAuthorized = require("../Auth");
const { Route } = require("router");
const InventoryModel = require("../../DB/inventorySchema");
const TransactionModel = require("../../DB/transactionSchema");
const { isValidObjectId } = require("mongoose");
const transactionSchema = require("../../DB/transactionSchema");

const inventoriesRouter = Router.get(
  "/api/inventories",
  isAuthorized,
  async (req, res) => {
    const data = await InventoryModel.find({ farm_id: req.body.id });
    if (data.toString() == "") {
      return res.status(404).json({ msg: "Inventory Not Found!" });
    }
    return res.status(200).json(data);
  }
);

const transactionRoute = Router.get(
  "/api/inventories/transactions",
  isAuthorized,
  async (req, res) => {
    const { activity_id } = req.query;

    if (activity_id) {
      const response = await TransactionModel.find({ item_id: activity_id });
      if (response.toString() == "") {
        return res.status(404).json({ msg: "Transaction Not Found!" });
      }

      return res.status(200).json(response);
    }
    const response = await TransactionModel.aggregate([
      {
        $match: {
          farm_id: req.body.id,
        },
      },
      {
        $lookup: {
          from: "inventoryData",
          localField: "item_id",
          foreignField: "_id",
          as: "item_data",
        },
      },
      { $unwind: { path: "$item_data", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          item_quantity: 1,
          transaction_type: 1,
          supplier_name: 1,
          used_for: 1,
          note: 1,
          Timestamp: 1,
          "item_data.item_name": 1,
          "item_data.item_unit": 1,
        },
      },
    ]);

    if (response.toString() == "") {
      return res.status(404).json({ msg: "Transaction Not Found!" });
    }
    return res.status(200).json(response);
  }
);

const PostInventories = Router.post(
  "/api/inventories/addItem",
  isAuthorized,
  async (req, res) => {
    req.body.farm_id = req.body.id;
    req.body.farmer_id = new ObjectId(req.body.id);
    req.body.item_value = req.body.item_value / req.body.item_quantity;
    const isExist = await InventoryModel.findOne({
      item_name: req.body.item_name,
    });
    if (isExist) {
      return res.status(409).json({ msg: "Item already added!" });
    }
    try {
      const response = new InventoryModel(req.body);
      const data = await response.save();
      req.body.transaction_type = "add";
      //store 1 item price

      req.body.item_id = new ObjectId(data._id);
      const insert = new TransactionModel(req.body);

      const insertRes = await insert.save();
      return res.status(200).json({ msg: "Inventory Added successfully!" });
    } catch (e) {
      return res
        .status(404)
        .json({ msg: "failed to add inventory", err: e.message });
    }
  }
);

const deleteInventory = Router.delete(
  "/api/inventory/:activity_id/delete",
  async (req, res) => {
    const { activity_id } = req.params;
    const deleteRes = await InventoryModel.deleteOne({
      _id: new ObjectId(activity_id),
    });
    if (deleteRes.deletedCount) {
      const transactionDelRes = await TransactionModel.deleteMany({
        item_id: new ObjectId(activity_id),
      });
    }
    if (deleteRes.acknowledged) {
      return res.status(200).json({ msg: "Item Deleted Successfully!" });
    } else {
      return res.status(403).json({ msg: "Try Again!" });
    }
  }
);

const inventoryTransaction = Router.post(
  "/api/inventory/:activity_id/update",
  isAuthorized,
  async (req, res) => {
    try {
      req.body.farm_id = req.body.id;

      const { activity_id } = req.params;
      let { item_quantity } = req.body;

      const data = await InventoryModel.findById(new ObjectId(activity_id));
      if (data == null) {
        return res.status(404).json({ msg: "Activity not found!" });
      }
      //value of one item
      // let valueOfItem = data.item_value / data.item_quantity;
      //update the inventorydata
      if (req.body.transaction_type == "add") {
        item_quantity += data.item_quantity;
        // valueOfItem = Number(item_quantity * valueOfItem);
      } else {
        if (item_quantity > data.item_quantity) {
          return res
            .status(404)
            .json({ msg: "insufficient item stock available" });
        }
        item_quantity = data.item_quantity - item_quantity;
        // valueOfItem = Number(item_quantity * valueOfItem);
      }

      const updateRes = await InventoryModel.updateOne(
        { _id: activity_id },
        {
          $set: {
            item_quantity: item_quantity,
            // item_value: parseFloat(valueOfItem),
          },
        }
      );

      if (!updateRes.modifiedCount) {
        return res.status(500).json({ msg: "Please Try Again!" });
      }
      //make a entry in the transaction
      req.body.item_id = new ObjectId(activity_id);
      try {
        const insert = new TransactionModel(req.body);

        const insertRes = await insert.save();

        if (insertRes == null) {
          return res.status(404).json({ msg: "something wrong!try again" });
        }
      } catch (e) {
        console.log(e.message);
        return res.status(322).json({ msg: "validation error" });
      }

      if (req.body.transaction_type == "add") {
        res.status(200).json({ msg: "inventory added successfully!" });
      } else {
        res.status(200).json({ msg: "inventory reduced successfully!" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Internal server error!" });
    }
  }
);

//note that when you delete the activity also delete the all the transaction from the transaction schema

module.exports = {
  inventoriesRouter,
  PostInventories,
  inventoryTransaction,
  transactionRoute,
  deleteInventory,
};
