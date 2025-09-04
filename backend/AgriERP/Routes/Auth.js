const jwt = require("jsonwebtoken");
const farmerModel = require("../DB/SignupSchema");
const { ObjectId } = require("mongodb");

const isAuthorized = async (req, res, next) => {
  if (!req.cookies.Token) {
    return res.status(401).json({
      user: null,
      msg: "Please Login first to access it",
      auth: false,
    });
  }
  try {
    if (req.cookies.Token) {
      const { _id, phone_number } = jwt.verify(
        req.cookies.Token,
        "AGRIERPFARMER"
      );
      const user = await farmerModel.findOne({
        _id: new ObjectId(_id),
        phone_number,
      });

      if (user) {
        const { first_name, last_name, status } = user;
        if (status != "active") {
          return res
            .status(403)
            .json({ msg: "Your Account is Disabled! Please contact admin" });
        }
        req.body.userInfo = { first_name, last_name };
        req.body.id = user._id;
        next();
        return;
      }
    }
  } catch (e) {
    console.log(e.message);
    res.status(401).json({
      user: null,
      msg: "please Login Again ! session may be expired",
      auth: false,
    });
  }
};
module.exports = isAuthorized;
