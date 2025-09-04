const express = require("express");
const routes = express.Router();
const cookieParser = require("cookie-parser");
const isAuthorized = require("../Auth");
const farmModel = require("../../DB/farmSchema");
const { ObjectId } = require("mongodb");
const financialModel = require("../../DB/financialsSchema");

//assign a farm id to the button for the add crop
routes.use(express.json());
routes.use(cookieParser());

const AddCrop = routes.post(
  "/api/farmer/farm/addCrop",
  isAuthorized,
  async (req, res) => {
    try {
      if (!ObjectId.isValid(req.body.farm_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }

      let farm = await farmModel.findOne({
        _id: new ObjectId(req.body.farm_id),
      });

      if (!req.body.id.equals(farm?.farmer_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }
      if (farm) {
        try {
          //create the instance of crops to handle manual validation by mongoose schema
          // const crop = farm.crops.create(req.body);

          //this function helps us to manually catch the validation error when we add data
          //we use the save methods so no need for a manual validation
          // const validationError = crop.validateSync();
          // if (validationError) {
          //   console.log(validationError);
          //   throw validationError;
          // }

          farm.crops.push(req.body);

          // const data = await farmModel.updateOne({
          //   _id: req.body.farmId,
          //   $set: { crops: farm.crops },
          // });
          await farm.save();
          return res.status(200).json({ msg: "crop data added successfully!" });
        } catch (e) {
          return res
            .status(400)
            .json({ msg: "please fill all required field!" });
        }
      }
      return res.status(404).json({ msg: "farm not found" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

const viewIndividualCrop = routes.get(
  "/api/farmer/farm/crops/:cropid/viewDetail",
  isAuthorized,
  async (req, res) => {
    const data = await farmModel.findOne(
      {
        "crops._id": new ObjectId(req.params.cropid),
      },
      { crops: 1 }
    );

    if (data) {
      const cropData = data?.crops.find(
        (crop) => crop._id == req.params.cropid
      );
      if (cropData) {
        return res.status(200).json(cropData);
      }
    } else {
      return res.status(404).json({ msg: "No Data Found!" });
    }
  }
);

const viewCrop = routes.get(
  "/api/farmer/farm/:id/viewCrops",
  isAuthorized,
  async (req, res) => {
    try {
      const farm = await farmModel.findById(req.params.id);

      if (!req.body.id.equals(farm.farmer_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }
      if (farm) {
        const { farm_name, crops } = farm;
        return res.status(200).json({ farm_name, crops });
      }
      return res
        .status(400)
        .json({ msg: "Internal server Error or maybe farm deleted!" });
    } catch (e) {
      return res.status(500).json({ msg: "Internal server error!" });
    }
  }
);

const EditCropData = routes.put(
  "/api/farmer/farm/:farm_id/crops/:cropid/update",
  isAuthorized,
  async (req, res) => {
    const update = await farmModel.updateOne(
      {
        _id: new ObjectId(req.params.farm_id),
        "crops._id": new ObjectId(req.params.cropid),
      },
      {
        $set: {
          "crops.$.crop_name": req.body.crop_name,
          "crops.$.crop_variety": req.body.crop_variety,
          "crops.$.crop_area": req.body.crop_area,
          "crops.$.crop_measurement_unit": req.body.crop_measurement_unit,
          "crops.$.planting_date": req.body.planting_date,
        },
      }
    );

    if (update.matchedCount != 0) {
      res.status(200).json({ msg: "Crop Data Updated Successfully!" });
    } else {
      res.status(404).json({ msg: "No Changes Happen! Try Again" });
    }
  }
);

const DeleteCrop = routes.delete(
  "/api/farmer/farm/:farm_id/crops/:cropid/delete",
  isAuthorized,
  async (req, res) => {
    try {
      const update = await farmModel.updateOne(
        {
          "crops._id": new ObjectId(req.params.cropid),
        },
        {
          $pull: { crops: { _id: new ObjectId(req.params.cropid) } },
        }
      );

      //delete related transaction
      const updateFinanacial = await financialModel.updateMany(
        {
          "expenses.crop_id": new ObjectId(req.params.cropid),
        },
        {
          $pull: {
            expenses: { crop_id: new ObjectId(req.params.cropid) },
          },
        }
      );
      const incomeFinanacial = await financialModel.updateMany(
        {
          "incomes.crop_id": new ObjectId(req.params.cropid),
        },
        {
          $pull: {
            incomes: { crop_id: new ObjectId(req.params.cropid) },
          },
        }
      );

      //reset the total_icome and total_expense after deleteing the crop
      const data = await financialModel.find({ farm_id: req.params.farm_id });
      console.log(data);
      const total_income = data[0].incomes?.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      const total_expense = data[0].expenses?.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const updateTotalIncomeAndExpense = await financialModel.updateMany(
        {
          farm_id: new ObjectId(req.params.farm_id),
        },
        {
          $set: {
            total_income: Number(total_income),
            total_expense: Number(total_expense),
          },
        }
      );

      if (update.matchedCount != 0) {
        res.status(200).json({ msg: "Crop Deleted Successfully!" });
      } else {
        res.status(404).json({ msg: "No Changes Happen! Try Again" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Internal Server Error", err: e.message });
    }
  }
);

const CompleteCrop = routes.put(
  "/api/farmer/farm/crops/:cropid/complete",
  isAuthorized,
  async (req, res) => {
    const update = await farmModel.updateOne(
      {
        "crops._id": new ObjectId(req.params.cropid),
      },
      {
        $set: {
          "crops.$.complete": req.body.complete,
        },
      },
      {
        upsert: true,
      }
    );

    //// 2. Fetch updated documents
    const financials = await financialModel.find({
      $or: [
        { "incomes.crop_id": new ObjectId(req.params.cropid) },
        { "expenses.crop_id": new ObjectId(req.params.cropid) },
      ],
    });

    if (update.matchedCount != 0) {
      return res.status(200).json({ msg: "Crop Completed Successfully!" });
    } else {
      return res.status(404).json({ msg: "No Changes Happen! Try Again" });
    }
  }
);
module.exports = {
  AddCrop,
  viewCrop,
  viewIndividualCrop,
  CompleteCrop,
  DeleteCrop,
};
