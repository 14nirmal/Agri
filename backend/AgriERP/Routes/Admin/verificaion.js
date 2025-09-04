const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const loginModel = require("../../DB/Loginschema");
const connect = require("../../DB/Connect");

const verifyLogin = router.get("/admin/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(403).json({ err: "Token Not Found" });
  }
  try {
    const { email } = jwt.verify(token, process.env.ADMINKEY);
    const data = await loginModel.findOne({ email });
    if (data.email) {
      const verify = await loginModel.updateOne({
        email,
        $set: { verified: true },
      });
      if (verify.acknowledged) {
        return res
          .status(200)
          .json({ msg: "Your Email Verified Successfully!" });
      }
      return res.status(200).json({ msg: "Try Again" });
    }
    return res
      .status(400)
      .json({ msg: "Your token may be not valid or expire!" });
  } catch (e) {
    return res
      .status(401)
      .json({ err: "Invalid Token or Link May be Expired " });
  }
});

module.exports = verifyLogin;
