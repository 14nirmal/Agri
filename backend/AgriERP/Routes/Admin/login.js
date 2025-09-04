const express = require("express");
const router = express.Router();
const LoginModel = require("../../DB/Loginschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendVerificationMail = require("../../nodemailer/emailSender");
const signupModel = require("../../DB/SignupSchema");
const farmModel = require("../../DB/farmSchema");
const { ObjectId } = require("mongodb");
const financialModel = require("../../DB/financialsSchema");
const isAuthorized = require("../Auth");

const AdminLogin = router.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and Password are required" });
  }
  try {
    const admin = await LoginModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ msg: "Email Are Not Verified!" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ msg: "Password is not valid" });
    }
    const token = jwt.sign({ email }, process.env.ADMINKEY, {
      expiresIn: "2m",
    });
    if (!admin.verified) {
      sendVerificationMail(email, token);
    }
    if (admin.verified) {
      const token = jwt.sign({ email }, process.env.ADMINKEY);
      res.cookie("agri_t", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      return res.status(200).json({ msg: "Login successfully!" });
    } else {
      return res.status(200).json({
        msg: "The Email sent your email address ! please verify and Login again",
      });
    }
  } catch (e) {
    // console.log(e.message);
    res.status(500).json({ msg: "Internal server Error" });
  }
});

const AdminAuth = async (req, res, next) => {
  if (!req.cookies) {
    res.status(401).json({ msg: "Please Login To Access!" });
  }
  try {
    const { agri_t } = req.cookies;
    const isverified = await jwt.verify(agri_t, process.env.ADMINKEY);

    next();
  } catch (e) {
    res.status(401).json({ msg: "Please Login To Access!" });
  }
};

const adminAuth = router.get("/api/admin/auth", AdminAuth, (req, res) => {
  res.status(200).json({ msg: "all ohk" });
});

const dashboardRoute = router.get(
  "/api/admin/dashboard",
  AdminAuth,
  async (req, res) => {
    const farmerData = await signupModel.find({});
    const total_farmers = farmerData.length;

    const farm_data = await farmModel.find({});
    const total_farms = farm_data.length;

    const Crop_data = [];
    farm_data.map((farm) => {
      Crop_data.push(...farm.crops);
    });
    const total_crops = Crop_data.length;

    const financial_data = await financialModel.find({});
    const total_revenue = financial_data.reduce(
      (sum, farm) => sum + farm.total_income,
      0
    );
    const total_expense = financial_data.reduce((sum, farm) => {
      return sum + farm.total_expense;
    }, 0);

    res.status(200).json({
      total_farmers,
      total_farms,
      total_crops,
      total_revenue,
      total_expense,
    });
  }
);

const Adminlogout = router.get("/api/admin/log-out", AdminAuth, (req, res) => {
  res.clearCookie("agri_t", { httpOnly: true });
  return res.status(200).json({ msg: "user Logout Successfully!" });
});

const farmerData = router.get(
  "/api/admin/getfarmerdata",
  AdminAuth,
  async (req, res) => {
    const f = [];
    const farmerData = await signupModel.find({});
    const financial_data = await financialModel.find({});
    const farmerdata = await Promise.all(
      farmerData.map(async (farmer) => {
        const farm = await farmModel.find({
          farmer_id: new ObjectId(farmer._id),
        });
        const data = {
          first_name: farmer.first_name,
          last_name: farmer.last_name,
          phone_number: farmer.phone_number,
          email: farmer.email,
          image_url: farmer.image_url,
          _id: farmer._id,
          total_farm: farm.length,
          status: farmer.status,
        };
        return data;
      })
    );
    // console.log(farms);

    return res.status(200).json(farmerdata);
  }
);

const ChangeFramerState = router.post(
  "/api/admin/farmer/:id/changeState",
  AdminAuth,
  async (req, res) => {
    try {
      //console.log(req.params.id);
      const UpdateRes = await signupModel.updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          status: req.body.status,
        }
      );

      if (UpdateRes.acknowledged) {
        res.status(200).json({ msg: "state updated successfully!" });
      } else {
        res.status(404).json({ msg: "Try Again!" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Internal Server Error", err: e.message });
    }
  }
);

const getFarmerBriefDetail = router.get(
  "/api/admin/farmer/:id/getDetails",
  AdminAuth,
  async (req, res) => {
    try {
      const farmerInfo = await signupModel.findOne(new ObjectId(req.params.id));
      const financialInfo = await financialModel.find({
        farmer_id: new ObjectId(req.params.id),
        financial_year: "2025",
      });
      const total_income = financialInfo.reduce(
        (sum, a) => sum + a.total_income,
        0
      );
      const total_expense = financialInfo.reduce(
        (sum, b) => sum + b.total_expense,
        0
      );
      const farmInfo = await farmModel.find({
        farmer_id: new ObjectId(req.params.id),
      });
      const total_farms = farmInfo.length;
      const cropInfo = [];
      const crops = farmInfo.map((farm) => {
        farm.crops.map((crop) => {
          cropInfo.push(crop);
        });
      });

      res.status(200).json({
        farmer_name: farmerInfo.first_name + " " + farmerInfo.last_name,
        phone_number: farmerInfo.phone_number,
        email: farmerInfo.email,
        cropInfo,
        total_crops: cropInfo.length,
        total_farms,
        total_expense,
        total_income,
      });
    } catch (e) {
      res.status(404).json({ msg: "No Data Found!" });
    }
  }
);

module.exports = {
  AdminLogin,
  dashboardRoute,
  Adminlogout,
  adminAuth,
  farmerData,
  getFarmerBriefDetail,
};
