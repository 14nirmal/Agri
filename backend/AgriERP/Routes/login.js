const express = require("express");
const routes = express.Router();
const signupModel = require("../DB/SignupSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

routes.post("/api/farmer/login", async (req, res) => {
  const dateNow = new Date();
  const after30Days = new Date(dateNow.setDate(dateNow.getDate() + 31));

  const { phone_number, password } = req.body;
  const user = await signupModel.findOne({ phone_number });
  try {
    if (user) {
      if (user.status != "active") {
        return res
          .status(403)
          .json({ msg: "Your account is disabled! please contact admin" });
      }
      const isVerify = await bcrypt.compare(password, user.password);
      if (isVerify) {
        const token = jwt.sign(
          { phone_number, _id: user._id },
          "AGRIERPFARMER",
          {
            expiresIn: "3d",
          }
        );
        res.cookie("Token", token, {
          httpOnly: true,
          expires: after30Days,
        });
        res.cookie("F_id", user._id, {
          httpOnly: true,
          expires: after30Days,
        });
        res.status(200).json({ msg: "Login Successfully!" });
      } else {
        res.status(401).json({ msg: "Password is incorrect!" });
      }
    } else {
      res.status(401).json({ msg: "Given Phone_number is Not Registered! " });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = routes;
