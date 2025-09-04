const bcrypt = require("bcrypt");
const loginModel = require("../../DB/Loginschema");
const { default: mongoose, connect } = require("mongoose");
require("dotenv").config();

const addAdmin = async () => {
  const email = process.env.ADMINEMAIL;
  const user = await loginModel.findOne({ email });
  if (user) {
    console.log("Admin Already Exist!");
    return;
  }
  try {
    let haspass = await bcrypt.hash(process.env.ADMINPASSWORD, 10);
    const data = new loginModel({ email, password: haspass, verified: false });
    await data.save();
    console.log({ msg: "admin addded successfully!" });
  } catch (e) {
    console.log({ msg: e.message });
  } finally {
    mongoose.disconnect();
  }
};
addAdmin();
