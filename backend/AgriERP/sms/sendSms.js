const express = require("express");
const routes = express.Router();
const signupModel = require("../DB/SignupSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const TinyURL = require("tinyurl");

const client = twilio(process.env.TWILIOSID, process.env.TWILIOAUTHTOKEN);
const sendSms = routes.post("/api/send-sms", async (req, res) => {
  const { phone_number } = req.body;
  const isexist = await signupModel.findOne({ phone_number });
  if (!isexist) {
    return res.status(401).json({ msg: "Phone number not registered!" });
  }
  const token = jwt.sign({ phone_number }, process.env.FORGOTPASSKEY, {
    expiresIn: "60m",
  });
  const shortUrl = await TinyURL.shorten(
    `http://192.168.71.167:5173/resetpass/${token}`
  );
  try {
    const msg = await client.messages.create({
      body: `Hello from AgriERP! Reset your password here: \n${shortUrl}`,
      from: process.env.TWILIONUMBER,
      to: `+91 ${phone_number}`,
    });
    res.send({ success: true, sid: msg.sid });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});
const resetpass = routes.post("/api/resetPass", async (req, res) => {
  const { token, password } = req.body;
  if (!token) {
    res.status(404).json({ msg: "Link may be expire!Try again" });
  }
  const isverify = await jwt.verify(token, process.env.FORGOTPASSKEY);
  const user = await signupModel.findOne({
    phone_number: isverify.phone_number,
  });

  if (user.passwordChangedAt) {
    const passwordChangeTime = parseInt(
      user.passwordChangedAt.getTime() / 1000
    );
    if (isverify.iat < passwordChangeTime) {
      return res
        .status(401)
        .json({ msg: "Token expired due to password change." });
    }
  }

  if (!isverify) {
    return res.status(404).json({ msg: "Link may be expire!Try again" });
  } else {
    const salt = await bcrypt.genSalt(12);
    const pass = await bcrypt.hash(password, salt);
    const updateRes = await signupModel.updateOne(
      { phone_number: isverify.phone_number },
      { $set: { password: pass, passwordChangedAt: Date.now() } }
    );

    if (updateRes.acknowledged) {
      console.log("all ohk");
      return res
        .status(200)
        .json({ msg: "Your Password Updated Successfully!" });
    }
  }
});

module.exports = sendSms;
