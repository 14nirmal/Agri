const express = require("express");
const routes = express.Router();
const isAuthorized = require("../Auth");
const farmModel = require("../../DB/farmSchema");
const upload = require("../../Multer");
const fs = require("fs");
const { ObjectId } = require("mongodb");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

const deleteFile = (file) => {
  if (file) {
    fs.unlinkSync(file.path);
  }
};

const deleteActivity = routes.delete(
  "/api/crops/:cropId/activity/:actvityId/deleteActivity",
  isAuthorized,
  async (req, res) => {
    try {
      const activityId = new ObjectId(req.params.actvityId);
      const data = await farmModel.findOne({
        "crops._id": req.params.cropId,
      });
      if (!req.body.id.equals(data.farmer_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }
      if (!data) {
        return res.status(404).json({ msg: "no crop data found !s" });
      }
      const deleteRes = await farmModel.updateOne(
        {
          "crops._id": req.params.cropId,
        },
        {
          $pull: {
            "crops.$.activities": { _id: new ObjectId(activityId) },
          },
          //only support on updateOne
          //not support a array filters
        }
      );
      if (deleteRes.acknowledged) {
        res.status(200).json({ msg: "activity deleted successfully!" });
      } else {
        res.status(404).json({ msg: "activity not found!" });
      }
    } catch (e) {
      console.log("error :" + e);
      res.status(500).json({ msg: "Internal server Error!" });
    }
  }
);

const updateActivityStatus = routes.put(
  `/api/crops/:cropId/activity/:actvityId/updateStatus`,
  isAuthorized,
  async (req, res) => {
    const activityId = new ObjectId(req.params.actvityId);
    console.log(activityId);
    const data = await farmModel.findOne({
      "crops._id": req.params.cropId,
    });
    if (!req.body.id.equals(data.farmer_id)) {
      return res
        .status(403)
        .json({ msg: "you can't acceess another user's Data" });
    }
    if (!data) {
      return res
        .status(404)
        .json({ msg: "no crop data found to update activity!" });
    }

    const updateRes = await farmModel.updateOne(
      {
        "crops._id": new ObjectId(req.params.cropId),
        "crops.activities._id": activityId,
      },
      {
        $set: {
          "crops.$[crop].activities.$[activity].activity_status": "Completed",
        },
      },
      {
        arrayFilters: [
          { "crop._id": new ObjectId(req.params.cropId) },
          { "activity._id": activityId },
        ],
      }
    );
    console.log(updateRes);
    if (updateRes.acknowledged) {
      return res.status(200).json({ msg: "Updated Successfully!" });
    }
    return res.status(404).json({ msg: "try again!" });
  }
);

const updateActivity = routes.put(
  `/api/crops/:cropId/activity/:actvityId/editactivity`,
  isAuthorized,
  async (req, res) => {
    const activityId = new ObjectId(req.params.actvityId);
    console.log(activityId);
    const data = await farmModel.findOne({
      "crops._id": req.params.cropId,
    });
    if (!req.body.id.equals(data.farmer_id)) {
      return res
        .status(403)
        .json({ msg: "you can't acceess another user's Data" });
    }
    if (!data) {
      return res
        .status(404)
        .json({ msg: "no crop data found to update activity!" });
    }

    const updateRes = await farmModel.updateOne(
      {
        "crops._id": new ObjectId(req.params.cropId),
        "crops.activities._id": activityId,
      },
      {
        $set: {
          "crops.$[crop].activities.$[activity].activity_type":
            req.body.activity_type,
          "crops.$[crop].activities.$[activity].activity_date":
            req.body.activity_date,
          "crops.$[crop].activities.$[activity].activity_description":
            req.body.activity_description,
          "crops.$[crop].activities.$[activity].activity_status":
            req.body.activity_status,
        },
      },
      {
        arrayFilters: [
          { "crop._id": new ObjectId(req.params.cropId) },
          { "activity._id": activityId },
        ],
      }
    );
    console.log(updateRes);
    if (updateRes.acknowledged) {
      return res.status(200).json({ msg: "Updated Successfully!" });
    }
    return res.status(404).json({ msg: "try again!" });
  }
);

const addActivity = routes.post(
  "/api/farmer/farm/crops/:cropId/addActivity",
  isAuthorized,
  upload.single("activity_image_url"),
  async (req, res) => {
    try {
      const data = await farmModel.findOne({
        "crops._id": req.params.cropId,
      });
      if (!req.body.id.equals(data.farmer_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }
      if (req.file) {
        req.body.activity_image_url = req.file ? req.file.path : "";
      }
      if (!data) {
        return res
          .status(404)
          .json({ msg: "no crop data found to add activity!" });
      }
      try {
        // const activitiesSchema = data.crops
        //   .find((crop) => crop._id == req.params.cropId)
        //   .activities.create(req.body);
        // const validationerror = activitiesSchema.validateSync();
        // if (validationerror) {
        //   throw validationerror;
        // }

        data.crops
          .find((crop) => crop._id == req.params.cropId)
          .activities.push(req.body);
        await data.save();
        return res.status(200).json({ msg: "Activity added successfully!" });
      } catch (e) {
        deleteFile(req.file);
        console.log(e.message);
        return res.status(400).json({ msg: "please fill all required field!" });
      }
    } catch (e) {
      deleteFile(req.file);
      return res.status(500).json({ msg: "Internal Server Error!" });
    }
  }
);

const viewActivity = routes.get(
  "/api/farmer/farm/crops/:cropId/viewActivity",
  isAuthorized,
  async (req, res) => {
    try {
      const { cropId } = req.params;
      const data = await farmModel.findOne({ "crops._id": cropId });
      if (!req.body.id.equals(data.farmer_id)) {
        return res
          .status(403)
          .json({ msg: "you can't acceess another user's Data" });
      }
      if (!data) {
        return res.status(404).json({ msg: "no crop found" });
      }
      const { _id, activities } = data.crops.find((crop) => crop._id == cropId);
      res.status(200).json({ _id, activities });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ msg: "Internal server error!" });
    }
  }
);

//global error related to uploading images
routes.use((err, req, res, next) => {
  if (err) {
    return res.status(400).send({ msg: err.message });
  }
  next();
});

module.exports = {
  addActivity,
  viewActivity,
  updateActivityStatus,
  deleteActivity,
};
