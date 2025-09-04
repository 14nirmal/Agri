const express = require("express");
const routes = express.Router();
const signupModel = require("../DB/SignupSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const upload = require("../Multer");
const fs = require("fs");
const cors = require("cors");

routes.use(cors());
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

const deleteFiles = (file) => {
  if (file) {
    fs.unlinkSync(file.path);
    try {
    } catch (e) {
      console.log(e);
    }
  }
};

const generateHashPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(password, salt);
  return hashpass;
};

routes.post(
  "/api/farmer/signup",
  upload.single("image_url"),
  async (req, res) => {
    try {
      const profileImagePath = req.file ? req.file.path : null;

      const ExistingUser = await signupModel.find({
        phone_number: req.body.phone_number,
      });
      if (ExistingUser.length != 0) {
        deleteFiles(req.file); // delete the file which are uploaded when the user are already found
        return res
          .status(409)
          .json({ msg: "User Already Registered With this phone_number!" });
      }
      try {
        const hashpass = await generateHashPass(req.body.password);
        req.body.password = hashpass;
        req.file && (req.body.image_url = profileImagePath);
        const data = await new signupModel(req.body);
        const saveData = await data.save();
        res.status(200).json({ msg: "User Registered Successfully!" });
      } catch (e) {
        deleteFiles(req.file);
        res.status(400).json({ msg: "field required", err: e.message });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ msg: "Internal Server Error", err: e.message });
    }
  }
);

//a global error handling middelware to handle error at a time uploading the file
routes.use((err, req, res, next) => {
  if (err.message == "File Type Must Be Png Or Jpeg") {
    return res.status(400).json({ msg: err.message });
  }
  next();
});

module.exports = routes;
